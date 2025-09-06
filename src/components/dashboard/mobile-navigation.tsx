"use client";

import { useState, useEffect, useRef } from "react";
import { CogIcon, LogOutIcon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import { Label } from "../ui/label";
import {
  ADMIN_MENU,
  DASHBOARD_NAV_MENU,
  PROFILE_MENU,
} from "@/constants/nav-menues";
import { usePathname } from "next/navigation";
import useAuthStore from "@/store/use-auth";
import { Plan } from "@/generated/prisma";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { toast } from "sonner";
import ThemeController from "../shared/theme-controller";
import { signOut } from "next-auth/react";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

interface MobileNavProps {
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

export const MobileNav = ({
  plans,
  session,
  userRole,
  defaultOrg,
  isTrial,
  trialEndAt,
}: MobileNavProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [hideNavbar, setHideNavbar] = useState(false);
  const pathName = usePathname();
  const { setUseDetails } = useAuthStore();
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
    const checkScreenSize = () => {
      // Auto-collapse on tablets or mobile
      if (window.innerWidth > 1068) {
        setHideNavbar(true);
      } else {
        setHideNavbar(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (session?.githubUsername && defaultOrg) {
      setUseDetails({
        username: session?.githubUsername,
        defaultOrg,
        userRole,
      });
    }
  }, [session, defaultOrg, userRole, setUseDetails]);

  return (
    !hideNavbar && (
      <>
        <div className="md:hidden h-16 max-h-16 sticky z-50 top-0 bg-card border-b px-4 flex items-center justify-between ">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              width={32}
              height={32}
              alt="GitRoaster"
              src="/logo.png"
              className="rounded-lg"
            />
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              GitRoaster
            </h2>
          </Link>

          {!isCollapsed ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(true)}
              className="p-2"
            >
              <X className="size-6" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(false)}
              className="p-2"
            >
              <Menu className="size-6" />
            </Button>
          )}
        </div>

        {!isCollapsed && (
          <div className="fixed top-16 z-50 bg-card w-full border-b-primary border-b-4 max-h-[400px] overflow-auto">
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
            </span>{" "}
            <div className="flex flex-col w-full   border">
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
                  <SelectTrigger className="w-full">{defaultOrg}</SelectTrigger>
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
              <div className="flex items-center gap-3 p-3  rounded-lg">
                <div className="flex items-center flex-row gap-3 min-w-0 flex-1 w-full ">
                  <div className="relative">
                    <Image
                      width={36}
                      height={36}
                      alt="User avatar"
                      src={session?.user?.image || "/default-avatar.png"}
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
            <Label className=" pl-4 pt-4 text-muted-foreground font-bold w-full text-center">
              Dashboard
            </Label>
            <div className="flex flex-col p-4 ">
              {DASHBOARD_NAV_MENU.map((item) => (
                <Link
                  onClick={() => setIsCollapsed(true)}
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "w-full border rounded-none flex items-center transition-all duration-300 group relative hover:bg-primary/20",
                    "p-4 gap-3",
                    pathName === item.href
                      ? "bg-primary text-primary-foreground shadow-md border-primary"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                  // onClick={() => setIsCollapsed(true)}
                >
                  <item.icon className="size-5" />
                  <span className="text-sm">{item.title}</span>
                </Link>
              ))}
            </div>
            <Label className=" pl-4 pt-4 text-muted-foreground font-bold w-full text-center">
              Account
            </Label>
            <div className="flex flex-col p-4 ">
              {PROFILE_MENU.map((item) => (
                <Link
                  onClick={() => setIsCollapsed(true)}
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "w-full border rounded-none flex items-center transition-all duration-300 group relative hover:bg-primary/20",
                    "p-4 gap-3"
                    // pathName === item.href
                    //   ? "bg-primary text-primary-foreground shadow-md border-primary"
                    //   : "hover:bg-accent hover:text-accent-foreground"
                  )}
                  // onClick={() => setIsCollapsed(true)}
                >
                  <item.icon className="size-5" />
                  <span className="text-sm">{item.title}</span>
                </Link>
              ))}
            </div>{" "}
            <Label className=" pl-4 pt-4 text-muted-foreground font-bold w-full text-center">
              ADMIN
            </Label>
            <div className="flex flex-col p-4 ">
              {ADMIN_MENU.map((item) => (
                <Link
                  onClick={() => setIsCollapsed(true)}
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "w-full border rounded-none flex items-center transition-all duration-300 group relative hover:bg-primary/20",
                    "p-4 gap-3",
                    pathName === item.href
                      ? "bg-primary text-primary-foreground shadow-md border-primary"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                  // onClick={() => setIsCollapsed(true)}
                >
                  <item.icon className="size-5" />
                  <span className="text-sm">{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </>
    )
  );
};
