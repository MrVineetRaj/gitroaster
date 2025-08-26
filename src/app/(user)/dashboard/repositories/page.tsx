import {
  RepositoriesPageLoader,
  RepositoriesPage,
} from "@/components/pages/dashboard/repositories-page";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Repositories | GitRoaster",
  description: "Manage your repositories and pull requests",
};

const Page = () => {
  return (
    <div className="w-full bg-background h-screen ">
      <Suspense fallback={<RepositoriesPageLoader />}>
        <RepositoriesPage />
      </Suspense>
    </div>
  );
};

export default Page;
