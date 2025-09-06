"use client";
import { GitHubRepo } from "@/modules/github/types";
import { GitCompareArrowsIcon, LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-col mt-6 p-2">
      {repos?.map((repo) => (
        <div
          key={repo?.full_name}
          className="grid grid-cols-[1fr_110px] gap-2 items-center p-2 hover:shadow-xl hover:shadow-gray-500! hover:bg-sidebar transition-all duration-200 rounded-md w-full"
        >
          {/* Left side - Repository info (takes remaining space) */}
          <Link
            href={`https://www.github.com/${repo?.full_name}`}
            className="flex items-center gap-2 min-w-0 overflow-hidden"
            target="_blank"
          >
            <GitCompareArrowsIcon className="flex-shrink-0" />
            <span className="truncate text-sm" title={repo?.full_name}>
              {repo?.full_name}
            </span>
            {repo?.private && <LockIcon className="flex-shrink-0 ml-1" />}
          </Link>

          {/* Right side - Button (fixed 110px width) */}
          {isConnectedRepo(repo) ? (
            <Button
              variant="outline"
              size="sm"
              className="!bg-green-500 text-white hover:!bg-green-600 w-full justify-self-end"
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
                : "Connected"}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="bg-red-500 text-white hover:bg-red-600 w-full justify-self-end"
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
              {connectRepo.isPending || loadingRepo
                ? "Loading..."
                : "Not connected"}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default RepoContainer;
