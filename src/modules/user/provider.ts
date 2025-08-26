import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/lib/prisma";
// import { ReviewStatus } from "@/generated/prisma";
import { TRPCError } from "@trpc/server";
// import { razorpayInstance } from "../razorpay/utils";

export const userRouter = createTRPCRouter({
  syncUser: protectedProcedure.query(async ({ ctx }) => {
    try {
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
        console.log("old user", data);
        const {
          installationId: installationIds = [],
          subscriptions = [],
          ...existingUser
        } = data;

        const subscription = subscriptions.filter((subscription) => {
          return subscription.orgname === existingUser.defaultOrg;
        });

        const installationId = installationIds.filter((item) => {
          return item.orgname === existingUser.defaultOrg;
        });

        return {
          user: existingUser,
          subscription: subscription[0] || {},
          installationId: installationId[0]?.installationId ?? "",
        };
      }

      const currDate = new Date();
      const trialStartAt = currDate;
      const trialEndAt = new Date(currDate.getTime() + 8 * 24 * 60 * 60 * 1000);
      trialEndAt.setHours(0, 0, 0, 0);

      const user = await db.user.create({
        data: {
          username: ctx?.auth?.githubUsername!,
          email: ctx?.auth?.user?.email!,
          defaultOrg: ctx?.auth?.githubUsername!,
          trialStartAt,
          trialEndAt,
        },
      });

      await db.userAsMemberAndOrg.create({
        data: {
          orgname: user.defaultOrg,
          teamMemberUsername: user.username,
          isAllowed: true,
        },
      });

      console.log("new user", user);

      return {
        user,
        subscription: {},
        installationId: "",
      };
    } catch (error) {
      console.log(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),
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

        console.log("new userInstallationId", userInstallationId);
        return { success: true, data: userInstallationId };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update installation id, try again",
        });
      }
    }),
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
