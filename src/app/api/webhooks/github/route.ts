import { inngest } from "@/inngest/client";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { githubOctokit } from "@/modules/github/utils";
import { db } from "@/lib/prisma";

import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

// Your GitHub webhook secret from environment
const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_APP_WEBHOOK_SECRET as string;
const TOKEN_CAP = 20000;

const VALID_ACTIONS = ["opened", "created", "synchronize"];

export const POST = async (req: NextRequest) => {
  try {
    const currTime = Date.now();

    const signature = req.headers.get("x-hub-signature-256");

    if (!signature) {
      return NextResponse.json(
        { message: "Signature missing" },
        { status: 401 }
      );
    }

    // Read raw body as ArrayBuffer and convert to Buffer
    const bodyArrayBuffer = await req.arrayBuffer();

    let retryCnt = 0;
    let isBodyParsed = false;

    let installation_id: string = "";
    let diff_url: string = "";
    let repositoryName: string = "";
    let payLoadEventType = "";
    let newCommitSha = "";
    let commentBody = "";

    let owner = "";
    let author = "";
    let repo = "";
    let pull_number = 0;

    while (retryCnt < 10 && !isBodyParsed) {
      retryCnt++;
      const payloadParsedResponse =
        await githubOctokit.parseGithubWebhookRequest(
          bodyArrayBuffer,
          signature
        );

      if (!payloadParsedResponse.success) {
        // return NextResponse.json(
        //   { message: payloadParsedResponse.message },
        //   { status: payloadParsedResponse.status }
        // );
        await new Promise((resolve) => setTimeout(resolve, 500));
        continue;
      }
      isBodyParsed = true;

      const payloadParsedResult = payloadParsedResponse.data;
      payLoadEventType = payloadParsedResult.action;
      if (!VALID_ACTIONS.includes(payLoadEventType)) {
        return NextResponse.json({
          message: `Action ${payLoadEventType} is not supported`,
        });
      }

      newCommitSha = payloadParsedResult?.pull_request?.head?.sha || "";
      commentBody = payloadParsedResult?.comment?.body || "";
      owner = payloadParsedResult?.repository?.owner?.login;
      author = payloadParsedResult?.sender.login;
      repo = payloadParsedResult?.repository?.name;
      pull_number =
        payloadParsedResult?.issue?.number ||
        payloadParsedResult?.pull_request?.number;
      // console.log(payloadParsedResult);

      console.log(JSON.stringify(payloadParsedResponse));

      // if (payloadParsedResult.action !== "opened") {
      //   return NextResponse.json({
      //     message: "Webhook processed successfully but was not a pull_req_open",
      //   });
      // }
      installation_id = payloadParsedResult?.installation.id || "";
      diff_url = payloadParsedResult?.pull_request?.diff_url || "";
      repositoryName = payloadParsedResult?.repository?.full_name || "";
    }

    if (!installation_id) {
      return NextResponse.json(
        { message: "INVALID_SECRET_KEY" },
        { status: 401 }
      );
    }

    // console.log(installation_id);

    // const isPrReviewEnabled = await db.connectedRepo.findUnique({
    //   where: {
    //     repoFullName: repositoryName,
    //     isConnected: true,
    //   },
    // });

    // if (!isPrReviewEnabled) {
    //   return NextResponse.json({ message: "Webhook processed successfully" });
    // }

    // let prDiffResponse:
    //   | {
    //       success: boolean;
    //       message: string;
    //       data: null;
    //       owner: null;
    //       repo: null;
    //       pull_number: null;
    //     }
    //   | {
    //       success: boolean;
    //       data: object;
    //       message: string;
    //       owner: string;
    //       repo: string;
    //       pull_number: string;
    //     } = {
    //   success: false,
    //   message: "",
    //   data: null,
    //   owner: null,
    //   repo: null,
    //   pull_number: null,
    // };

    // retryCnt = 0;
    // let gotPrDiffResponse = false;
    // while (retryCnt < 10 && !gotPrDiffResponse) {
    //   retryCnt++;
    //   prDiffResponse = await githubOctokit.differenceData(
    //     installation_id,
    //     diff_url
    //   );

    //   if (!prDiffResponse.success) {
    //     await new Promise((resolve) => setTimeout(resolve, 500));
    //   }

    //   gotPrDiffResponse = true;

    //   break;
    // }

    // const { owner, repo, pull_number } = prDiffResponse;

    const octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: process.env.GITHUB_APP_ID!,
        privateKey: process.env.GITHUB_APP_PRIVATE_KEY!.replace(/\\n/g, "\n"),
        installationId: installation_id, // Use the parameter, not env var
      },
    });

    // console.log(author);
    // let isLargePr = false;
    // if (!prDiffResponse.data) {
    //   return NextResponse.json(
    //     { message: "INVALID_SECRET_KEY" },
    //     { status: 401 }
    //   );
    // }

    const isRepoEnabled = await db.orgRepo.findUnique({
      where: {
        repoFullName: `${owner!}/${repo!}`,
        isConnected: true,
      },
    });

    if (!isRepoEnabled) {
      return NextResponse.json({ message: "Repo isn't enabled for AI review" });
    }

    // console.log("author :", author);

    const isAllowed = await db.userAsMemberAndOrg.findUnique({
      where: {
        isAllowed: true,
        orgname_teamMemberUsername: {
          orgname: owner!,
          teamMemberUsername: author,
        },
      },
    });

    // console.log("isAllowed :", isAllowed);
    if (!isAllowed) {
      return NextResponse.json({ message: "Author isn't allowed" });
    }

    const currDate = new Date();
    const subscription = await db.subscription.findFirst({
      where: {
        orgname: owner!,
        AND: [
          {
            cycleStart: {
              lte: currDate,
            },
          },
          {
            cycleEnd: {
              gte: currDate,
            },
          },
        ],
        status: "active",
      },
      include: {
        plan: true,
      },
    });

    // console.log("subscription :", subscription);

    const orgDataFromDb = await db.orgRepo.findUnique({
      where: {
        orgname: owner!,
        repoFullName: `${owner!}/${repo!}`,
      },
    });

    if (!orgDataFromDb) {
      return NextResponse.json({ message: "No org data found" });
    }

    const user = await db.user.findUnique({
      where: {
        username: orgDataFromDb?.ownerUsername,
      },
    });

    let onTrial = false;

    if (!user) {
      return NextResponse.json({ message: "No user found" });
    }

    onTrial = new Date(user?.trialEndAt).getTime() > Date.now();

    const isPaidUser =
      !subscription || (subscription && subscription?.status !== "active");

    if (payLoadEventType == "opened") {
      const { data: prData } = await octokit.pulls.get({
        owner: owner!,
        repo: repo!,
        pull_number: +pull_number!,
      });

      // const author = prData.user?.login;
      const title = prData.title;
      const body = prData.body;

      if (body?.includes("@gitroaster")) {
        if (body?.includes("@!ignore")) {
          return NextResponse.json({
            message: "PR ignored for automated review",
          });
        }
      }

      await inngest.send({
        name: "app/review-generator",
        data: {
          payload: {
            installation_id: installation_id,
            owner,
            repo,
            pull_number,
            author: prData.user?.login,
            isFreeUser: !isPaidUser,
            ownerUsername: orgDataFromDb?.ownerUsername!,
            currTime: Date.now(),
          },
        },
      });

      await db.pullRequest.create({
        data: {
          ownerUsername: orgDataFromDb?.ownerUsername!,
          repoFullName: `${owner!}/${repo!}`,
          orgname: owner!,
          author: author,
          pullNumber: +pull_number!,
          timeTakenToReview: 0,
          title,
        },
      });
    }

    // new commit added
    if (payLoadEventType == "synchronize") {
    }

    // new comment added
    if (payLoadEventType == "created") {
      // comment.body

      if (
        commentBody.includes("@gitroaster") &&
        !author.includes("gitroaster[bot]")
      ) {
        await inngest.send({
          name: "app/ai-chatbot",
          data: {
            payload: {
              installation_id: installation_id,
              owner,
              repo,
              pull_number,
              author,
              isFreeUser: !isPaidUser,
              ownerUsername: orgDataFromDb?.ownerUsername!,
              currTime: Date.now(),
            },
          },
        });
      }
    }

    return NextResponse.json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Webhook processed successfully",
      error,
    });
  }
};
// [
//   {
//     id: "01K39DGCNR06BE4Z416ZBSF1DK",
//     name: "app/review-generator",
//     data: {
//       payload: {
//         author: "MrVineetRaj",
//         currTime: 1755884040887,
//         installation_id: 82267012,
//         isFreeUser: false,
//         owner: "MrVineetRaj",
//         ownerUsername: "MrVineetRaj",
//         pull_number: "7",
//         repo: "testyty",
//       },
//     },
//     ts: 1755884040888,
//   },
// ];
