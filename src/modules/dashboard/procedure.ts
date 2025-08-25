import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/lib/prisma";
// import { ReviewStatus } from "@/generated/prisma";
import { TRPCError } from "@trpc/server";
// import { razorpayInstance } from "../razorpay/utils";

export const dashboardRouter = createTRPCRouter({
  getPRData: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        limit: z.number(),
      })
    )
    .mutation(async ({ input: { limit, page }, ctx }) => {
      const pullRequests = await db.pullRequest.findMany({
        where: {
          ownerUsername: ctx?.auth?.githubUsername,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      return pullRequests;
    }),
  getUageData: protectedProcedure
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

  // todo : yet to be completed
  getQuickCard: protectedProcedure.query(async () => {
    const pullRequests = await db.pullRequest.findMany();
  }),
});
