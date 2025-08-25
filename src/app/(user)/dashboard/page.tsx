import {
  DashboardPage,
  DashboardPageLoader,
} from "@/components/pages/dashboard/dashboard-page";
import { Metadata } from "next";

import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Dashboard | GitRoaster",
  description: "Manage your repositories and pull requests",
};

const Page = () => {
  return (
    <div className="w-full bg-background h-screen ">
      <Suspense fallback={<DashboardPageLoader />}>
        <DashboardPage />
      </Suspense>
    </div>
  );
};

export default Page;
