"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";

import React from "react";
import { toast } from "sonner";
import PlanCard from "./plan/plan-card";
import { PlanForm } from "./plan/plan-form";

const Plans = () => {
  const trpc = useTRPC();
  const { data: plans } = useQuery(
    trpc.razorPayRouter.getAllPlans.queryOptions()
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold ">All Plans</h3>
        <PlanForm />
      </div>
      <div className="flex flex-wrap gap-8 mt-4">
        {plans?.map((plan) => {
          return (
            <PlanCard
              key={plan.planId}
              plan={plan}
              isAdminPage={true}
              currentPlan={false}
            />
          );
        })}
      </div>
    </div>
  );
};
const AdminPage = () => {
  const trpc = useTRPC();
  const seedData = useMutation(
    trpc.razorPayRouter.seedRazorPayPlans.mutationOptions({
      onSuccess: (res) => {
        toast.success(res.message);
        // console.log(res.plans);
      },
    })
  );
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b">
        <div className="flex items-center justify-between p-2">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-3">
              Hello ADMIN
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground italic">
              here you can manage platform
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="plans" className="px-2 py-4">
        <TabsList>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="plans">
          <Button
            onClick={() => {
              seedData.mutateAsync();
            }}
          >
            Seed Data
          </Button>

          <div className="">
            <Plans />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
