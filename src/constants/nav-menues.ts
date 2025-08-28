import {
  ChartPieIcon,
  CogIcon,
  CrownIcon,
  DollarSignIcon,
  GitPullRequestIcon,
  LayoutDashboardIcon,
  Users2Icon,
} from "lucide-react";

export const DASHBOARD_NAV_MENU = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboardIcon,
    badge: null,
  },
  {
    title: "Repositories",
    href: "/dashboard/repositories",
    icon: GitPullRequestIcon,
    badge: null, // Example: number of connected repos
  },
  {
    title: "Team",
    href: "/dashboard/team",
    icon: Users2Icon,
    badge: null,
  },
  {
    title: "Config",
    href: "/dashboard/config",
    icon: CogIcon,
    badge: null,
  },
];

export const PROFILE_MENU = [
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: DollarSignIcon,
    badge: null,
  },
];

export const ADMIN_MENU = [
  {
    title: "Analytics",
    href: "/dashboard/admin/analytics",
    icon: ChartPieIcon,
    badge: null,
  },
  {
    title: "Plan and Subscription",
    href: "/dashboard/admin/plans-and-subscription",
    icon: CrownIcon,
    badge: null,
  },
];
