import { auth } from "@/auth";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { caller } from "@/trpc/server";
import React from "react";

const UserLayout = async ({ children }: { children: React.ReactNode }) => {
  try {
    const session = await auth();
    const { user, subscription, installationId } =
      await caller.userRouter.syncUser();

    return (
      <div className="max-w-screen flex items-center">
        <DashboardSidebar
          session={session}
          userRole={user.role}
          subscription={subscription}
          defaultOrg={user?.defaultOrg}
        />
        {children}
      </div>
    );
  } catch (error) {
    <div className="w-screen h-screen foxed top-0 left-0 bg-red-500 z-[500000]"></div>;
  }
};

export default UserLayout;
