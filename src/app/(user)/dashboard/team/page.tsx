import { TeamPage } from "@/components/pages/dashboard/team-page";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Team | GitRoaster",
  description: "Manage your team ",
};

const Page = () => {
  return (
    <div className="w-full bg-background h-screen ">
      <TeamPage />
    </div>
  );
};

export default Page;
