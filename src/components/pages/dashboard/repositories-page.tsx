import RepoContainer from "@/components/dashboard/repositories/repo-container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { githubOctokit } from "@/modules/github/utils";
import { caller } from "@/trpc/server";
import {
  AlertCircleIcon,
  ExternalLinkIcon,
  GitBranchIcon,
  GlobeIcon,
  LinkIcon,
  LockIcon,
  LucideProps,
  PlusIcon,
  ShieldCheckIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export const RepositoriesPage = async () => {
  try {
    const { user, installationId } = await caller.userRouter.syncUser();
    const orgname = user?.defaultOrg || "";

    const [{ repos, installationIdFromGithub, success: isGitroasterAppDownloaded }, connectedRepo] =
      await Promise.all([
        githubOctokit.getEnabledRepoForGitRoaster(
          user?.username,
          user?.defaultOrg,
          installationId || "00000"
        ),
        caller.githubRouter.getAllConnectedRepo({ orgname }),
      ]);

    const repoCount = repos?.length ?? 0;
    const connectedNames = new Set(
      connectedRepo.filter((c) => c.isConnected).map((c) => c.repoFullName)
    );
    const connectedCount =
      repos?.filter((repo) => connectedNames.has(repo.full_name)).length ?? 0;
    const privateCount = repos?.filter((repo) => repo.private).length ?? 0;
    const publicCount = repoCount - privateCount;

    const appManagementURL =
      user.username === user.defaultOrg
        ? `https://github.com/settings/installations/${
            installationId || "00000"
          }`
        : `https://github.com/organizations/${
            user.defaultOrg
          }/settings/installations/${installationId || "00000"}`;
    const appInstallationURL = `https://github.com/apps/gitroaster`;

    const STAT_TILES: {
      title: string;
      icon: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
      >;
      stat: number | string;
      statDesc: string;
      accent: string;
    }[] = [
      {
        title: "Total Repositories",
        icon: GitBranchIcon,
        stat: repoCount,
        statDesc: "Accessible to GitRoaster",
        accent: "primary",
      },
      {
        title: "Connected",
        icon: LinkIcon,
        stat: connectedCount,
        statDesc: "Actively reviewed",
        accent: "secondary",
      },
      {
        title: "Private Repos",
        icon: LockIcon,
        stat: privateCount,
        statDesc: "Code never stored",
        accent: "tertiary",
      },
      {
        title: "Public Repos",
        icon: GlobeIcon,
        stat: publicCount,
        statDesc: "Open source friendly",
        accent: "chart-4",
      },
    ];

    return (
      <div className="relative flex h-full max-h-svh flex-col overflow-hidden bg-background">
        {/* Header */}
        <header className="relative z-20 flex h-[68px] shrink-0 items-center justify-between gap-4 border-b bg-card px-6 shadow-sm">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <GitBranchIcon className="size-5" />
            </span>
            <div className="min-w-0 space-y-0.5">
              <h1 className="truncate text-base font-bold leading-tight tracking-tight md:text-lg">
                Your Repositories
              </h1>
              <p className="truncate text-xs text-muted-foreground">
                Manage repositories connected for AI code reviews
              </p>
            </div>
          </div>

          {isGitroasterAppDownloaded && installationIdFromGithub && (
            <Button asChild size="sm" className="hidden shrink-0 gap-2 sm:flex">
              <Link href={appManagementURL} target="_blank">
                <PlusIcon className="size-4" />
                Add Repositories
                <ExternalLinkIcon className="size-3" />
              </Link>
            </Button>
          )}
        </header>

        <div className="relative flex-1 overflow-y-auto">
          {/* ambient glow backdrop, scoped to the scroll area */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-40 -top-40 size-96 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -right-32 bottom-0 size-96 rounded-full bg-tertiary/10 blur-3xl" />
          </div>

          <div className="space-y-5 p-5">
            {/* Privacy pill */}
            <div className="flex items-start gap-3 rounded-2xl border border-secondary/30 bg-secondary/5 p-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                <ShieldCheckIcon className="size-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-semibold">
                  Privacy-First Architecture
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  GitRoaster analyzes your code in real-time but never stores it.
                  Only PR metadata (numbers, timestamps, status) is tracked —
                  your code, vulnerabilities, and suggestions live only in GitHub
                  PR comments.
                </p>
              </div>
            </div>

            {/* Stat tiles */}
            {isGitroasterAppDownloaded && repoCount > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {STAT_TILES.map((data, idx) => (
                  <div
                    key={idx}
                    className="group relative overflow-hidden rounded-2xl border bg-card/60 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div
                      className="absolute -right-8 -top-8 size-24 rounded-full opacity-50 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
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
            )}

            {/* Repository List Section */}
            <div className="rounded-2xl border bg-card/60 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3 border-b px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <GitBranchIcon className="size-4.5" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold">
                      Repository List
                    </h2>
                    <p className="truncate text-xs text-muted-foreground">
                      Repositories connected to GitRoaster for AI code reviews
                    </p>
                  </div>
                </div>
              </div>

              {repoCount === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 px-6 py-14 text-center">
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <GitBranchIcon className="size-8" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-semibold">
                      No Repositories Connected
                    </h3>
                    <p className="mx-auto max-w-md text-sm text-muted-foreground">
                      Connect your first repository to start getting AI-powered
                      code reviews on your pull requests.
                    </p>
                  </div>

                  <Button asChild size="lg" className="gap-2">
                    <Link
                      href={
                        installationIdFromGithub
                          ? appManagementURL
                          : appInstallationURL
                      }
                      target="_blank"
                    >
                      {installationIdFromGithub ? (
                        <>
                          <PlusIcon className="size-5" />
                          Connect Your First Repository
                        </>
                      ) : (
                        <>
                          Install GitRoaster App
                          <ExternalLinkIcon className="size-4" />
                        </>
                      )}
                    </Link>
                  </Button>

                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>✅ Takes 30 seconds to setup</p>
                    <p>✅ Works with public and private repos</p>
                    <p>✅ No code stored on our servers</p>
                  </div>
                </div>
              ) : (
                <RepoContainer repos={repos || []} />
              )}
            </div>

            {/* Help Section */}
            {repoCount === 0 && (
              <div className="rounded-2xl border bg-card/60 backdrop-blur-sm">
                <div className="flex items-center gap-3 border-b px-5 py-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-tertiary/15 text-tertiary">
                    <AlertCircleIcon className="size-4.5" />
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold">
                      Need Help Getting Started?
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Quick guide to connect your repositories
                    </p>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  {[
                    {
                      title: "Install GitRoaster GitHub App",
                      desc: 'Click "Connect Your First Repository" to install our GitHub app',
                    },
                    {
                      title: "Select Repositories",
                      desc: "Choose which repositories you want GitRoaster to review",
                    },
                    {
                      title: "Create a Pull Request",
                      desc: "GitRoaster will automatically review your next PR with AI insights",
                    },
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-primary-foreground">
                        {idx + 1}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-semibold">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex h-full min-h-screen w-full items-center justify-center text-muted-foreground">
        Something went wrong on the repositories page. Please try again later.
      </div>
    );
  }
};

export const RepositoriesPageLoader = () => {
  return (
    <div className="flex h-full max-h-svh flex-col overflow-hidden bg-background">
      {/* Header Skeleton */}
      <header className="flex h-[68px] shrink-0 items-center justify-between gap-4 border-b bg-card px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3 w-72" />
          </div>
        </div>
        <Skeleton className="hidden h-9 w-40 sm:block" />
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        {/* Privacy pill */}
        <div className="flex items-start gap-3 rounded-2xl border border-secondary/30 bg-secondary/5 p-4">
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

        {/* Stat tiles Skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-28 w-full rounded-2xl" />
          ))}
        </div>

        {/* Repository List Section Skeleton */}
        <div className="rounded-2xl border bg-card/60 backdrop-blur-sm">
          <div className="flex items-center gap-3 border-b px-5 py-4">
            <Skeleton className="size-9 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-64" />
            </div>
          </div>
          <div className="divide-y">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4"
              >
                <div className="flex flex-1 items-center gap-3">
                  <Skeleton className="size-10 rounded-xl" />
                  <Skeleton className="h-5 w-56" />
                </div>
                <Skeleton className="h-8 w-28 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
