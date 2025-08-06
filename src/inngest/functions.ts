import { Octokit } from "@octokit/rest";
import { inngest } from "./client";
import { createAppAuth } from "@octokit/auth-app";
import fs from "fs";
import { OpenAIClient } from "@/lib/openai";
import { SYSTEM_PROMPT } from "@/constants/prompts";
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
let triggerCount = 0;

export const reviewGenerator = inngest.createFunction(
  { id: "review-generator" },
  { event: "app/review-generator" },
  async ({ event, step }) => {
    const eventId = event.id || Math.random().toString(36);
    console.log(
      `Function started - Event ID: ${eventId}, Count: ${triggerCount++}`
    );

    const {
      payload: {
        installation_id,
        owner,
        repo,
        pull_number,
        author,
        isFreeUser,
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
    const { data: files } = await octokit.pulls.listFiles({
      owner: owner!,
      repo: repo!,
      pull_number: +pull_number!,
    });

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
      if (tokenCount < 20000) {
        await step.run("Summary for free user", async () => {
          try {
            const res = await openAiClient.chatgptModel(
              SYSTEM_PROMPT.summary.header,
              fileContent
            );
            if (res) {
              const aiResp = JSON.parse(res);

              console.log(aiResp);

              await octokit.pulls.update({
                owner: owner,
                repo: repo,
                pull_number: pull_number,

                body: aiResp.summary,
              });
            }
          } catch (error) {
            console.log(error);
          }
        });
      }
      return { char: fileContent.length, token: tokenCount };
    }

    await step.run("AI review for paid users ", async () => {
      if (tokenCount < 50000) {
        const res = await openAiClient.chatgptModel(
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
            console.log(error);
          }

          try {
         await octokit.pulls.createReview({
              owner: owner,
              repo: repo,
              pull_number: pull_number,
              event: "COMMENT",
              body: aiResp.critical_review.description,
              comments: aiResp.critical_review.review ,
            });
            
          } catch (error) {
            console.log(error);
          }

          try {
            const summaryResponse = await openAiClient.chatgptModel(
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
            console.log(error);
          }
        }
      }
    });
    // console.log()
    return { char: fileContent.length, token: tokenCount };
  }
);
