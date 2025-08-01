import { auth } from "@/auth";
import {
  DashboardSidebar,
  DashboardSidebarLoader,
} from "@/components/dashboard/dashboard-sidebar";
import { caller } from "@/trpc/server";
import React, { Suspense } from "react";
import { Toaster } from "sonner";

export async function DashboardSidebarServer() {
  const session = await auth();
  const { user, subscription } = await caller.userRouter.syncUser();
  const plans = await caller.razorPayRouter.getPublicPlans();

  return (
    <Suspense fallback={<></>}>
      <DashboardSidebar
        plans={plans}
        session={session}
        userRole={user.role}
        subscription={subscription}
        defaultOrg={user?.defaultOrg}
      />
    </Suspense>
  );
}

const UserLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-screen flex items-center justify-start">
      <Suspense fallback={<DashboardSidebarLoader />}>
        <DashboardSidebarServer />
      </Suspense>
      {children}
      <Toaster position="top-center" />
    </div>
  );
};

export default UserLayout;
