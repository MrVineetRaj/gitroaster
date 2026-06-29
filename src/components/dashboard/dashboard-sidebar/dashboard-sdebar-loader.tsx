"use client";
import React from "react";
import { Skeleton } from "../../ui/skeleton";

export const DashboardSidebarLoader = () => {
  return (
    <aside className="z-30 hidden h-full w-[76px] shrink-0 flex-col items-center border-r bg-sidebar/60 py-4 backdrop-blur-xl md:flex">
      <Skeleton className="mb-6 size-10 rounded-xl" />

      <div className="flex flex-1 flex-col items-center gap-2">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Skeleton key={idx} className="size-11 rounded-xl" />
        ))}
      </div>

      <div className="mt-auto flex flex-col items-center gap-2">
        <Skeleton className="size-9 rounded-xl" />
        <Skeleton className="size-9 rounded-full" />
      </div>
    </aside>
  );
};
