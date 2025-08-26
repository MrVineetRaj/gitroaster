import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/lib/prisma";
// import { ReviewStatus } from "@/generated/prisma";
import { TRPCError } from "@trpc/server";
import { PullRequestStatus, SubscriptionStatus } from "@/generated/prisma";
// import { razorpayInstance } from "../razorpay/utils";

export const dashboardRouter = createTRPCRouter({
  getPRData: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        limit: z.number(),
        orgname: z.string(),
      })
    )
    .mutation(async ({ input: { limit, page, orgname }, ctx }) => {
      const pullRequests = await db.pullRequest.findMany({
        where: {
          ownerUsername: ctx?.auth?.githubUsername,
          orgname,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      return pullRequests;
    }),
  getUsageData: protectedProcedure
    .input(
      z.object({
        days: z.number(),
        orgname: z.string(),
        endDateInMS: z.number(),
      })
    )
    .query(async ({ input: { days, orgname, endDateInMS }, ctx }) => {
      try {
        const startDateInMS = endDateInMS - days * 24 * 60 * 60 * 1000;
        const startDate = new Date(startDateInMS);
        const endDate = new Date(endDateInMS);
        startDate.setHours(0, 0, 0, 0);

        const results = await db.pullRequest
          .groupBy({
            by: ["createdAt"],
            where: {
              ownerUsername: ctx?.auth?.githubUsername, // filter by user
              orgname: orgname, // filter by org
              createdAt: {
                gte: startDate, // start date
                lte: endDate, // end date
              },
              status: PullRequestStatus.SUCCESS,
            },
            _count: {
              id: true, // count of pull requests
            },
            _sum: {
              tokenCount: true, // sum of tokens
            },
          })
          .then((results) => {
            // Transform to the desired format
            return results.map((item) => ({
              date: item.createdAt.toISOString().split("T")[0], // format as YYYY-MM-DD
              pull_requests: item._count.id,
              tokens: item._sum.tokenCount || 0,
            }));
          });

        const dataMap: {
          [date: string]: {
            pull_requests: number;
            tokens: number;
          };
        } = {};
        results.forEach((item) => {
          const { date, pull_requests, tokens } = item;
          const tempPR = dataMap[date]?.pull_requests || 0;
          const tempToken = dataMap[date]?.tokens || 0;
          dataMap[date] = {
            tokens: tempToken + tokens || 0,
            pull_requests: tempPR + pull_requests || 0,
          };
        });

        const chartData: {
          date: string;
          pull_requests: number;
          tokens: number;
        }[] = [];

        Object.entries(dataMap).forEach((entry) => {
          chartData.push({
            date: entry[0],
            pull_requests: entry[1].pull_requests,
            tokens: entry[1].tokens,
          });
        });

        console.log(chartData);
        return chartData;
      } catch (error) {
        console.log(error);
        const chartData: {
          date: string;
          pull_requests: number;
          tokens: number;
        }[] = [];

        return chartData;
      }
    }),

  getQuickCard: protectedProcedure
    .input(
      z.object({
        orgname: z.string(),
      })
    )
    .query(async ({ input: { orgname }, ctx }) => {
      console.log(orgname);
      const pullRequestData = await db.pullRequest.aggregate({
        where: {
          ownerUsername: ctx?.auth?.githubUsername,
          orgname,
          status: PullRequestStatus.SUCCESS,
        },
        _sum: {
          timeTakenToReview: true,
          tokenCount: true, // Add this
        },
        _count: {
          id: true,
        },
      });
      const currTime = new Date();
      const subscription = await db.subscription.findUnique({
        where: {
          orgname_username: {
            orgname,
            username: ctx?.auth.githubUsername!,
          },
          status: SubscriptionStatus.active,
          cycleStart: {
            lte: currTime,
          },
          cycleEnd: {
            gte: currTime,
          },
        },
      });

      const user = await db.user.findUnique({
        where: {
          username: ctx?.auth.githubUsername!,
          trialStartAt: {
            lte: currTime,
          },
          trialEndAt: {
            gte: currTime,
          },
        },
      });

      currTime.setDate(1);
      const cycleStart =
        subscription?.cycleStart?.getMilliseconds() ||
        user?.trialEndAt?.getMilliseconds() ||
        currTime.getMilliseconds();

      const cycleStartAt = new Date(cycleStart);
      const pullRequestDataWeekly = await db.pullRequest.aggregate({
        where: {
          ownerUsername: ctx?.auth?.githubUsername,
          orgname,
          createdAt: {
            gte: cycleStartAt,
          },
          status: PullRequestStatus.SUCCESS,
        },
        _sum: {
          timeTakenToReview: true,
          tokenCount: true, // Add this
        },
        _count: {
          id: true,
        },
      });

      // Calculate total tokens
      // const totalTokens = pullRequests.reduce(
      //   (sum, pr) => sum + (pr.tokenCount || 0),
      //   0
      // );

      const repoConnected = await db.orgRepo.count({
        where: {
          ownerUsername: ctx?.auth?.githubUsername, // filter by user
          orgname: orgname, // filter by org
          isConnected: true,
        },
      });

      // avgTimeTaken: pullRequestData._count.id > 0 ? +(pullRequestData._sum.timeTakenToReview || 0) / pullRequestData._count.id : 0,
      return {
        pullRequestData: {
          avgTimeTaken:
            pullRequestData._count.id > 0
              ? +(pullRequestData._sum.timeTakenToReview || 0) /
                pullRequestData._count.id
              : 0,
          tokenCount: pullRequestData._sum.tokenCount,
          _count: pullRequestData._count, // Add this
        },
        pullRequestDataMonthly: {
          avgTimeTaken:
            pullRequestDataWeekly._count.id > 0
              ? +(pullRequestDataWeekly._sum.timeTakenToReview || 0) /
                pullRequestDataWeekly._count.id
              : 0,
          tokenCount: pullRequestDataWeekly._sum.tokenCount,
          _count: pullRequestDataWeekly._count, // Add this
        },
        repoConnected,
      };
      // ...existing code...
    }),
});
