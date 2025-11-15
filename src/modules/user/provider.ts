import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/lib/prisma";
// import { ReviewStatus } from "@/generated/prisma";
import { TRPCError } from "@trpc/server";
// import { razorpayInstance } from "../razorpay/utils";

export const userRouter = createTRPCRouter({
  /**
   *
   * This endpoint is responsible for checking wether user is synced with database or not
   */
  syncUser: protectedProcedure.query(async ({ ctx }) => {
    try {
      /**
       * Here it tries to fetch the user details from database for certain user
       */
      const data = await db.user.findUnique({
        where: {
          username: ctx.auth?.githubUsername,
        },
        include: {
          subscriptions: true,
          installationId: true,
        },
      });
      if (data) {
        /**
         * If user found it extracts subscriptions details and installation id
         */
        const {
          installationId: installationIds = [],
          subscriptions = [],
          ...existingUser
        } = data;

        // extracting subscription detail for certain organization
        const subscription = subscriptions.filter((subscription) => {
          return subscription.orgname === existingUser.defaultOrg;
        });

        // extracting installationId for certain organization
        const installationId = installationIds.filter((item) => {
          return item.orgname === existingUser.defaultOrg;
        });

        return {
          user: existingUser,
          subscription: subscription[0] || {},
          installationId: installationId[0]?.installationId ?? "",
        };
      }

      /**
       * If user is not found means new user
       * - create new entry here
       * - attach 7 day free trial to it
       */
      const currDate = new Date();
      const trialStartAt = currDate;
      const trialEndAt = new Date(currDate.getTime() + 8 * 24 * 60 * 60 * 1000);
      trialEndAt.setHours(0, 0, 0, 0);

      const user = await db.user.upsert({
        where: {
          username: ctx.auth?.githubUsername,
        },
        update: {},
        create: {
          username: ctx?.auth?.githubUsername!,
          email: ctx?.auth?.user?.email!,
          defaultOrg: ctx?.auth?.githubUsername!,
          trialStartAt,
          trialEndAt,
        },
      });

      // add user as first member in the organization with orgname as username it self
      await db.userAsMemberAndOrg.upsert({
        where: {
          orgname_teamMemberUsername: {
            orgname: user.defaultOrg,
            teamMemberUsername: user.username,
          },
        },
        update: {},
        create: {
          orgname: user.defaultOrg,
          teamMemberUsername: user.username,
          isAllowed: true,
        },
      });

      return {
        user,
        subscription: {},
        installationId: "",
      };
    } catch (error) {
      console.log(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to sync user",
      });
    }
  }),

  /**
   *
   * This endpoint is responsible for updating installation id for certain organization or user account
   *
   * @param orgname string
   * @param installationId  string
   */
  updateInstallationId: protectedProcedure
    .input(
      z.object({
        orgname: z.string(),
        installationId: z.string(),
      })
    )
    .mutation(async ({ input: { orgname, installationId }, ctx }) => {
      try {
        const userInstallationId = await db.installationId.upsert({
          where: {
            orgname_ownerUsername: {
              orgname,
              ownerUsername: ctx.auth?.githubUsername!,
            },
          },
          update: {
            installationId: installationId,
          },
          create: {
            orgname,
            ownerUsername: ctx.auth?.githubUsername!,
            installationId: installationId,
          },
        });

        // console.log("new userInstallationId", userInstallationId);
        return { success: true, data: userInstallationId };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update installation id, try again",
        });
      }
    }),

  /**
   *
   * This endpoint updates default org for user 
   *
   * @param orgname string
   */
  updateDefaultGithubOrg: protectedProcedure
    .input(
      z.object({
        orgname: z.string(),
      })
    )
    .mutation(async ({ input: { orgname }, ctx }) => {
      try {
        await db.user.update({
          where: {
            username: ctx.auth?.githubUsername!,
          },
          data: {
            defaultOrg: orgname,
          },
        });

        await db.userAsMemberAndOrg.upsert({
          where: {
            orgname_teamMemberUsername: {
              orgname,
              teamMemberUsername: ctx.auth?.githubUsername!,
            },
          },
          update: {
            updatedAt: new Date(),
          },
          create: {
            orgname,
            teamMemberUsername: ctx.auth?.githubUsername!,
            isAllowed: true,
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Not able to change default org try again later",
        });
      }
    }),
});
