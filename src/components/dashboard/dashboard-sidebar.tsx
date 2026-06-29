"use client";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  ADMIN_MENU,
  DASHBOARD_NAV_MENU,
  PROFILE_MENU,
} from "@/constants/nav-menues";
import Link from "next/link";

import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import {
  CheckIcon,
  ClockIcon,
  CogIcon,
  LogOutIcon,
  LucideProps,
} from "lucide-react";
import ThemeController from "../shared/theme-controller";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "@/store/use-auth";
import usePlanStore from "@/store/use-plans";
import { Plan, UserRole } from "@/generated/prisma/browser";

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

type NavMenuItem = {
  title: string;
  href: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  badge: null;
};

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
    setPlans(plans);
  }, [plans]);

  if (!session?.accessToken) return null;

  const isActive = (href: string) =>
    href === "/dashboard" ? pathName === href : pathName.startsWith(href);

  const RailItem = ({ item }: { item: NavMenuItem }) => {
    const active = isActive(item.href);
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            className={cn(
              "group relative flex size-11 items-center justify-center rounded-xl transition-all duration-200",
              active
                ? "bg-primary text-primary-foreground shadow-[0_0_0_1px_var(--primary),0_8px_24px_-8px_var(--primary)]"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {/* active indicator bar */}
            <span
              className={cn(
                "absolute -left-3 h-6 w-1 rounded-full bg-primary transition-all duration-200",
                active ? "opacity-100" : "opacity-0 group-hover:opacity-40"
              )}
            />
            <item.icon className="size-5 transition-transform group-hover:scale-110" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {item.title}
        </TooltipContent>
      </Tooltip>
    );
  };

  const orgs = [session?.githubUsername!, ...(session?.orgs ?? [])].filter(
    Boolean
  );

  return (
    <aside className="z-30 hidden h-full w-[76px] shrink-0 flex-col items-center border-r bg-sidebar/60 py-4 backdrop-blur-xl md:flex">
      {/* Brand */}
      <Link href="/" className="relative mb-6">
        <Image
          width={40}
          height={40}
          alt="GitRoaster"
          src="/logo.png"
          className="rounded-xl ring-1 ring-border transition-transform hover:scale-105"
        />
        <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-secondary ring-2 ring-sidebar" />
      </Link>

      {/* Nav */}
      <nav className="flex flex-1 flex-col items-center gap-1.5">
        {DASHBOARD_NAV_MENU.map((item) => (
          <RailItem key={item.href} item={item} />
        ))}

        <Separator className="my-2 w-8" />

        {PROFILE_MENU.map((item) => (
          <RailItem key={item.href} item={item} />
        ))}

        {userRole === UserRole.ADMIN && (
          <>
            <Separator className="my-2 w-8" />
            {ADMIN_MENU.map((item) => (
              <RailItem key={item.href} item={item} />
            ))}
          </>
        )}
      </nav>

      {/* Footer controls */}
      <div className="mt-auto flex flex-col items-center gap-2">
        {isTrial && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex size-9 items-center justify-center rounded-xl border border-tertiary/40 bg-tertiary/10 text-tertiary">
                <ClockIcon className="size-4" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="right">
              Trial ends{" "}
              {trialEndAt
                ? new Date(
                    new Date(trialEndAt).getTime() - 60 * 1000
                  ).toLocaleDateString()
                : "N/A"}
            </TooltipContent>
          </Tooltip>
        )}

        <ThemeController />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full ring-2 ring-transparent transition-all hover:ring-primary/50 focus-visible:outline-none focus-visible:ring-primary">
              <Image
                width={36}
                height={36}
                alt="User avatar"
                src={session?.user?.image || "/default-avatar.png"}
                className="rounded-full"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end" className="w-60">
            <DropdownMenuLabel className="flex flex-col">
              <span className="truncate font-semibold">
                {session?.user?.name || "User"}
              </span>
              <span className="truncate text-xs font-normal text-muted-foreground">
                @{session?.githubUsername || "username"}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
              Organization
            </DropdownMenuLabel>
            {orgs.map((org) => (
              <DropdownMenuItem
                key={org}
                onClick={() => {
                  if (org === defaultOrg) return;
                  toast.loading("Changing organization");
                  updateDefaultOrg.mutateAsync({ orgname: org });
                }}
                className="justify-between"
              >
                <span className="truncate">{org}</span>
                {org === defaultOrg && (
                  <CheckIcon className="size-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={`https://github.com/settings/connections/applications/${process
                  .env.NEXT_PUBLIC_AUTH_GITHUB_ID!}`}
                target="_blank"
              >
                <CogIcon className="size-4" />
                Manage connection
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => signOut({ redirectTo: "/" })}
              variant="destructive"
            >
              <LogOutIcon className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
};
