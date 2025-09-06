"use client";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
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
} from "../ui/sidebar";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  ADMIN_MENU,
  DASHBOARD_NAV_MENU,
  PROFILE_MENU,
} from "@/constants/nav-menues";
import Link from "next/link";

import { Button } from "../ui/button";
// import { signOut } from "@/auth";
import { signOut } from "next-auth/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CogIcon,
  LogOutIcon,
  LucideProps,
} from "lucide-react";
import ThemeController from "../shared/theme-controller";
import { Tooltip, TooltipTrigger } from "../ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "@/store/use-auth";
import { Plan, UserRole } from "@/generated/prisma";
import usePlanStore from "@/store/use-plans";

interface Props {
  session: Session | null;
  userRole: string;
  defaultOrg: string;
  subscription:
    | {
        status: string;
        username: string;
        orgname: string;
        updatedAt: Date;
        createdAt: Date;
        subscriptionId: string;
        planId: string;
        cycleStart: Date;
        cycleEnd: Date;
        upcomingPayment: Date | null;
      }
    | object;
  plans: Plan[];
  isTrial: boolean;
  trialEndAt: Date;
}

export const DashboardSidebar = ({
  plans,
  session,
  userRole,
  defaultOrg,
  isTrial,
  trialEndAt,
}: Props) => {
  const { setUseDetails } = useAuthStore();
  const { setPlans } = usePlanStore();
  const pathName = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [hideSidebar, setHideSidebar] = useState(true);
  const trpc = useTRPC();
  const updateDefaultOrg = useMutation(
    trpc.userRouter.updateDefaultGithubOrg.mutationOptions({
      onSuccess: () => {
        window.location.reload();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    })
  );

  useEffect(() => {
    if (session?.githubUsername && defaultOrg) {
      setUseDetails({
        username: session?.githubUsername,
        defaultOrg,
        userRole,
      });
    }
  }, [session, defaultOrg, userRole, setUseDetails]);

  useEffect(() => {
    // console.log("PRINTING");
    setPlans(plans);
  }, [plans]);
  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      // Auto-collapse on tablets or mobile
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
        setHideSidebar(true);
      } else {
        setIsCollapsed(false);
        setHideSidebar(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (!session?.accessToken) return <p>Loading</p>;

  const NavItem = ({
    item,
  }: {
    item: {
      title: string;
      href: string;
      icon: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
      >;
      badge: null;
    };
    section?: string;
  }) => (
    <SidebarMenuItem className="w-full">
      <Link
        href={item.href}
        className={cn(
          "w-full border rounded-lg flex items-center transition-all duration-300 group relative",
          isCollapsed ? "p-2 justify-center" : "p-3 gap-3",
          pathName === item.href
            ? "bg-primary text-primary-foreground shadow-md border-primary"
            : "hover:bg-accent hover:border-accent-foreground/20 active:bg-primary/20"
        )}
      >
        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <item.icon
                className={cn(
                  "size-5 flex-shrink-0 transition-transform group-hover:scale-110",
                  pathName === item.href ? "text-primary-foreground" : ""
                )}
              />
            </TooltipTrigger>
            <TooltipContent
              className="bg-card text-sm px-2 py-1 rounded-lg border"
              side="right"
            >
              {item.title}
            </TooltipContent>
          </Tooltip>
        ) : (
          <>
            <item.icon
              className={cn(
                "size-5 flex-shrink-0 transition-transform group-hover:scale-110",
                pathName === item.href ? "text-primary-foreground" : ""
              )}
            />
            <span>{item?.title}</span>
          </>
        )}
      </Link>
    </SidebarMenuItem>
  );

  return (
    !hideSidebar && (
      <div className="max-w-72 ">
        <SidebarProvider
          className={cn(
            "transition-all duration-300 ease-in-out border-r min-w-0 bg-r",
            isCollapsed ? "min-w-16 w-16" : "min-w-72 w-72"
          )}
        >
          <Sidebar
            className={cn(
              "transition-all duration-300 ease-in-out border-r bg-card !block",
              isCollapsed ? "w-16" : "w-72"
            )}
            collapsible={"icon"}
          >
            {/* Header */}
            <SidebarHeader
              className={cn(
                "border-b p-4 transition-all duration-300 bg-card h-18",
                isCollapsed ? "px-2" : "px-4"
              )}
            >
              <div className="flex items-center gap-3">
                <Link href={"/"} className="relative">
                  <Image
                    width={isCollapsed ? 32 : 40}
                    height={isCollapsed ? 32 : 40}
                    alt="GitRoaster"
                    src={"/logo.png"}
                    className="rounded-lg transition-all duration-300"
                  />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-background"></div>
                </Link>

                {!isCollapsed && (
                  <Link href={"/"} className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      GitRoaster
                    </h2>
                    <p className="text-xs text-muted-foreground truncate">
                      AI Code Review Workspace
                    </p>
                  </Link>
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
            <SidebarContent className="flex-1 overflow-y-auto bg-card">
              {!isCollapsed && (
                <span className="px-4 py-2 w-[100%] text-sm text-muted-foreground">
                  {isTrial && (
                    <span className="flex border border-primary w-[100%] py-2 text-sm italic font-bold text-primary rounded-full px-4 justify-center transition-all duration-1000">
                      <p>
                        Trial Ends on{" "}
                        {trialEndAt
                          ? new Date(
                              new Date(trialEndAt!).getTime() - 60 * 1000
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </span>
                  )}
                </span>
              )}

              {/* Dashboard Section */}
              <SidebarGroup className={cn("px-2", isCollapsed && "px-1")}>
                {!isCollapsed && (
                  <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                    Dashboard
                  </SidebarGroupLabel>
                )}
                <SidebarMenu className="space-y-1">
                  {DASHBOARD_NAV_MENU.map((item) => (
                    <NavItem key={item.href} item={item} section="dashboard" />
                  ))}
                </SidebarMenu>
              </SidebarGroup>

              {/* Profile Section */}
              <SidebarGroup className={cn("px-2", isCollapsed && "px-1")}>
                {!isCollapsed && (
                  <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                    Account
                  </SidebarGroupLabel>
                )}
                <SidebarMenu className="space-y-1">
                  {PROFILE_MENU.map((item) => (
                    <NavItem key={item.href} item={item} section="profile" />
                  ))}
                </SidebarMenu>
              </SidebarGroup>

              {/* Admin */}
              {userRole === UserRole.ADMIN && (
                <SidebarGroup className={cn("px-2", isCollapsed && "px-1")}>
                  {!isCollapsed && (
                    <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                      Admin
                    </SidebarGroupLabel>
                  )}
                  <SidebarMenu className="space-y-1">
                    {ADMIN_MENU.map((item) => (
                      <NavItem key={item.href} item={item} section="profile" />
                    ))}
                  </SidebarMenu>
                </SidebarGroup>
              )}
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
                        <Select
                          onValueChange={(value) => {
                            if (value === defaultOrg) return;
                            toast.loading("Changing organization");
                            updateDefaultOrg.mutateAsync({
                              orgname: value,
                            });
                          }}
                        >
                          <SelectTrigger className="w-full">
                            {defaultOrg}
                          </SelectTrigger>
                          <SelectContent title="Organizations">
                            <SelectItem value={session?.githubUsername!}>
                              {session?.githubUsername}
                            </SelectItem>
                            {session?.orgs?.map((org) => (
                              <SelectItem key={org} value={org}>
                                {org}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Link
                          href={`https://github.com/settings/connections/applications/${process
                            .env.NEXT_PUBLIC_AUTH_GITHUB_ID!}`}
                          target="_blank"
                        >
                          <Button variant="outline" size="sm" title="Sign out">
                            <CogIcon className="size-4" />
                          </Button>
                        </Link>
                      </div>
                      <div className="flex items-center gap-3 p-3  rounded-lg ">
                        <div className="flex items-center flex-row gap-3 min-w-0 flex-1 w-full ">
                          <div className="relative">
                            <Image
                              width={36}
                              height={36}
                              alt="User avatar"
                              src={
                                session?.user?.image || "/default-avatar.png"
                              }
                              className="rounded-full "
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-card rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">
                              {session?.user?.name || "User"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              @{session?.githubUsername || "username"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <ThemeController />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => signOut({ redirectTo: "/" })}
                            className="text-muted-foreground hover:bg-destructive! hover:text-white  p-2"
                            title="Sign out"
                          >
                            <LogOutIcon className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                      <Image
                        width={32}
                        height={32}
                        alt="User avatar"
                        src={session?.user?.image || "/default-avatar.png"}
                        className="rounded-full border-2 border-background"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-card rounded-full border-2 border-background"></div>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <ThemeController />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => signOut({ redirectTo: "/" })}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive p-1.5"
                        title="Sign out"
                      >
                        <LogOutIcon className="size-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </SidebarFooter>
          </Sidebar>
        </SidebarProvider>
        )
      </div>
    )
  );
};
