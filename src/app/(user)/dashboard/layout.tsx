import { auth } from "@/auth";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardSidebarLoader } from "@/components/dashboard/dashboard-sidebar/dashboard-sdebar-loader";
import { MobileNav } from "@/components/dashboard/mobile-navigation";
// import { BugDetailCollector } from "@/components/shared/bug-detail-collector";
import { caller } from "@/trpc/server";
import React, { Suspense } from "react";
import { Toaster } from "sonner";

export async function DashboardSidebarServer() {
  const session = await auth();
  const { user, subscription } = await caller.userRouter.syncUser();
  const plans = await caller.razorPayRouter.getPublicPlans();

  return (
  
    <DashboardSidebar
      plans={plans}
      session={session}
      userRole={user.role}
      subscription={subscription}
      defaultOrg={user?.defaultOrg}
      isTrial={new Date(user?.trialEndAt).getTime() > Date.now() ? true : false}
      trialEndAt={user?.trialEndAt}
    />
  );
}
export async function DashboardMobileNav() {
  const session = await auth();
  const { user, subscription } = await caller.userRouter.syncUser();
  const plans = await caller.razorPayRouter.getPublicPlans();

  return (
    // <Suspense fallback={<></>}>
    <MobileNav
      plans={plans}
      session={session}
      userRole={user.role}
      subscription={subscription}
      defaultOrg={user?.defaultOrg}
      isTrial={new Date(user?.trialEndAt).getTime() > Date.now() ? true : false}
      trialEndAt={user?.trialEndAt}
    />
  );
}

const UserLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Suspense fallback={<></>}>
        <DashboardMobileNav />
      </Suspense>

      <div className="max-w-screen flex items-start justify-start ">
        <Suspense fallback={<DashboardSidebarLoader />}>
          <DashboardSidebarServer />
        </Suspense>
        {children}
        {/* <BugDetailCollector /> */}
        <Toaster position="top-center" />
      </div>
    </>
  );
};

export default UserLayout;
