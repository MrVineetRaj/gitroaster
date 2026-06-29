import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RouterOutputs } from "@/trpc/routers/_app";
import { ExternalLinkIcon, GitBranchIcon } from "lucide-react";
import Link from "next/link";

export type ActivityItem =
  RouterOutputs["dashboardRouter"]["getPRData"]["items"][number];

export const ActivityCard = ({ item }: { item: ActivityItem }) => {
  return (
    <div className="group rounded-2xl border bg-card/60 p-4 backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card">
      <div className="flex items-start justify-between gap-2">
        <h3 className="line-clamp-1 font-semibold">{item?.title}</h3>
        <Badge
          className={cn(
            "shrink-0 rounded-full",
            item.status === "SUCCESS"
              ? "bg-secondary/15 text-secondary"
              : "bg-tertiary/15 text-tertiary"
          )}
        >
          {item?.status}
        </Badge>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>by {item?.author}</span>
        <span className="text-border">•</span>
        <span>
          {item?.timeTakenToReview < 60000
            ? `in ${Math.floor(item.timeTakenToReview / 1000)}s`
            : `within ${Math.ceil(item.timeTakenToReview / 60000)}m`}
        </span>
        <Badge variant="outline" className="rounded-full">
          {item?.tokenCount} tokens
        </Badge>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <GitBranchIcon className="size-3.5" />
          {item?.repoFullName}
        </span>
        <Link
          href={`https://www.github.com/${item?.repoFullName}/pull/${item?.pullNumber}`}
          target="_blank"
          className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100"
        >
          #{item?.pullNumber}
          <ExternalLinkIcon className="size-3" />
        </Link>
      </div>
    </div>
  );
};
