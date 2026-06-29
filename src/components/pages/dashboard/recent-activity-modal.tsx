"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GitPullRequestIcon,
} from "lucide-react";
import { useState } from "react";
import { ActivityCard } from "./activity-card";

const PAGE_SIZE = 8;

export const RecentActivityModal = ({ orgname }: { orgname: string }) => {
  const trpc = useTRPC();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isFetching } = useQuery({
    ...trpc.dashboardRouter.getPRData.queryOptions({
      page,
      limit: PAGE_SIZE,
      orgname,
    }),
    enabled: open,
    placeholderData: (prev) => prev,
  });

  const items = data?.items ?? [];
  const hasMore = data?.hasMore ?? false;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setPage(1);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full gap-1">
          View all activity
          <ArrowUpRightIcon className="size-3" />
        </Button>
      </DialogTrigger>

      <DialogContent className="flex max-h-[85svh] flex-col gap-4 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Recent Activity</DialogTitle>
          <DialogDescription>
            Browse every AI code review across your repositories.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
          {isFetching && items.length === 0 ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="h-28 w-full rounded-2xl" />
            ))
          ) : items.length > 0 ? (
            items.map((item) => <ActivityCard key={item.id} item={item} />)
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-card/40 p-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <GitPullRequestIcon className="size-6" />
              </div>
              <h3 className="font-semibold">No more activity</h3>
              <p className="text-sm text-muted-foreground">
                There&apos;s nothing else to show on this page.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-row items-center justify-between sm:justify-between">
          <span className="text-xs text-muted-foreground">Page {page}</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeftIcon className="size-4" />
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              disabled={!hasMore || isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
