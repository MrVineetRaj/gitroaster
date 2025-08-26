import { z } from "zod";
import {
  adminProtectedProcedure,
  baseProcedure,
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

    // console.log(oldPlans);
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
  getPublicPlans: baseProcedure.query(async () => {
    const plans = await db.plan.findMany({
      where: {
        isActive: true,
      },
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
        orgname: z.string(),
      })
    )
    .mutation(async ({ input: { planId, member_count, orgname }, ctx }) => {
      const username = ctx?.auth?.githubUsername!;
      try {
        const subscription = await razorpayInstance.createSubscription({
          planId,
          member_count,
          orgname,
          username,
          email: ctx?.auth?.user?.email!,
        });

        await db.subscription.create({
          data: {
            subscriptionId: subscription.id,
            planId: subscription.plan_id,
            username,
            orgname,
            cycleStart: subscription?.current_start
              ? new Date(subscription?.current_start * 1000)
              : null,
            cycleEnd: subscription?.current_end
              ? new Date(subscription?.current_end * 1000)
              : null,
            upcomingPayment: subscription?.charge_at
              ? new Date(subscription?.charge_at * 1000)
              : null,
          },
        });

        return { shortUrl: subscription.short_url };
      } catch (error) {
        console.log(error);
      }
    }),
});
