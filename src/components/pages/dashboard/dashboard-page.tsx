import RepoContainer from "@/components/dashboard/repositories/repo-container";
import { GitroasterUsage } from "@/components/dashboard/usage-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatCompactTime } from "@/lib/utils";
import { githubOctokit } from "@/modules/github/utils";
import { caller } from "@/trpc/server";
import {
  AlertCircleIcon,
  ClockIcon,
  ExternalLinkIcon,
  GitBranchIcon,
  GitPullRequestIcon,
  LucideProps,
  PlusIcon,
  ShieldCheckIcon,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export const DashboardPage = async () => {
  try {
    const { user, installationId } = await caller.userRouter.syncUser();
    const pullRequestData = await caller.dashboardRouter.getPRData({
      page: 1,
      limit: 20,
      orgname: user?.defaultOrg || "",
    });
    const chartData = await caller.dashboardRouter.getUsageData({
      days: 7,
      orgname: user?.defaultOrg || "",
      endDateInMS: Date.now(),
    });

    const quickCardData = await caller.dashboardRouter.getQuickCard({
      orgname: user?.defaultOrg || "",
    });

    const {
      repos,
      installationIdFromGithub,
      success: isGitroasterAppDownloaded,
    } = await githubOctokit.getEnabledRepoForGitRoaster(
      user?.username,
      user?.defaultOrg,
      installationId || "00000"
    );

    const connectedRepo = await caller.githubRouter.getAllConnectedRepo({
      orgname: user?.defaultOrg || "",
    });

    const repoCount = repos?.length ?? 0;
    let connectedRepoCount = 0;
    const isAnyRepoConnected = connectedRepo.some((item) => item.isConnected);

    if (isAnyRepoConnected) {
      for (const repo of repos) {
        for (const connected of connectedRepo) {
          if (repo.full_name === connected.repoFullName) {
            connectedRepoCount += 1;
            break;
          }
        }
      }
    }

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
        stat: connectedRepoCount || 0,
        statDesc: "Active repositories",
      },
    ];

    const appManagementURL =
      user.username === user.defaultOrg
        ? `https://github.com/settings/installations/${
            installationId || "00000"
          }`
        : `https://github.com/organizations/${
            user.defaultOrg
          }/settings/installations/${installationId || "00000"}`;

    const appInstallationURL = `https://github.com/apps/gitroaster`;

    return (
      <div className="flex flex-col min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b h-18">
          <div className="flex items-center justify-between p-2">
            <div className="space-y-1">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-3">
                Welcome back
                <span className="text-primary">{user?.username}</span>
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground italic">
                Here you can find overview of your usage
              </p>
            </div>

            <div className="flex items-center gap-3">
              {installationIdFromGithub && (
                <>
                  <Button asChild variant="outline" className="hidden sm:flex">
                    <Link
                      href={appManagementURL}
                      target="_blank"
                      className="flex gap-2 items-center"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Manage App
                      <ExternalLinkIcon className="w-3 h-3" />
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {/* Privacy Notice */}
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300 mb-2">
              <ShieldCheckIcon className="w-5 h-5" />
              <span className="font-semibold">Privacy-First Architecture</span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400">
              GitRoaster analyzes your code in real-time but never stores it.
              Only PR metadata (numbers, timestamps, status) is tracked. Your
              code content, vulnerabilities, and suggestions remain in GitHub PR
              comments only.
            </p>
          </div>
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
          <div className="flex flex-col xl:flex-row  gap-2">
            <div className="flex-1">
              <GitroasterUsage chartData={chartData} />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              {isGitroasterAppDownloaded && pullRequestData?.length > 0 ? (
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
                  <Button asChild variant="outline">
                    <Link
                      href={`/dashboard/repositories`}
                      className="flex gap-2 items-center"
                    >
                      {"Manage connected Repositories"}

                      <ExternalLinkIcon className="w-3 h-3" />
                    </Link>
                  </Button>
                </div>
              )}
              {pullRequestData?.length > 5 && (
                <Button variant="outline">View More</Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return <div>Error loading dashboard. Please try again later.</div>;
  }
};

export const DashboardPageLoader = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-10 bg-card border-b h-18">
        <div className="flex items-center justify-between p-2">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-32 hidden sm:block" />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Privacy Notice */}
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-300 mb-2">
            <ShieldCheckIcon className="w-5 h-5" />
            <span className="font-semibold">Privacy-First Architecture</span>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400">
            GitRoaster analyzes your code in real-time but never stores it. Only
            PR metadata (numbers, timestamps, status) is tracked. Your code
            content, vulnerabilities, and suggestions remain in GitHub PR
            comments only.
          </p>
        </div>

        {/* Quick Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card className="relative overflow-hidden rounded-none" key={idx}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
                <div className="absolute z-10 top-0 right-0 w-1 h-full bg-gradient-to-b from-blue-500 to-blue-600" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Usage Chart and Pull Requests Skeleton */}
        <div className="flex gap-2">
          {/* Usage Chart Skeleton */}
          <div className="flex-1">
            <Card className="rounded-none">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-end justify-between gap-2 px-4">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      className={`w-8 bg-blue-200 dark:bg-blue-800`}
                      style={{
                        height: `${Math.random() * 200 + 50}px`,
                      }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pull Requests Skeleton */}
          <div className="flex-1 flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div className="rounded-none p-4 border bg-card" key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
