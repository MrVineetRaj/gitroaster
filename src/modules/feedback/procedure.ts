import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/lib/prisma";
// import { ReviewStatus } from "@/generated/prisma";
import { TRPCError } from "@trpc/server";

import { InvitationStatus, UserAsMemberAndOrg } from "@/generated/prisma";
// import { razorpayInstance } from "../razorpay/utils";

export const feedbackRouter = createTRPCRouter({
  showBillingInterests: protectedProcedure
    .input(
      z.object({
        message: z.string().optional(),
      })
    )
    .mutation(async ({ input: { message }, ctx }) => {
      try {
        const username = ctx.auth.githubUsername!;
        const email = ctx.auth.user?.email!;
        await db.billingInterest.create({
          data: {
            message,
            username,
            email,
          },
        });
        return {
          mssage: "Interest recorded",
          success: true,
        };
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          throw new TRPCError({
            code: "CONFLICT",
            message: error.message,
          });
          return;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  getInterest: protectedProcedure.query(async ({ ctx }) => {
    const interest = await db.billingInterest.findUnique({
      where: {
        username: ctx?.auth.githubUsername!,
      },
    });

    return { mssage: "Alreayd showed interest", data: interest, success: true };
  }),
});
