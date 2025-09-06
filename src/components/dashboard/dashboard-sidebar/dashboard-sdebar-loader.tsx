"use client";
import React, { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from "../../ui/sidebar";
import { cn } from "@/lib/utils";
import Image from "next/image";

import { Button } from "../../ui/button";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import ThemeController from "../../shared/theme-controller";

import { Skeleton } from "../../ui/skeleton";

export const DashboardSidebarLoader = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [hideSidebar, setHideSidebar] = useState(true);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      // Auto-collapse on tablets or mobile
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const NavItem = () => (
    <SidebarMenuItem className="w-full">
      {isCollapsed ? (
        <Skeleton className="w-10 h-10" />
      ) : (
        <div className="flex items-baseline gap-2">
          <Skeleton className="w-10 h-10" />
          <Skeleton className="w-full h-10" />
        </div>
      )}
    </SidebarMenuItem>
  );
  return (
    !hideSidebar && (
      <div className="max-w-72 mt-0">
        <SidebarProvider
          className={cn(
            "transition-all duration-300 ease-in-out border-r min-w-0 bg-red-500 ",
            isCollapsed ? "min-w-26 w-16" : "min-w-72 w-72"
          )}
        >
          <Sidebar
            className={cn(
              "transition-all duration-300 ease-in-out border-r !bg-green-500",
              isCollapsed ? "w-16" : "w-72"
            )}
            // collapsible={"icon"}
          >
            {/* Header */}
            <SidebarHeader
              className={cn(
                "border-b p-4 transition-all duration-300 bg-card h-18",
                isCollapsed ? "px-2" : "px-4"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    width={isCollapsed ? 32 : 40}
                    height={isCollapsed ? 32 : 40}
                    alt="GitRoaster"
                    src={"/logo.png"}
                    className="rounded-lg transition-all duration-300"
                  />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                </div>

                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      GitRoaster
                    </h2>
                    <p className="text-xs text-muted-foreground truncate">
                      AI Code Review Workspace
                    </p>
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="ml-auto p-2 hover:bg-accent"
                >
                  {isCollapsed ? (
                    <ChevronRightIcon className="size-4" />
                  ) : (
                    <ChevronLeftIcon className="size-4" />
                  )}
                </Button>
              </div>
            </SidebarHeader>{" "}
            {/* Content */}
            <SidebarContent className="flex-1 overflow-y-auto !bg-green-500">
              {/* Dashboard Section */}
              <SidebarGroup className="px-2">
                {!isCollapsed && (
                  <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                    Dashboard
                  </SidebarGroupLabel>
                )}
                <SidebarMenu className="space-y-1">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <NavItem key={idx} />
                  ))}
                </SidebarMenu>
              </SidebarGroup>

              {/* Profile Section */}
              <SidebarGroup className="px-2">
                {!isCollapsed && (
                  <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                    Account
                  </SidebarGroupLabel>
                )}
                <SidebarMenu className="space-y-1">
                  {Array.from({ length: 2 }).map((_, idx) => (
                    <NavItem key={idx} />
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            {/* Footer */}
            <SidebarFooter className="border-t  bg-card">
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg ",
                  isCollapsed ? "justify-center" : "justify-between"
                )}
              >
                {!isCollapsed ? (
                  <>
                    <div className="flex flex-col w-full">
                      <div className="flex items-center gap-3 p-3  rounded-lg ">
                        <Skeleton className="w-full h-10" />
                        <Skeleton className="w-10 h-10" />
                      </div>
                      <div className="flex items-center gap-3 p-3  rounded-lg ">
                        <div className="flex items-center flex-row gap-3 min-w-0 flex-1 w-full ">
                          <div className="relative">
                            <Skeleton className="w-10 h-10" />
                          </div>
                          <div className="min-w-0 flex-1 flex-col gap-1">
                            <Skeleton className="w-full h-7" />
                            <Skeleton className="w-16 h-2" />
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <ThemeController />
                          <Skeleton className="w-10 h-10" />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                      <Skeleton className="w-10 h-10" />
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <ThemeController />
                      <Skeleton className="w-10 h-10" />
                    </div>
                  </div>
                )}
              </div>
            </SidebarFooter>
          </Sidebar>
        </SidebarProvider>
      </div>
    )
  );
};
