import { BillingPage } from "@/components/pages/dashboard/billing-page";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Billing | GitRoaster",
  description: "Manage your team ",
};

const Page = () => {
  return (
    <div className="w-full bg-background h-screen ">
      <BillingPage />
    </div>
  );
};

export default Page;
