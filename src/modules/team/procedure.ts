import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/lib/prisma";
// import { ReviewStatus } from "@/generated/prisma";
import { TRPCError } from "@trpc/server";
import { ContextMenuContent } from "@radix-ui/react-context-menu";
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
    .query(async ({ input: { username ,orgname}, ctx }) => {
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
});
