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
    })
  );

  return (
    <div className="flex flex-col mt-6 p-2">
      {repos?.map((repo) => (
        <div
          key={repo?.full_name}
          className="flex justify-between p-2 hover:shadow-xl hover:shadow-gray-500! hover:bg-sidebar transition-all duration-200 rounded-md"
        >
          <Link
            href={`https://www.github.com/${repo?.full_name}`}
            className="flex items-center gap-2"
            target="_blank"
          >
            <GitCompareArrowsIcon /> {repo?.full_name}{" "}
            {repo?.private && <LockIcon />}
          </Link>

          {isConnectedRepo(repo) ? (
            <Button
              className="bg-green-500!"
              onClick={() => {
                const toastId = toast.loading("Connecting Repo");
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
              className="bg-red-500!"
              onClick={() => {
                const toastId = toast.loading("Disconnecting Repo");
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
