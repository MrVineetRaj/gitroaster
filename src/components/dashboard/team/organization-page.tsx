import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCompactTime } from "@/lib/utils";
import { caller } from "@/trpc/server";
import {
  ClockIcon,
  GitBranchIcon,
  GitPullRequestIcon,
  LucideProps,
  ShieldCheckIcon,
  ZapIcon,
} from "lucide-react";
import React from "react";
import { GitroasterUsage } from "../usage-chart";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const OrganizationPageForTeamMemberLoader = () => {
  return <div>Loading...</div>;
};

const OrganizationPageForTeamMember = async ({
  orgname,
}: {
  orgname: string;
}) => {
  // const { orgname } = await params;

  try {
    const { user } = await caller.userRouter.syncUser();
    const pullRequestData = await caller.dashboardRouter.getPRData({
      page: 1,
      limit: 20,
      orgname: orgname || "",
    });
    const chartData = await caller.dashboardRouter.getUsageData({
      days: 7,
      orgname: orgname || "",
      endDateInMS: Date.now(),
    });

    const quickCardData = await caller.dashboardRouter.getQuickCard({
      orgname: orgname || "",
    });

    const QUICK_CARD_CONTENT: {
      title: string;
      link?: string;
      icon: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
      >;
      stat: number | string;
      statDesc?: number | string;
    }[] = [
      {
        title: "Reviews Completed",
        icon: GitPullRequestIcon,
        stat: quickCardData.pullRequestData._count?.id || 0,
        statDesc: `+${
          quickCardData.pullRequestDataMonthly._count?.id || 0
        } this week`,
      },
      {
        title: "Avg Review Time",
        icon: ClockIcon,
        stat: quickCardData.pullRequestData.avgTimeTaken
          ? formatCompactTime(
              +(quickCardData.pullRequestData.avgTimeTaken / 1000).toFixed(0)
            )
          : "NA",
        statDesc:
          quickCardData.pullRequestData._count?.id > 0
            ? "⚡ Lightning fast AI"
            : "⏳ Waiting for first review",
      },
      {
        title: "Tokens Used",
        icon: ZapIcon, // or use a different icon like ZapIcon
        stat:
          (quickCardData?.pullRequestDataMonthly?.tokenCount || 0) + " tokens",
        statDesc: "out of 2,000,000 tokens",
      },
      {
        title: "Connected Repos",
        icon: GitBranchIcon,
        stat: quickCardData.repoConnected || 0,
        statDesc: "Active repositories",
      },
    ];

    // const { repos, installationIdFromGithub } =
    //   await githubOctokit.getEnabledRepoForGitRoaster(
    //     user?.username,
    //     orgname,
    //     installationId || "00000"
    //   );

    // const repoCount = repos?.length ?? 0;

    // const appManagementURL =
    //   user.username === user.defaultOrg
    //     ? `https://github.com/settings/installations/${installationId}`
    //     : `https://github.com/organizations/${user.defaultOrg}/settings/installations/${installationId}`;
    // const appInstallationURL = `https://github.com/apps/gitroaster`;

    return (
      <div className="flex flex-col min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b">
          <div className="flex items-center justify-between p-2">
            <div className="space-y-1">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-3">
                Hey there
                <span className="text-primary">{user?.username}</span>
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground italic">
                Here you can view the activity of organization {orgname}
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {/* data card */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {QUICK_CARD_CONTENT?.map((data, idx) => (
              <Card
                className="relative overflow-hidden rounded-none hover:bg-primary/20 transition-all hover:scale-[1.02] hover:z-30 duration-200"
                key={idx}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
                  <CardTitle className="text-sm font-medium">
                    {data.title}
                  </CardTitle>
                  <data.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.stat}</div>
                  <p className="text-xs text-muted-foreground">
                    {data?.statDesc}
                  </p>
                  <div className="absolute z-10 top-0 right-0 w-1 h-full bg-gradient-to-b from-blue-500 to-blue-600" />
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Usage | Pull requests */}
          <div className="flex gap-2">
            <div className="flex-1">
              <GitroasterUsage chartData={chartData} />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              {pullRequestData?.length > 0 ? (
                pullRequestData.slice(0, 5)?.map((item) => (
                  <div
                    className={
                      "rounded-none p-4  border bg-card hover:bg-primary/20"
                    }
                    key={item.id}
                  >
                    <span className="flex items-center justify-between">
                      <h3 className="flex items-center justify-between font-bold text-lg gap-2">
                        <span className="">{item?.title} </span>
                        <Link
                          href={`https://www.github.com/${item?.repoFullName}/pull/${item?.pullNumber}`}
                          className=" flex items-center"
                          target="_blank"
                        >
                          <Badge className="rounded-none bg-blue-500 text-white">{`#${item?.pullNumber}`}</Badge>
                        </Link>
                      </h3>
                      <Badge
                        className={cn(
                          " rounded-none",
                          item.status === "SUCCESS" ? "bg-green-500" : ""
                        )}
                      >
                        {item?.status}
                      </Badge>
                    </span>
                    <span className="flex text-sm items-center gap-2">
                      <p>By {item?.author}</p>
                      <p className="text-muted-foreground">
                        {item?.timeTakenToReview < 60000
                          ? "in " +
                            Math.floor(item.timeTakenToReview / 1000) +
                            " sec(s)"
                          : "within " +
                            Math.ceil(item.timeTakenToReview / 60000) +
                            " min(s)"}
                      </p>

                      <Badge className="" variant={"outline"}>
                        {item?.tokenCount} tokens
                      </Badge>
                    </span>
                    <p className="flex items-center gap-2 text-muted-foreground text-sm">
                      <GitBranchIcon className="w-4 h-4" />
                      {item?.repoFullName}
                    </p>
                  </div>
                ))
              ) : (
                <div className="h-full bg-card w-full border flex flex-col items-center justify-center gap-4">
                  <h1 className="text-xl font-bold italic">
                    No Pull requests are reviewed
                  </h1>
                  <p className="text-sm text-muted-foreground italic">
                    Get started by creating a pull request in one of your
                    connected repositories.
                  </p>
                </div>
              )}
              {/* {pullRequestData?.length > 5 && (
                <Button variant="outline">View More</Button>
              )} */}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    // window.location.reload();
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? (error as { code: string }).code
        : undefined;

    switch (code) {
      case "FORBIDDEN":
        return (
          <div className="w-full h-screen flex flex-col  items-center justify-center">
            <h1 className="text-2xl font-bold text-destructive">FORBIDDEN</h1>
            <p className="text-muted-foreground">
              Either you do not have access to view this organization.
            </p>
            <p className="text-muted-foreground">
              Or you are not a team member of this organization.
            </p>
          </div>
        );
      case "UNAUTHORIZED":
        return <div>Please login to continue.</div>;
      case "BAD_REQUEST":
        return <div>Invalid organization name.</div>;
      default:
        return <div>Something went wrong</div>;
    }
  }
};

export { OrganizationPageForTeamMember, OrganizationPageForTeamMemberLoader };
