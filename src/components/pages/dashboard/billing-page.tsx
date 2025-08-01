"use client";
import PlanCard from "@/components/dashboard/admin/plan/plan-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plan } from "@/generated/prisma";
import usePlanStore from "@/store/use-plans";
import { useEffect, useState } from "react";

export const BillingPage = () => {
  const { getPlans, isPlansLoaded } = usePlanStore();
  const [selectedPeriod, setSelectedPeriod] = useState<string>("monthly");
  const [plansToDisplay, setPlansToDisplay] = useState<Plan[]>([]);

  useEffect(() => {
    if (isPlansLoaded) {
      const plans = getPlans(selectedPeriod);
      setPlansToDisplay(plans);
    }
  }, [selectedPeriod, isPlansLoaded]);

  return (
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

      <div className="mt-2 p-4">
        <Tabs defaultValue="billing">
          <TabsList>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="upgrade">Upgrade</TabsTrigger>
          </TabsList>
          <TabsContent value="billing">
            {/* {JSON.stringify(plansToDisplay)} */}
            <div className="flex items-center gap-10 justify-center w-full">
              {!isPlansLoaded && plansToDisplay.length <= 0 ? (
                <>Loading Plans</>
              ) : (
                plansToDisplay?.map((plan) => {
                  return (
                    <PlanCard
                      isAdminPage={false}
                      plan={plan}
                      currentPlan={false}
                      key={plan?.planId}
                    />
                  );
                })
              )}
            </div>
          </TabsContent>
          <TabsContent value="upgrade">Upgrade</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
