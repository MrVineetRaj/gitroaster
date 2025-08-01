import RepoContainer from "@/components/dashboard/repositories/repo-container";
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
import { githubOctokit } from "@/modules/github/utils";
import { caller } from "@/trpc/server";
import {
  AlertCircleIcon,
  ExternalLinkIcon,
  GitBranchIcon,
  PlusIcon,
  ShieldCheckIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export const RepositoriesPage = async () => {
  const { user, installationId } = await caller.userRouter.syncUser();

  console.log(installationId);
  const { repos } = await githubOctokit.getEnabledRepoForGitRoaster(
    user?.username,
    user?.defaultOrg,
    installationId ?? "00000"
  );

  const repoCount = repos?.length ?? 0;

  const appManagementURL =
    user.username === user.defaultOrg
      ? `https://github.com/settings/installations/${installationId}`
      : `https://github.com/organizations/${user.defaultOrg}/settings/installations/${installationId}`;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b">
        <div className="flex items-center justify-between p-2">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-3">
              Your repositories
              <span className="text-primary">{user?.username}</span>
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground italic">
              Manage and monitor your connected repositories for AI code reviews
            </p>
          </div>

          <div className="flex items-center gap-3">
            {installationId && (
              <>
                <Button asChild variant="outline" className="hidden sm:flex">
                  <Link
                    href={appManagementURL}
                    target="_blank"
                    className="flex gap-2 items-center"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Repositories
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
            GitRoaster analyzes your code in real-time but never stores it. Only
            PR metadata (numbers, timestamps, status) is tracked. Your code
            content, vulnerabilities, and suggestions remain in GitHub PR
            comments only.
          </p>
        </div>

        {/* Repository List Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <GitBranchIcon className="w-5 h-5 text-blue-500" />
                  Repository List
                  {repoCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {repoCount}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Repositories connected to GitRoaster for AI code reviews
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          {repoCount === 0 ? (
            <CardContent>
              <div className="text-center py-12">
                <GitBranchIcon className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Repositories Connected
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Connect your first repository to start getting AI-powered code
                  reviews on your pull requests.
                </p>

                <div className="space-y-4">
                  <Button asChild size="lg">
                    <Link href={appManagementURL} target="_blank">
                      <PlusIcon className="w-5 h-5 mr-2" />
                      Connect Your First Repository
                    </Link>
                  </Button>

                  <div className="text-sm text-muted-foreground">
                    <p>✅ Takes 30 seconds to setup</p>
                    <p>✅ Works with public and private repos</p>
                    <p>✅ No code stored on our servers</p>
                  </div>
                </div>
              </div>
            </CardContent>
          ) : (
            <CardContent className="p-0">
              <RepoContainer repos={repos || []} />
            </CardContent>
          )}
        </Card>
        {/* Help Section */}
        {repoCount === 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircleIcon className="w-5 h-5 text-orange-500" />
                Need Help Getting Started?
              </CardTitle>
              <CardDescription>
                Quick guide to connect your repositories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      Install GitRoaster GitHub App
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Click {`"Connect Your First Repository"`} to install our
                      GitHub app
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Select Repositories</h4>
                    <p className="text-sm text-muted-foreground">
                      Choose which repositories you want GitRoaster to review
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Create a Pull Request</h4>
                    <p className="text-sm text-muted-foreground">
                      GitRoaster will automatically review your next PR with AI
                      insights
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
export const RepositoriesPageLoader = () => {
  return (
    <div>
      <div className="px-4 py-2 bg-card border-b flex flex-col gap-2">
        <Skeleton className="w-64 h-8" />
        <Skeleton className="w-128 h-2" />
      </div>{" "}
      <div className="p-4 space-y-4">
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
      </div>
    </div>
  );
};
