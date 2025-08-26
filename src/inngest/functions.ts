import { Octokit } from "@octokit/rest";
import { inngest } from "./client";
import { createAppAuth } from "@octokit/auth-app";
import fs from "fs";
import { OpenAIClient } from "@/lib/openai";
import { SYSTEM_PROMPT } from "@/constants/prompts";
import { db } from "@/lib/prisma";
import { envKeys } from "inngest/helpers/consts";
import { PullRequestStatus } from "@/generated/prisma";
const excludedExtensions = [
  // images
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".webp",
  ".ico",
  // yaml/toml
  ".yaml",
  ".yml",
  ".toml",
  ".txt",
  ".json",
  // video
  ".mp4",
  ".mov",
  ".avi",
  ".mkv",
  ".webm",
  ".flv",
  ".wmv",
  // audio
  ".mp3",
  ".wav",
  ".ogg",
  ".flac",
  ".aac",
  // other binaries
  ".pdf",
  ".zip",
  ".tar",
  ".gz",
  ".rar",
  ".7z",
  ".exe",
  ".dll",
  ".bin",
  ".iso",
];

const excludeFileWords = ["lock", "migration"];

export const reviewGenerator = inngest.createFunction(
  { id: "review-generator" },
  { event: "app/review-generator" },
  async ({ event, step }) => {
    // const eventId = event.id || Math.random().toString(36);

    // console.log(event?.data);

    const {
      payload: {
        installation_id,
        owner,
        repo,
        pull_number,
        author,
        isFreeUser,
        ownerUsername,
        currTime,
      },
    } = event?.data;

    const octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: process.env.GITHUB_APP_ID!,
        privateKey: process.env.GITHUB_APP_PRIVATE_KEY!.replace(/\\n/g, "\n"),
        installationId: installation_id, // Use the parameter, not env var
      },
    });

    await step.run("Placeholder description", async () => {
      await octokit.pulls.update({
        owner: owner,
        repo: repo,
        pull_number: pull_number,
        body: `
      🔥 **GitRoaster is firing up!**
      Hang tight – we’re reviewing your pull request to provide:
      - 📝 Code walkthrough
      - 🗂️ File change summaries
      - 📈 Diagrams and insights
      - 💡 Suggestions for improvements
      ⏳ **Your AI review will be ready shortly.**
                `,
      });
    });

    let fileContent: string = "";
    // await step.run("pre processing pr data", async () => {
    const files = [];
    for await (const response of octokit.paginate.iterator(
      octokit.pulls.listFiles,
      {
        owner: owner!,
        repo: repo!,
        pull_number: +pull_number!,
        per_page: 100,
      }
    )) {
      files.push(...response.data);
    }

    const fileData: {
      [filename: string]: string;
    } = {};
    const filenames = files
      .map((file) => {
        if (file.status !== "removed") {
          fileData[file.filename] = file.patch ? file.patch : "";

          return file.filename;
        } else {
          return "";
        }
      })
      .filter((filename) => {
        // Exclude migrations (by folder name)
        if (!filename) return false;
        if (filename.toLowerCase().includes("migration")) return false;
        for (let i = 0; i < excludeFileWords.length; i++) {
          if (filename.toLocaleLowerCase().includes(excludeFileWords[i]))
            return false;
        }

        // Exclude by extension (case-insensitive)
        return !excludedExtensions.some((ext) =>
          filename.toLowerCase().endsWith(ext)
        );
      });

    // let fileRead: string[] = [];
    for (const file of filenames) {
      fileContent += file + "\n" + fileData[file] + "\n\n";
    }

    const openAiClient = new OpenAIClient();
    let tokenCount = 0;

    // await step.sleep("Generating review", 500);

    tokenCount = openAiClient.countToken(fileContent);

    if (isFreeUser) {
      if (tokenCount < 21000) {
        await step.run("Summary for free user", async () => {
          try {
            const res = await openAiClient.chatgptModelFree(
              SYSTEM_PROMPT.summary.header,
              fileContent
            );
            if (res) {
              const aiResp = JSON.parse(res);

              // console.log(aiResp);

              await octokit.pulls.update({
                owner: owner,
                repo: repo,
                pull_number: pull_number,

                body: aiResp.summary,
              });
            }
          } catch (error) {
            // console.log(error);
          }
          await db.pullRequest.upsert({
            where: {
              repoFullName_pullNumber: {
                repoFullName: `${owner!}/${repo!}`,
                pullNumber: +pull_number!,
              },
            },
            update: {
              timeTakenToReview: currTime ? Date.now() - currTime : 60000,
              charCount: fileContent.length,
              tokenCount: tokenCount,
              status: PullRequestStatus.SUCCESS,
            },
            create: {
              ownerUsername,
              orgname: owner,
              repoFullName: `${owner!}/${repo!}`,
              pullNumber: +pull_number!,
              timeTakenToReview: currTime ? Date.now() - currTime : 60000,
              author,
              charCount: fileContent.length,
              tokenCount: tokenCount,
              status: PullRequestStatus.SUCCESS,
            },
          });
        });
      } else {
        await step.run(
          "Summary for free user for large pull request",
          async () => {
            try {
              const res = await openAiClient.chatgptModelFree(
                SYSTEM_PROMPT.largePullRequests,
                JSON.stringify(filenames)
              );
              if (res) {
                const aiResp = JSON.parse(res);

                await octokit.pulls.update({
                  owner: owner,
                  repo: repo,
                  pull_number: pull_number,
                  body: aiResp.summary,
                });
              }
            } catch (error) {
              // console.log(error);
            }
            await db.pullRequest.upsert({
              where: {
                repoFullName_pullNumber: {
                  repoFullName: `${owner!}/${repo!}`,
                  pullNumber: +pull_number!,
                },
              },
              update: {
                timeTakenToReview: currTime ? Date.now() - currTime : 60000,
                charCount: fileContent.length,
                tokenCount: tokenCount,
                status: PullRequestStatus.SUMMARIZED,
              },
              create: {
                ownerUsername,
                orgname: owner,
                repoFullName: `${owner!}/${repo!}`,
                pullNumber: +pull_number!,
                timeTakenToReview: currTime ? Date.now() - currTime : 60000,
                author,
                charCount: fileContent.length,
                tokenCount: tokenCount,
                status: PullRequestStatus.SUMMARIZED,
              },
            });
          }
        );
      }
      return { char: fileContent.length, token: tokenCount };
    }

    if (tokenCount < 51000) {
      await step.run("AI review for paid users ", async () => {
        const res = await openAiClient.chatgptModelPaid(
          SYSTEM_PROMPT.header,
          fileContent
        );
        if (res) {
          const aiResp = JSON.parse(res);

          try {
            await octokit.issues.createComment({
              owner: owner,
              repo: repo,
              issue_number: pull_number,
              body: aiResp.overall_review,
            });
          } catch (error) {
            // console.log(error);
          }

          try {
            await octokit.pulls.createReview({
              owner: owner,
              repo: repo,
              pull_number: pull_number,
              event: "COMMENT",
              body: aiResp.critical_review.description,
              comments: aiResp.critical_review.review,
            });
          } catch (error) {
            // console.log(error);
          }

          try {
            const summaryResponse = await openAiClient.chatgptModelFree(
              SYSTEM_PROMPT.summary.header,
              aiResp.overall_review
            );
            if (summaryResponse) {
              const parsedSummary = JSON.parse(summaryResponse);
              // console.log(parsedSummary);
              await octokit.pulls.update({
                owner: owner,
                repo: repo,
                pull_number: pull_number,

                body: parsedSummary.summary,
              });
            }
          } catch (error) {
            // console.log(error);
          }

          await db.pullRequest.upsert({
            where: {
              repoFullName_pullNumber: {
                repoFullName: `${owner!}/${repo!}`,
                pullNumber: +pull_number!,
              },
            },
            update: {
              timeTakenToReview: currTime ? Date.now() - currTime : 60000,
              charCount: fileContent.length,
              tokenCount: tokenCount,
              status: PullRequestStatus.SUCCESS,
            },
            create: {
              ownerUsername,
              orgname: owner,
              repoFullName: `${owner!}/${repo!}`,
              pullNumber: +pull_number!,
              timeTakenToReview: currTime ? Date.now() - currTime : 60000,
              author,
              charCount: fileContent.length,
              tokenCount: tokenCount,
              status: PullRequestStatus.SUCCESS,
            },
          });
        }
      });
    } else {
      await step.run(
        "Summary for paid users for large pull request",
        async () => {
          try {
            const res = await openAiClient.chatgptModelFree(
              SYSTEM_PROMPT.largePullRequests,
              JSON.stringify(filenames)
            );
            if (res) {
              const aiResp = JSON.parse(res);
              await octokit.pulls.update({
                owner: owner,
                repo: repo,
                pull_number: pull_number,
                body: aiResp.summary,
              });
            }

            await db.pullRequest.upsert({
              where: {
                repoFullName_pullNumber: {
                  repoFullName: `${owner!}/${repo!}`,
                  pullNumber: +pull_number!,
                },
              },
              update: {
                timeTakenToReview: currTime ? Date.now() - currTime : 60000,
                charCount: fileContent.length,
                tokenCount: tokenCount,
                status: PullRequestStatus.SUMMARIZED,
              },
              create: {
                ownerUsername,
                orgname: owner,
                repoFullName: `${owner!}/${repo!}`,
                pullNumber: +pull_number!,
                timeTakenToReview: currTime ? Date.now() - currTime : 60000,
                author,
                charCount: fileContent.length,
                tokenCount: tokenCount,
                status: PullRequestStatus.SUMMARIZED,
              },
            });
          } catch (error) {
            // console.log(error);
          }
        }
      );
    }

    return { char: fileContent.length, token: tokenCount };
  }
);
