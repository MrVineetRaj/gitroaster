import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/lib/prisma";
// import { ReviewStatus } from "@/generated/prisma";
import { TRPCError } from "@trpc/server";
// import { razorpayInstance } from "../razorpay/utils";

export const githubRouter = createTRPCRouter({
  getAllConnectedRepo: protectedProcedure
    .input(
      z.object({
        orgname: z.string(),
      })
    )
    .query(async ({ input: { orgname } }) => {
      const connectedRepo = await db.orgRepo.findMany({
        where: {
          orgname,
        },
      });

      return connectedRepo || [];
    }),
  disconnectRepo: protectedProcedure
    .input(
      z.object({
        orgname: z.string(),
        repoFullName: z.string(),
      })
    )
    .mutation(async ({ input: { orgname, repoFullName } }) => {
      try {
        await db.orgRepo.delete({
          where: {
            orgname,
            repoFullName,
          },
        });
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to connect repo try again later",
        });
      }
    }),
  connectRepo: protectedProcedure
    .input(
      z.object({
        orgname: z.string(),
        repoFullName: z.string(),
      })
    )
    .mutation(async ({ input: { orgname, repoFullName }, ctx }) => {
      try {
        // const connectedRepos = await db.orgRepo.findMany({
        //   where: { orgname, repoFullName, isConnected: true },
        // });

        //  subscription based logic

        await db.orgRepo.create({
          data: {
            orgname,
            repoFullName,
            isConnected: true,
            ownerUsername: ctx?.auth.githubUsername!,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to connect repo try again later",
        });
      }
    }),
});
