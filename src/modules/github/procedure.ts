import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/lib/prisma";

import { TRPCError } from "@trpc/server";


export const githubRouter = createTRPCRouter({
  /**
   * This endpoint is responsible to fetch connected repo details stored in database
   *
   * @param orgname orgname or username
   */
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
  /**
   * This endpoint is responsible to disable a repo for pull request reviews
   *
   * @param orgname orgname or username
   * @param repoFullName full repo name in format  - <orgname>/<repo_name>
   */
  disconnectRepo: protectedProcedure
    .input(
      z.object({
        orgname: z.string(),
        repoFullName: z.string(),
      })
    )
    .mutation(async ({ input: { orgname, repoFullName } }) => {
      try {
        await db.orgRepo.update({
          where: {
            orgname,
            repoFullName,
          },
          data: {
            isConnected: false,
          },
        });
      } catch (error) {
        // console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to connect repo try again later",
        });
      }
    }),

  /**
   * This endpoint is responsible to enable a repo for pull request reviews
   *
   * @param orgname orgname or username
   * @param repoFullName full repo name in format  - <orgname>/<repo_name>
   */
  connectRepo: protectedProcedure
    .input(
      z.object({
        orgname: z.string(),
        repoFullName: z.string(),
      })
    )
    .mutation(async ({ input: { orgname, repoFullName }, ctx }) => {
      try {

        await db.orgRepo.upsert({
          where: {
            repoFullName,
          },
          create: {
            orgname,
            repoFullName,
            isConnected: true,
            ownerUsername: ctx?.auth.githubUsername!,
          },
          update: {
            isConnected: true,
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
});
