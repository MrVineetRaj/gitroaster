import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/lib/prisma";
// import { ReviewStatus } from "@/generated/prisma";
import { TRPCError } from "@trpc/server";

import { InvitationStatus } from "@/generated/prisma";
// import { razorpayInstance } from "../razorpay/utils";

export const teamRouter = createTRPCRouter({
  getTeamMembers: protectedProcedure
    .input(
      z.object({
        orgname: z.string(),
      })
    )
    .query(async ({ input: { orgname } }) => {
      const members = await db.userAsMemberAndOrg.findMany({
        where: {
          orgname,
        },
      });

      return members ?? [];
    }),
  inviteTeamMembers: protectedProcedure
    .input(
      z.object({
        orgname: z.string(),
        username: z.string(),
        email: z.string(),
      })
    )
    .mutation(async ({ input: { orgname, username, email }, ctx }) => {
      await db.invitations.create({
        data: {
          orgname,
          senderUserName: ctx.auth?.githubUsername!,
          username,
          email: email,
          isResponded: false,
        },
      });
    }),

  getInvitation: protectedProcedure
    .input(
      z.object({
        username: z.string(),
        orgname: z.string(),
      })
    )
    .query(async ({ input: { orgname }, ctx }) => {
      const sentInvitations = await db.invitations.findMany({
        where: {
          senderUserName: ctx?.auth?.githubUsername!,
          orgname,
        },
      });

      const receivedInvitations = await db.invitations.findMany({
        where: {
          username: ctx?.auth?.githubUsername!,
        },
      });

      const classifiedInvitations = {
        sent: sentInvitations,
        received: receivedInvitations,
      };

      return classifiedInvitations;
    }),
  updateInvitationStatus: protectedProcedure
    .input(
      z.object({
        orgname: z.string(),
        isAccepted: z.boolean(),
        invitationId: z.string(),
      })
    )
    .mutation(async ({ input: { isAccepted, invitationId, orgname }, ctx }) => {
      try {
        await db.invitations.update({
          where: {
            id: invitationId,
            username: ctx?.auth?.githubUsername!,
          },
          data: {
            status: isAccepted
              ? InvitationStatus.accepted
              : InvitationStatus.rejected,
            isResponded: true,
          },
        });

        if (isAccepted) {
          await db.userAsMemberAndOrg.create({
            data: {
              orgname,
              teamMemberUsername: ctx?.auth?.githubUsername!,
              isAllowed: false,
            },
          });
        }
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Something wrong try again later",
        });
      }
    }),
});
