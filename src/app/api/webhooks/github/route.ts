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

export const POST = async (req: NextRequest) => {
  const currTime = Date.now();
  const signature = req.headers.get("x-hub-signature-256");

  if (!signature) {
    return NextResponse.json({ message: "Signature missing" }, { status: 401 });
  }

  // Read raw body as ArrayBuffer and convert to Buffer
  const bodyArrayBuffer = await req.arrayBuffer();

  let retryCnt = 0;
  let isBodyParsed = false;

  let installation_id: string = "";
  let diff_url: string = "";
  let repositoryName: string = "";
  while (retryCnt < 10 && !isBodyParsed) {
    retryCnt++;
    const payloadParsedResponse = await githubOctokit.parseGithubWebhookRequest(
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
    // console.log(payloadParsedResult);
    if (payloadParsedResult.action !== "opened") {
      return NextResponse.json({
        message: "Webhook processed successfully but was not a pull_req_open",
      });
    }
    installation_id = payloadParsedResult.installation.id;
    diff_url = payloadParsedResult.pull_request.diff_url;
    repositoryName = payloadParsedResult.repository.full_name;
  }

  if (!installation_id) {
    return NextResponse.json(
      { message: "INVALID_SECRET_KEY" },
      { status: 401 }
    );
  }

  // const isPrReviewEnabled = await db.connectedRepo.findUnique({
  //   where: {
  //     repoFullName: repositoryName,
  //     isConnected: true,
  //   },
  // });

  // if (!isPrReviewEnabled) {
  //   return NextResponse.json({ message: "Webhook processed successfully" });
  // }

  let prDiffResponse:
    | {
        success: boolean;
        message: string;
        data: null;
        owner: null;
        repo: null;
        pull_number: null;
      }
    | {
        success: boolean;
        data: any;
        message: string;
        owner: string;
        repo: string;
        pull_number: string;
      } = {
    success: false,
    message: "",
    data: null,
    owner: null,
    repo: null,
    pull_number: null,
  };

  retryCnt = 0;
  let gotPrDiffResponse = false;
  while (retryCnt < 10 && !gotPrDiffResponse) {
    retryCnt++;
    prDiffResponse = await githubOctokit.differenceData(
      installation_id,
      diff_url
    );

    if (!prDiffResponse.success) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    gotPrDiffResponse = true;

    break;
  }

  console.log("prDiffResponse new org", prDiffResponse);

  let { owner, repo, pull_number } = prDiffResponse;

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: process.env.GITHUB_APP_ID!,
      privateKey: process.env.GITHUB_APP_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      installationId: installation_id, // Use the parameter, not env var
    },
  });

  const { data: prData } = await octokit.pulls.get({
    owner: owner!,
    repo: repo!,
    pull_number: +pull_number!,
  });

  const author = prData.user?.login;

  // Todo : Plan filter here

  // console.log(author);
  // let isLargePr = false;
  if (!prDiffResponse.data) {
    return NextResponse.json(
      { message: "INVALID_SECRET_KEY" },
      { status: 401 }
    );
  }

  // if (diff_data_as_string.length / 4 > TOKEN_CAP) {
  //   isLargePr = true;

  //   diff_data_as_string = "";
  // }

  // const { data: files } = await octokit.pulls.listFiles({
  //   owner: owner!,
  //   repo: repo!,
  //   pull_number: +pull_number!,
  // });

  // const filenames = files.map((file) => file.filename);

  // const { data: prData } = await octokit.pulls.get({
  //   owner: owner!,
  //   repo: repo!,
  //   pull_number: +pull_number!,
  // });

  // await db.pullRequestReview.create({
  //   data: {
  //     repoFullName: `${owner!}/${repo!}`,
  //     authorUsername: prData.user?.login,
  //     ownerUsername: author!,
  //     prNumber: +pull_number!,
  //     title: prData.title,
  //     reviewedAt: new Date(currTime + 60 * 1000),
  //     timeTaken: 0,
  //   },
  // });

  await inngest.send({
    name: "app/review-generator",
    data: {
      payload: {
        installation_id: installation_id,
        owner,
        repo,
        pull_number,
        author: prData.user?.login,
        // data: diff_data_as_string,
        // filenames: filenames,
        // isLargePr: isLargePr,
        // executionStartedAt: currTime,
        // description_id: prData.id,
        // hash_sha: prData.head.sha,
      },
    },
  });

  return NextResponse.json({ message: "Webhook processed successfully" });
};
