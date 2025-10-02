import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/lib/prisma";

import { TRPCError } from "@trpc/server";

export const feedbackRouter = createTRPCRouter({
  /**
   * This endpoint is responsible to collect user interests if they want billing
   *
   * @param message string
   */
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
          message: "Interest recorded",
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

  /**
   * This endpoint is responsible to check if a user already showed interest for billing
   */
  getInterest: protectedProcedure.query(async ({ ctx }) => {
    const interest = await db.billingInterest.findUnique({
      where: {
        username: ctx?.auth.githubUsername!,
      },
    });

    return {
      message: "Already showed interest",
      data: interest,
      success: true,
    };
  }),
});
