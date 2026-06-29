import { GitroasterUsage } from "@/components/dashboard/usage-chart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompactTime } from "@/lib/utils";
import { ActivityCard } from "./activity-card";
import { RecentActivityModal } from "./recent-activity-modal";
import { githubOctokit } from "@/modules/github/utils";
import { caller } from "@/trpc/server";
import {
  ArrowUpRightIcon,
  ClockIcon,
  ExternalLinkIcon,
  GitBranchIcon,
  GitPullRequestIcon,
  LayoutDashboardIcon,
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
    const orgname = user?.defaultOrg || "";

    // Fetch everything in parallel instead of sequential awaits.
    const [
      pullRequestData,
      chartData,
      quickCardData,
      githubRepos,
      connectedRepo,
    ] = await Promise.all([
      caller.dashboardRouter.getPRData({ page: 1, limit: 5, orgname }),
      caller.dashboardRouter.getUsageData({
        days: 7,
        orgname,
        endDateInMS: Date.now(),
      }),
      caller.dashboardRouter.getQuickCard({ orgname }),
      githubOctokit.getEnabledRepoForGitRoaster(
        user?.username,
        user?.defaultOrg,
        installationId || "00000"
      ),
      caller.githubRouter.getAllConnectedRepo({ orgname }),
    ]);

    const {
      repos,
      installationIdFromGithub,
      success: isGitroasterAppDownloaded,
    } = githubRepos;

    let connectedRepoCount = 0;
    const isAnyRepoConnected = connectedRepo.some((item) => item.isConnected);

    if (isAnyRepoConnected) {
      const connectedNames = new Set(
        connectedRepo
          .filter((c) => c.isConnected)
          .map((c) => c.repoFullName)
      );
      connectedRepoCount = repos.filter((repo) =>
        connectedNames.has(repo.full_name)
      ).length;
    }

    const QUICK_CARD_CONTENT: {
      title: string;
      icon: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
      >;
      stat: number | string;
      statDesc?: number | string;
      accent: string;
    }[] = [
      {
        title: "Reviews Completed",
        icon: GitPullRequestIcon,
        stat: quickCardData.pullRequestData._count?.id || 0,
        statDesc: `+${
          quickCardData.pullRequestDataMonthly._count?.id || 0
        } this week`,
        accent: "primary",
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
        accent: "secondary",
      },
      {
        title: "Tokens Used",
        icon: ZapIcon,
        stat:
          (quickCardData?.pullRequestDataMonthly?.tokenCount || 0) + " tokens",
        statDesc: "out of 2,000,000 tokens",
        accent: "tertiary",
      },
      {
        title: "Connected Repos",
        icon: GitBranchIcon,
        stat: connectedRepoCount || 0,
        statDesc: "Active repositories",
        accent: "chart-4",
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

    return (
      <div className="relative flex h-full max-h-svh flex-col overflow-hidden bg-background">
        {/* Header */}
        <header className="relative z-20 flex h-[68px] shrink-0 items-center justify-between gap-4 border-b bg-card px-6 shadow-sm">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <LayoutDashboardIcon className="size-5" />
            </span>
            <div className="min-w-0 space-y-0.5">
              <h1 className="truncate text-base font-bold leading-tight tracking-tight md:text-lg">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {user?.username}
                </span>
              </h1>
              <p className="truncate text-xs text-muted-foreground">
                Overview of your AI code review activity
              </p>
            </div>
          </div>

          {installationIdFromGithub && (
            <Button asChild size="sm" className="hidden shrink-0 gap-2 sm:flex">
              <Link href={appManagementURL} target="_blank">
                <PlusIcon className="size-4" />
                Manage App
                <ExternalLinkIcon className="size-3" />
              </Link>
            </Button>
          )}
        </header>

        <div className="relative flex flex-1 flex-col overflow-hidden">
          {/* ambient glow backdrop, scoped to the scroll area */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -right-32 top-20 size-80 rounded-full bg-secondary/10 blur-3xl" />
            <div className="absolute -left-32 top-1/2 size-80 rounded-full bg-primary/10 blur-3xl" />
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-5 p-5">
          {/* Privacy pill */}
          <div className="flex shrink-0 items-start gap-3 rounded-2xl border border-secondary/30 bg-secondary/5 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
              <ShieldCheckIcon className="size-5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold">Privacy-First Architecture</p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                GitRoaster analyzes your code in real-time but never stores it.
                Only PR metadata (numbers, timestamps, status) is tracked — your
                code, vulnerabilities, and suggestions live only in GitHub PR
                comments.
              </p>
            </div>
          </div>

          {/* Stat tiles */}
          <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_CARD_CONTENT.map((data, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl border bg-card/60 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className="absolute -right-8 -top-8 size-24 rounded-full blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-50"
                  style={{ background: `var(--${data.accent})` }}
                />
                <div className="relative flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {data.title}
                  </span>
                  <span
                    className="flex size-9 items-center justify-center rounded-xl"
                    style={{
                      background: `color-mix(in oklab, var(--${data.accent}) 15%, transparent)`,
                      color: `var(--${data.accent})`,
                    }}
                  >
                    <data.icon className="size-4" />
                  </span>
                </div>
                <div className="relative mt-3 text-2xl font-bold tracking-tight">
                  {data.stat}
                </div>
                <p className="relative mt-1 text-xs text-muted-foreground">
                  {data.statDesc}
                </p>
              </div>
            ))}
          </div>

          {/* Chart + activity feed */}
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-5">
            <div className="xl:col-span-3">
              <GitroasterUsage chartData={chartData} />
            </div>

            <div className="flex min-h-0 flex-col gap-3 xl:col-span-2">
              <div className="flex shrink-0 items-center justify-between px-1">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Recent Activity
                </h2>
                <Link
                  href="/dashboard/repositories"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Repositories <ArrowUpRightIcon className="size-3" />
                </Link>
              </div>

              <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
              {isGitroasterAppDownloaded && pullRequestData.items.length > 0 ? (
                pullRequestData.items.map((item) => (
                  <ActivityCard key={item.id} item={item} />
                ))
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-card/40 p-8 text-center">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <GitPullRequestIcon className="size-6" />
                  </div>
                  <h3 className="font-semibold">No reviews yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Open a pull request in a connected repository to get started.
                  </p>
                  <Button asChild variant="outline" className="gap-2">
                    <Link href="/dashboard/repositories">
                      Manage Repositories
                      <ExternalLinkIcon className="size-3" />
                    </Link>
                  </Button>
                </div>
              )}
              </div>

              {isGitroasterAppDownloaded && pullRequestData.items.length > 0 && (
                <div className="shrink-0">
                  <RecentActivityModal orgname={orgname} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex h-full min-h-screen w-full items-center justify-center text-muted-foreground">
        Error loading dashboard. Please try again later.
      </div>
    );
  }
};

export const DashboardPageLoader = () => {
  return (
    <div className="flex h-full max-h-svh flex-col overflow-hidden bg-background">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b bg-card/40 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-56" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
        <Skeleton className="hidden h-9 w-32 sm:block" />
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        <Skeleton className="h-24 w-full rounded-2xl" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-32 rounded-2xl" />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
          <Skeleton className="h-[360px] rounded-2xl xl:col-span-3" />
          <div className="flex flex-col gap-3 xl:col-span-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="h-28 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
