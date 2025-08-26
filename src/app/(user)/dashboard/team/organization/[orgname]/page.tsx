import {
  OrganizationPageForTeamMember,
  OrganizationPageForTeamMemberLoader,
} from "@/components/dashboard/team/organization-page";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Organization | Team member - GitRoaster",
  description: "Manage your team ",
};
// OrganizationPageForTeamMember
const Page = async ({
  params,
}: {
  params: Promise<{
    orgname: string;
  }>;
}) => {
  const { orgname } = await params;
  console.log("orgname", orgname);
  return (
    <div className="w-full bg-background h-screen ">
      <Suspense fallback={<OrganizationPageForTeamMemberLoader />}>
        <OrganizationPageForTeamMember orgname={orgname} />
      </Suspense>
    </div>
  );
};

export default Page;
