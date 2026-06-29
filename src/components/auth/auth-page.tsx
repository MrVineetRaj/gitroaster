import React from "react";
import {
  ArrowRight,
  Bot,
  GithubIcon,
  LucideProps,
  ShieldCheck,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from "@/auth";
import Link from "next/link";

const OAUTH_OPTIONS: {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  platformName: string;
}[] = [
  {
    icon: GithubIcon,
    platformName: "github",
  },
];

const features = [
  {
    icon: <Zap className="size-5" />,
    title: "Instant Reviews",
    desc: "AI-powered feedback in under 2 minutes.",
    accent: "primary",
  },
  {
    icon: <Shield className="size-5" />,
    title: "Bug & Security Detection",
    desc: "Catch vulnerabilities and issues early.",
    accent: "secondary",
  },
  {
    icon: <Users className="size-5" />,
    title: "Team Management",
    desc: "Control who gets reviews with granular permissions.",
    accent: "tertiary",
  },
];

const AuthenticationPage = () => {
  return (
    <div className="relative flex min-h-0 w-full flex-1">
      {/* Left - Brand / marketing panel */}
      <div className="relative hidden flex-[3] overflow-hidden border-r bg-card/30 lg:flex">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(156,163,175,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(156,163,175,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute -left-32 -top-32 size-[28rem] rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute bottom-0 right-0 size-[26rem] rounded-full bg-secondary/15 blur-3xl" />
          <div className="absolute right-10 top-1/3 size-40 rounded-full bg-tertiary/10 blur-3xl" />
        </div>

        <div className="relative z-10 flex h-full flex-col justify-center px-12">
          <div className="max-w-lg">
            {/* Brand */}
            <div className="mb-8 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                <Bot className="size-6" />
              </span>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-bold tracking-tight text-transparent">
                GitRoaster
              </span>
            </div>

            {/* Hero text */}
            <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight">
              Transform Your
              <br />
              <span className="bg-gradient-to-r from-primary via-chart-4 to-secondary bg-clip-text text-transparent">
                Code Reviews
              </span>
            </h1>

            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              Join developers using AI-powered reviews to ship better code,
              faster.
            </p>

            {/* Features */}
            <div className="mb-8 space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: `color-mix(in oklab, var(--${feature.accent}) 15%, transparent)`,
                      color: `var(--${feature.accent})`,
                    }}
                  >
                    {feature.icon}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{feature.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Privacy callout */}
            <div className="flex items-start gap-3 rounded-2xl border border-secondary/30 bg-secondary/5 p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                <ShieldCheck className="size-5" />
              </span>
              <div className="space-y-0.5">
                <p className="text-sm font-semibold">Privacy-First by Design</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Your code never leaves GitHub. We only store PR metadata —
                  never your source code.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Sign in panel */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-12 lg:flex-[2]">
        {/* dotted backdrop */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:18px_18px] opacity-60" />

        <div className="w-full max-w-sm">
          {/* Brand (mobile only) */}
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <Bot className="size-5" />
            </span>
            <span className="text-xl font-bold tracking-tight">GitRoaster</span>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="size-3.5" />
              7-day free trial
            </span>
            <h2 className="mb-2 text-3xl font-bold tracking-tight">
              Get Started
            </h2>
            <p className="text-sm text-muted-foreground">
              Connect your GitHub account and start getting AI-powered code
              reviews instantly.
            </p>
          </div>

          {/* Auth buttons */}
          <div className="space-y-4">
            {OAUTH_OPTIONS?.map((option) => {
              const Icon = option.icon;
              return (
                <form
                  className="w-full"
                  action={async () => {
                    "use server";
                    await signIn(option?.platformName);
                  }}
                  key={option?.platformName}
                >
                  <Button
                    className="group h-auto w-full justify-between rounded-xl px-6 py-4 text-base font-semibold"
                    type="submit"
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="size-5" />
                      <span className="capitalize">
                        Continue with {option.platformName}
                      </span>
                    </span>
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Button>
                </form>
              );
            })}
          </div>

          {/* Reassurance */}
          <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-secondary" />
            Secure OAuth — we never see your password.
          </p>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            <Link href="/" className="font-medium text-primary hover:underline">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export { AuthenticationPage };
