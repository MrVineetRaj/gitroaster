import { z } from "zod";
import {
  adminProtectedProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { db } from "@/lib/prisma";
// import { ReviewStatus } from "@/generated/prisma";
import { TRPCError } from "@trpc/server";
import { ContextMenuContent } from "@radix-ui/react-context-menu";
import { InvitationStatus } from "@/generated/prisma";
import { razorpayInstance } from "./utils";
// import { razorpayInstance } from "../razorpay/utils";

export const razorPayRouter = createTRPCRouter({
  seedRazorPayPlans: adminProtectedProcedure.mutation(async () => {
    const oldPlans = await db.plan.findMany({
      where: {
        OR: [
          {
            isActive: true,
          },
        ],
      },
      select: {
        planId: true,
        isActive: true,
        isPopular: true,
      },
    });

    const prevPlanMetadata: Record<string, (typeof oldPlans)[0]> = {};

    console.log(oldPlans);
    oldPlans.forEach((plan) => {
      prevPlanMetadata[plan.planId] = plan;
    });

    oldPlans.forEach((plan) => {
      prevPlanMetadata[plan.planId] = plan;
    });

    const plans = await razorpayInstance.getAllPlans();

    await db.plan.deleteMany();

    const seededPlans = await db.plan.createManyAndReturn({
      data: plans.items.map((plan) => {
        const features: string[] =
          JSON.parse((plan?.notes?.features as string) ?? "[{}]").map(
            (feat: { label: string }) => {
              if (!feat?.label) {
                return "Nothing";
              }
              return feat.label;
            }
          ) || [];
        return {
          planId: plan.id,
          interval: plan.interval,
          period: plan.period,
          name: plan.item.name,
          description: plan.item.description!,
          unitAmount: +plan.item.amount,
          currency: plan.item.currency,
          features,
          isActive: prevPlanMetadata[plan.id]?.isActive || false,
          isPopular: prevPlanMetadata[plan.id]?.isPopular || false,
        };
      }),
    });
    return {
      message: "Successfully seeded",
      plans: seededPlans,
    };
  }),
  getAllPlans: adminProtectedProcedure.query(async () => {
    const plans = await db.plan.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
    return plans || [];
  }),
  toggleActivePlanStatus: adminProtectedProcedure
    .input(
      z.object({
        planId: z.string(),
        prevStatus: z.boolean(),
      })
    )
    .mutation(async ({ input: { planId, prevStatus } }) => {
      try {
        await db.plan.update({
          where: {
            planId,
          },
          data: {
            isActive: !prevStatus,
          },
        });

        return {
          code: "SUCCESS",
          message: "Plan marked as active",
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  markPopularPlan: adminProtectedProcedure
    .input(
      z.object({
        planId: z.string(),
        prevStatus: z.boolean(),
      })
    )
    .mutation(async ({ input: { planId, prevStatus } }) => {
      try {
        await db.plan.update({
          where: {
            planId,
          },
          data: {
            isPopular: !prevStatus,
          },
        });

        return {
          code: "SUCCESS",
          message: "Plan marked as most popular",
        };
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  createSubscription: protectedProcedure
    .input(
      z.object({
        planId: z.string(),
        member_count: z.number(),
      })
    )
    .mutation(async () => {
      // const currTime = Math.floor(Date.now() / 1000);
      // try {
      //   const subscription = await razorpayInstance.subscriptions.create({
      //     plan_id: planId,
      //     customer_notify: true,
      //     quantity: member_count,
      //     total_count: 6,
      //     // start_at: +(currTime + 60),
      //     notes: {
      //       orgname: ctx.auth?.githubUsername!,
      //       email: ctx.auth?.user?.email!,
      //     },
      //   });
      //   console.log(subscription);
      //   await db.user.update({
      //     where: {
      //       username: ctx?.auth?.githubUsername,
      //     },
      //     data: {
      //       mostRecentSubscription: subscription?.id,
      //       subscriptionIds: {
      //         push: subscription?.id,
      //       },
      //     },
      //   });
      //   return { subscription };
      // } catch (error) {
      //   console.log(error);
      //   if (isRazorpayError(error)) {
      //     const { description, field } = error.error;
      //     throw new TRPCError({
      //       code: "BAD_REQUEST",
      //       message: description,
      //     });
      //   }
      //   throw new TRPCError({
      //     code: "BAD_REQUEST",
      //     message: "Something went wrong",
      //   });
      // }
    }),
});
