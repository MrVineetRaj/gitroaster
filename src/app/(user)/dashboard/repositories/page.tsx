import {
  RepositoriesPageLoader,
  RepositoriesPage,
} from "@/components/pages/dashboard/repositories-page";
import React, { Suspense } from "react";

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
RepositoriesPageLoader;
