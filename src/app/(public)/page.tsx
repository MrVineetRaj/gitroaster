import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Check,
  ChevronRight,
  Clock,
  Github,
  GitPullRequest,
  Play,
  Shield,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DemoVideoPlayer } from "@/components/shared/demo-video-player";

const problemStats = [
  { metric: "73%", desc: "of teams wait 24+ hours for code reviews" },
  { metric: "42%", desc: "of critical bugs escape to production" },
  { metric: "6.5h", desc: "average time lost per developer weekly" },
];

const solutionFeatures = [
  {
    icon: <Clock className="size-5" />,
    title: "Sub-2 Minute Reviews",
    desc: "AI analyzes your code faster than you can grab coffee.",
    accent: "primary",
  },
  {
    icon: <Shield className="size-5" />,
    title: "Security & Bug Detection",
    desc: "Catch vulnerabilities and issues before they hit production.",
    accent: "secondary",
  },
  {
    icon: <TrendingUp className="size-5" />,
    title: "Consistent Quality",
    desc: "Every review follows the same high standards, every time.",
    accent: "tertiary",
  },
  {
    icon: <Users className="size-5" />,
    title: "Educational Feedback",
    desc: "Learn from AI insights that make your whole team better.",
    accent: "chart-4",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Connect GitHub",
    desc: "Install our GitHub app with OAuth in seconds.",
    icon: <Github className="size-5" />,
  },
  {
    step: "02",
    title: "Configure Repositories",
    desc: "Select repos and set review preferences.",
    icon: <Zap className="size-5" />,
  },
  {
    step: "03",
    title: "Open Pull Requests",
    desc: "Your workflow stays exactly the same.",
    icon: <GitPullRequest className="size-5" />,
  },
  {
    step: "04",
    title: "Receive AI Reviews",
    desc: "Get detailed feedback and suggestions instantly.",
    icon: <Bot className="size-5" />,
  },
];

const painPoints = [
  "Pull requests sitting idle for days",
  "Critical bugs escaping to production",
  "Inconsistent review quality across reviewers",
  "Senior developers becoming review bottlenecks",
  "Context switching disrupting deep work",
  "Junior developers not getting enough feedback",
];

const faqs = [
  {
    question: "How does GitRoaster integrate with my existing workflow?",
    answer:
      "GitRoaster seamlessly integrates with your GitHub repositories through our GitHub App. Once installed, it automatically reviews pull requests without changing your existing workflow. Your team continues to create PRs as usual, and GitRoaster provides instant feedback through GitHub comments.",
  },
  {
    question: "What programming languages does GitRoaster support?",
    answer:
      "GitRoaster supports all major programming languages including JavaScript, TypeScript, Python, Java, C#, Go, Rust, PHP, Ruby, and more. Our AI is continuously trained on diverse codebases to provide accurate reviews across different languages and frameworks.",
  },
  {
    question: "How do I skip reviews for specific pull requests?",
    answer:
      "Simply add '@gitroaster @!ignore' anywhere in your PR description or comments, and GitRoaster will skip reviewing that particular pull request. This gives you full control over when to use automated reviews.",
  },
  {
    question: "Is my code secure? Do you store my source code?",
    answer:
      "Your code never leaves GitHub. GitRoaster only processes your code in real-time for reviews and doesn't store your source code on our servers. We only store PR metadata like timestamps, status, and review comments to provide analytics and improve our service.",
  },
  {
    question: "How does team management work?",
    answer:
      "You can invite team members and control whose pull requests get reviewed. Only PRs from enabled team members will be automatically reviewed, giving you granular control over the review process. Team admins can manage permissions through the dashboard.",
  },
  {
    question: "What happens after my 7-day free trial ends?",
    answer:
      "After your trial ends, you can choose from our flexible pricing plans based on your team size and usage. If you don't upgrade, GitRoaster will stop reviewing new PRs, but all existing review history remains accessible in your GitHub repositories.",
  },
];

const SectionEyebrow = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
    <Sparkles className="size-3.5" />
    {children}
  </span>
);

const LandingPage = () => {
  return (
    <div className="relative flex w-full max-w-full flex-1 flex-col items-center overflow-x-hidden bg-background">
      {/* Global ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(156,163,175,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(156,163,175,0.04)_1px,transparent_1px)] bg-[size:34px_34px]" />
        <div className="absolute -left-40 -top-40 size-[32rem] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-40 top-1/3 size-[32rem] rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-tertiary/10 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-4 pb-20 pt-[10vh] text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-tertiary/30 bg-tertiary/10 px-4 py-1.5 text-sm font-medium text-tertiary">
          <AlertTriangle className="size-4" />
          <span>Code reviews slowing you down?</span>
        </div>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
          Stop waiting <span className="text-destructive">days</span> for code
          reviews.
          <br />
          <span className="bg-gradient-to-r from-primary via-chart-4 to-secondary bg-clip-text text-transparent">
            Get them in minutes.
          </span>
        </h1>

        <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-2xl">
          AI-powered code reviews that catch bugs, improve quality, and
          accelerate your development workflow.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/auth">
            <Button
              size="lg"
              className="group rounded-full px-8 py-6 text-base font-semibold transition-transform hover:scale-[1.03]"
            >
              Start Free Trial
              <ChevronRight className="ml-1 size-5 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <Link href="#demo">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-6 text-base font-semibold"
            >
              <Play className="mr-1 size-5" />
              Watch Demo
            </Button>
          </Link>
        </div>

        <p className="text-sm font-medium text-muted-foreground">
          7-day free trial • No credit card required
        </p>

        {/* Hero product mock — example AI review */}
        <div className="mt-6 w-full max-w-3xl">
          <div className="rounded-2xl border bg-card/70 p-1.5 shadow-2xl shadow-primary/5 backdrop-blur-sm">
            <div className="overflow-hidden rounded-xl border bg-background/60">
              <div className="flex items-center justify-between gap-3 border-b bg-card/40 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-destructive/60" />
                  <span className="size-3 rounded-full bg-tertiary/60" />
                  <span className="size-3 rounded-full bg-secondary/60" />
                </div>
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <GitPullRequest className="size-3.5" />
                  feat/checkout-flow #128
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary/15 px-2 py-0.5 text-[11px] font-medium text-secondary">
                  <Check className="size-3" />
                  Reviewed in 87s
                </span>
              </div>

              <div className="space-y-3 p-4 text-left">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Bot className="size-4" />
                  </span>
                  <span className="text-sm font-semibold">GitRoaster</span>
                  <span className="text-xs text-muted-foreground">
                    left a review
                  </span>
                </div>

                <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3">
                  <ShieldAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
                  <p className="text-sm text-foreground/90">
                    Potential SQL injection: user input is concatenated directly
                    into the query on{" "}
                    <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                      db/orders.ts:42
                    </code>
                    .
                  </p>
                </div>

                <div className="flex items-start gap-2 rounded-xl border border-secondary/30 bg-secondary/5 p-3">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-secondary" />
                  <p className="text-sm text-foreground/90">
                    Suggestion: use a parameterized query to safely bind{" "}
                    <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                      userId
                    </code>{" "}
                    and prevent injection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section id="demo" className="relative w-full scroll-mt-20 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-12 flex flex-col items-center gap-3 text-center">
            <SectionEyebrow>Live Demo</SectionEyebrow>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              See GitRoaster in Action
            </h2>
            <p className="text-lg text-muted-foreground">
              From setup to first review in under 2 minutes.
            </p>
          </div>
          <DemoVideoPlayer />
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative w-full py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-14 flex flex-col items-center gap-3 text-center">
            <SectionEyebrow>The Problem</SectionEyebrow>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              The Cost of Slow Code Reviews
            </h2>
            <p className="max-w-3xl text-lg text-muted-foreground">
              Manual code reviews create bottlenecks that slow down entire teams
              and let critical issues slip through.
            </p>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {problemStats.map((stat, index) => (
              <div
                key={index}
                className="rounded-2xl border bg-card/60 p-8 text-center backdrop-blur-sm"
              >
                <div className="mb-2 text-4xl font-bold text-destructive md:text-5xl">
                  {stat.metric}
                </div>
                <p className="text-sm text-muted-foreground">{stat.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border bg-card/60 p-8 backdrop-blur-sm">
            <h3 className="mb-5 text-lg font-semibold">Common Pain Points</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {painPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <AlertTriangle className="size-3" />
                  </span>
                  <p className="text-sm text-foreground/90">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="relative w-full py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-14 flex flex-col items-center gap-3 text-center">
            <SectionEyebrow>The Solution</SectionEyebrow>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              How GitRoaster Solves This
            </h2>
            <p className="max-w-3xl text-lg text-muted-foreground">
              AI-powered reviews that are faster, more consistent, and more
              thorough than manual reviews.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {solutionFeatures.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className="absolute -right-8 -top-8 size-24 rounded-full opacity-40 blur-2xl transition-opacity duration-300 group-hover:opacity-90"
                  style={{ background: `var(--${feature.accent})` }}
                />
                <div className="relative flex items-start gap-4">
                  <span
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: `color-mix(in oklab, var(--${feature.accent}) 15%, transparent)`,
                      color: `var(--${feature.accent})`,
                    }}
                  >
                    {feature.icon}
                  </span>
                  <div>
                    <h3 className="mb-1.5 text-lg font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative w-full py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-14 flex flex-col items-center gap-3 text-center">
            <SectionEyebrow>Getting Started</SectionEyebrow>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Get up and running in minutes, not hours.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, index) => (
              <div
                key={step.step}
                className="relative rounded-2xl border bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {step.icon}
                  </span>
                  <span className="font-mono text-2xl font-bold text-muted-foreground/30">
                    {step.step}
                  </span>
                </div>
                <h3 className="mb-1.5 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
                {index < howItWorks.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 hidden size-5 -translate-y-1/2 text-border lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative w-full py-24">
        <div className="mx-auto max-w-4xl px-4">
          <div className="relative overflow-hidden rounded-3xl border bg-card/70 p-10 text-center backdrop-blur-sm md:p-14">
            <div className="pointer-events-none absolute -left-20 -top-20 size-72 rounded-full bg-primary/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 size-72 rounded-full bg-secondary/15 blur-3xl" />
            <div className="relative flex flex-col items-center gap-4">
              <SectionEyebrow>Ready when you are</SectionEyebrow>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Ready to accelerate your code reviews?
              </h2>
              <p className="max-w-2xl text-lg text-muted-foreground">
                Join engineering teams using GitRoaster to ship better code,
                faster.
              </p>
              <Link href="/auth" className="mt-2">
                <Button
                  size="lg"
                  className="group rounded-full px-8 py-6 text-base font-semibold transition-transform hover:scale-[1.03]"
                >
                  Start Free Trial
                  <ChevronRight className="ml-1 size-5 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                7-day free trial • No setup fees • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative w-full py-24">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-14 flex flex-col items-center gap-3 text-center">
            <SectionEyebrow>FAQ</SectionEyebrow>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about GitRoaster.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-2xl border bg-card/60 px-6 backdrop-blur-sm"
              >
                <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="mb-4 text-muted-foreground">
              Still have questions? We&apos;re here to help.
            </p>
            <Button asChild variant="outline" className="rounded-full">
              <a href="mailto:team@gitroaster.space">Contact Support</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative w-full border-t bg-card/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row">
          <p className="flex items-center gap-2 font-semibold text-foreground">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Bot className="size-4" />
            </span>
            GitRoaster
          </p>
          <p>Built by developers, for developers.</p>
          <p>
            &copy; {new Date().getFullYear()} GitRoaster. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
