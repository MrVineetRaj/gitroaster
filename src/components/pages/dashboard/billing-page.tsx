"use client";
import PlanCard from "@/components/dashboard/admin/plan/plan-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Plan } from "@/generated/prisma";
import usePlanStore from "@/store/use-plans";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const BillingPage = () => {
  const { getPlans, isPlansLoaded } = usePlanStore();
  const [selectedPeriod, setSelectedPeriod] = useState<string>("monthly");
  const [plansToDisplay, setPlansToDisplay] = useState<Plan[]>([]);
  const [interestMessage, setInterestMessage] = useState<string>("");
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: interest, isPending: loadingInterest } = useQuery(
    trpc.feedbackRouter.getInterest.queryOptions()
  );
  const showInterest = useMutation(
    trpc.feedbackRouter.showBillingInterests.mutationOptions({
      onSuccess: (data) => {
        toast.success(data?.mssage || "Interest recorded", {
          duration: 2000,
          id: "billing-interest",
        });
        queryClient.invalidateQueries(
          trpc.feedbackRouter.getInterest.queryOptions()
        );
      },
      onError: (error) => {
        toast.error(error.message || "Something went wrong", {
          duration: 2000,
          id: "billing-interest",
        });
      },
    })
  );
  useEffect(() => {
    if (isPlansLoaded) {
      const plans = getPlans(selectedPeriod);
      setPlansToDisplay(plans);
    }
  }, [selectedPeriod, isPlansLoaded]);

  return (
    // <div className="flex flex-col min-h-screen bg-background">
    //   <div className="sticky top-0 z-10 bg-card border-b">
    //     <div className="flex items-center justify-between p-2">
    //       <div className="space-y-1">
    //         <h1 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-3">
    //           Billing
    //         </h1>
    //         <p className="text-xs md:text-sm text-muted-foreground italic">
    //           Manage your plan here
    //         </p>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="mt-2 p-4">
    //     <Tabs defaultValue="billing">
    //       <TabsList>
    //         <TabsTrigger value="billing">Billing</TabsTrigger>
    //         <TabsTrigger value="upgrade">Upgrade</TabsTrigger>
    //       </TabsList>
    //       <TabsContent value="billing">
    //         {/* {JSON.stringify(plansToDisplay)} */}
    //         <div className="flex items-center gap-10 justify-center w-full">
    //           {!isPlansLoaded && plansToDisplay.length <= 0 ? (
    //             <>Loading Plans</>
    //           ) : (
    //             plansToDisplay?.map((plan) => {
    //               return (
    //                 <PlanCard
    //                   isAdminPage={false}
    //                   plan={plan}
    //                   currentPlan={false}
    //                   key={plan?.planId}
    //                 />
    //               );
    //             })
    //           )}
    //         </div>
    //       </TabsContent>
    //       <TabsContent value="upgrade">Upgrade</TabsContent>
    //     </Tabs>
    //   </div>
    // </div>
    <div className="flex flex-col min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-card border-b">
        <div className="flex items-center justify-between p-2">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-3">
              Billing
            </h1>

            <p className="text-xs md:text-sm text-muted-foreground italic">
              Manage your plan here
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 h-full w-full  flex items-center justify-center">
        {loadingInterest ? (
          <Skeleton className="w-full md:w-1/2 lg:w-1/3 p-4 border flex flex-col gap-2 bg-card rounded-sm h-[60vh]" />
        ) : interest?.data ? (
          <div className="w-full md:w-1/2 lg:w-1/3 p-4 border flex flex-col gap-2 bg-card rounded-sm">
            You have already shown interest for the upgradable plans. We will
            reach out to you soon.
          </div>
        ) : (
          <form
            className="w-full md:w-1/2 lg:w-1/3 p-4 border flex flex-col gap-2 bg-card rounded-sm"
            onSubmit={(e) => {
              e.preventDefault();
              toast.loading("Recording your interest", {
                id: "billing-interest",
              });
              showInterest.mutate({
                message: interestMessage || "Interested in upgradable plans",
              });
            }}
          >
            <legend className="pb-4 border-b mb-4">
              <h1 className="text-2xl font-bold ">
                Show interest for the upgradable plans
              </h1>
            </legend>

            <span className="mb-4 grid grid-cols-1 gap-1">
              <Label htmlFor="name" className="mb-2 col-span-1 h-full">
                Message {"(Optional)"}
              </Label>
              <Textarea
                rows={20}
                id="email"
                name="name"
                placeholder="Hey there, ..."
                className="col-span-1"
                onChange={(e) => setInterestMessage(e.target.value)}
                value={interestMessage}
              />
            </span>
            <Button type="submit">Show interest</Button>
          </form>
        )}
      </div>
    </div>
  );
};
