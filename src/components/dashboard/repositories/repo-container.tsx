"use client";
import { GitHubRepo } from "@/modules/github/types";
import {
  CheckCircle2Icon,
  ExternalLinkIcon,
  GitBranchIcon,
  GlobeIcon,
  LockIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useAuthStore from "@/store/use-auth";
interface Props {
  repos: GitHubRepo[];
}
const RepoContainer = ({ repos }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { defaultOrg } = useAuthStore();
  const [toastId, setToastId] = useState<string | number>("");
  const { data: connectedRepo, isPending: loadingRepo } = useQuery(
    trpc.githubRouter.getAllConnectedRepo.queryOptions({
      orgname: defaultOrg,
    })
  );

  function isConnectedRepo(repo: GitHubRepo) {
    const isConnected = connectedRepo?.some(
      (item) => item.isConnected && item.repoFullName === repo.full_name
    );
    return isConnected;
  }

  const connectRepo = useMutation(
    trpc.githubRouter.connectRepo.mutationOptions({
      onSuccess: () => {
        toast.success("Repo connected successfully", {
          id: toastId,
        });
        queryClient.invalidateQueries(
          trpc.githubRouter.getAllConnectedRepo.queryOptions({
            orgname: defaultOrg,
          })
        );
      },
      onError: (error) => {
        toast.error(error.message, {
          id: toastId,
        });
      },
    })
  );

  const disconnectRepo = useMutation(
    trpc.githubRouter.disconnectRepo.mutationOptions({
      onSuccess: () => {
        toast.success("Repo disconnected successfully", {
          id: toastId,
        });
        queryClient.invalidateQueries(
          trpc.githubRouter.getAllConnectedRepo.queryOptions({
            orgname: defaultOrg,
          })
        );
      },
      onError: (error) => {
        toast.error(error.message, {
          id: toastId,
        });
      },
    })
  );

  return (
    <div className="flex flex-col gap-2 p-3">
      {repos?.map((repo) => {
        const connected = isConnectedRepo(repo);
        return (
          <div
            key={repo?.full_name}
            className="group grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl border bg-card/40 p-3 transition-all duration-200 hover:border-primary/40 hover:bg-card"
          >
            {/* Left side - Repository info (takes remaining space) */}
            <Link
              href={`https://www.github.com/${repo?.full_name}`}
              className="flex min-w-0 items-center gap-3 overflow-hidden"
              target="_blank"
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg",
                  connected
                    ? "bg-secondary/15 text-secondary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <GitBranchIcon className="size-4.5" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span
                  className="truncate text-sm font-medium"
                  title={repo?.full_name}
                >
                  {repo?.full_name}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {repo?.private ? (
                    <>
                      <LockIcon className="size-3" /> Private
                    </>
                  ) : (
                    <>
                      <GlobeIcon className="size-3" /> Public
                    </>
                  )}
                  <ExternalLinkIcon className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
              </span>
            </Link>

            {/* Right side - status badge + toggle */}
            <div className="flex items-center gap-2 justify-self-end">
              {connected && (
                <Badge className="hidden gap-1 rounded-full bg-secondary/15 text-secondary sm:inline-flex">
                  <CheckCircle2Icon className="size-3" />
                  Connected
                </Badge>
              )}
              {connected ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-28"
                  onClick={(e) => {
                    e.preventDefault();
                    const toastId = toast.loading("Disconnecting Repo");
                    setToastId(toastId);
                    disconnectRepo.mutateAsync({
                      repoFullName: repo.full_name,
                      orgname: defaultOrg,
                    });
                  }}
                  disabled={disconnectRepo?.isPending || loadingRepo}
                >
                  {disconnectRepo?.isPending || loadingRepo
                    ? "Loading..."
                    : "Disconnect"}
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="w-28"
                  onClick={(e) => {
                    e.preventDefault();
                    const toastId = toast.loading("Connecting Repo");
                    setToastId(toastId);
                    connectRepo.mutateAsync({
                      repoFullName: repo.full_name,
                      orgname: defaultOrg,
                    });
                  }}
                  disabled={connectRepo?.isPending || loadingRepo}
                >
                  {connectRepo.isPending || loadingRepo ? "Loading..." : "Connect"}
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RepoContainer;
