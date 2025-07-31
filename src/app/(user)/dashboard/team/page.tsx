import {
  RepositoriesPageLoader,
  RepositoriesPage,
} from "@/components/pages/dashboard/repositories-page";
import { TeamPage } from "@/components/pages/dashboard/team-page";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <div className="w-full bg-background h-screen ">
      <Suspense fallback={<TeamPage />}>
        <TeamPage />
      </Suspense>
    </div>
  );
};

export default Page;

