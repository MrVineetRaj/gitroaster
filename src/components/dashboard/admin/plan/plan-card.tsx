"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CurrencyShortIcon } from "@/constants/pricing";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircleIcon, StarIcon, StarsIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/use-auth";

interface Props {
  plan: {
    planId: string;
    isActive: boolean;
    isPopular: boolean;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    description: string;
    unitAmount: number;
    currency: string;
    features: string[];
    period: string;
    interval: number;
  };
  isAdminPage: boolean;
  currentPlan: boolean;
}
const PlanCard = ({ plan, isAdminPage, currentPlan }: Props) => {
  const CurrencyIcon = CurrencyShortIcon[plan.currency];
  const router = useRouter();
  const { defaultOrg } = useAuthStore();

  const trpc = useTRPC();
  const toggleActivePlanStatus = useMutation(
    trpc.razorPayRouter.toggleActivePlanStatus.mutationOptions({
      onSuccess: (res) => {
        // queryClient.invalidateQueries(trpc.razorpay.getAllPlans.queryOptions());
        toast.success(res.message);
      },
      onError: (err) => {
        toast.success(err.message);
      },
    })
  );
  const markPopularPlan = useMutation(
    trpc.razorPayRouter.markPopularPlan.mutationOptions({
      onSuccess: (res) => {
        // queryClient.invalidateQueries(trpc.razorpay.getAllPlans.queryOptions());
        toast.success(res.message);
      },
      onError: (err) => {
        toast.success(err.message);
      },
    })
  );

  const createSubscription = useMutation(
    trpc.razorPayRouter.createSubscription.mutationOptions({
      onSuccess: () => {
        toast.success("Subscription created successfully!");
        // console.log(subscription);
        // window.open(subscription.short_url, "_blank");
      },
      onError: (err) => {
        // console.log(err);
        toast.error(err.message);
      },
    })
  );
  return (
    <div
      className={cn(
        "flex flex-col h-full rounded-md w-full max-w-84",
        plan.isPopular &&
          !isAdminPage &&
          "bg-primary/20 scale-110 shadow-[0px_5px_20px] shadow-primary/30"
      )}
      key={plan.planId}
    >
      {isAdminPage && (
        <div className="w-full bg-card -mb-2 pb-4 flex items-center justify-end gap-4 p-2 rounded-t-2xl">
          <Tooltip>
            <TooltipTrigger
              onClick={() => {
                markPopularPlan.mutateAsync({
                  planId: plan.planId,

                  prevStatus: plan.isPopular,
                });
              }}
            >
              <StarsIcon
                className={cn("size-4", plan.isPopular && "text-green-500")}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-card text-muted-foreground text-xs italic px-2 py-1 rounded-lg border-1">
              Mark most Popular
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              onClick={() => {
                toggleActivePlanStatus.mutateAsync({
                  planId: plan.planId as string,
                  prevStatus: plan.isActive,
                });
              }}
            >
              <StarIcon
                className={cn("size-4", plan.isActive && "text-orange-500")}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-card text-muted-foreground text-xs italic px-2 py-1 rounded-lg border-1">
              Mark active plan
            </TooltipContent>
          </Tooltip>
        </div>
      )}
      {!isAdminPage && plan.isPopular && (
        <div className="w-full -mb-2 pb-4 flex items-center justify-center gap-4 p-2 rounded-t-2xl bg-primary font-bold ">
          Most Popular
        </div>
      )}
      <Card
        className={cn(
          "flex flex-col h-full relative w-full max-w-84  overflow-x-hidden"
        )}
      >
        <CardHeader>
          <CardTitle className=" flex flex-col items-start gap-2 mt-4">
            <p className="text-2xl">{plan.name}</p>
            {!isAdminPage && currentPlan && (
              <div className="bg-black text-white w-full top-0 text-center py-1">
                Current Plan
              </div>
            )}
            <p className=" text-muted-foreground text-sm">{plan.description}</p>
          </CardTitle>
          <CardDescription className="text-xl font-semibold text-foreground flex items-center">
            <CurrencyIcon className="size-5" />
            {+plan.unitAmount / 100 + " / user / "}
            {plan.period === "yearly" ? "yearly" : "month"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <ul className="space-y-3 mb-6">
            {plan.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircleIcon className="w-3 h-3 text-green-500 mt-1" />
                <span className="text-sm">{feat}</span>
              </li>
            ))}
          </ul>

          {!isAdminPage && (
            <Button
              className="font-bold"
              onClick={() => {
                if (currentPlan) {
                  router.push("/dashboard/billing?tab=billing");
                } else {
                  createSubscription
                    .mutateAsync({
                      planId: plan.planId,
                      member_count: 1,
                      orgname: defaultOrg,
                    })
                    .then((res) => {
                      if (res?.shortUrl) {
                        window.open(res?.shortUrl, "_blank");
                      }
                    });
                }
              }}
              variant={currentPlan ? "outline" : "default"}
            >
              {currentPlan ? "Manage Plan" : "Choose Plan"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanCard;
