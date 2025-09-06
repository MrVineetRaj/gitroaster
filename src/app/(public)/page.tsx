import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Github,
  Star,
  Zap,
  Shield,
  Users,
  Bot,
  Clock,
  X,
  Check,
  ArrowRight,
  Play,
  AlertTriangle,
  TrendingUp,
  Code,
  GitPullRequest,
  ChevronDown,
  ChevronUp,
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
    icon: <Clock className="w-6 h-6" />,
    title: "Sub-2 Minute Reviews",
    desc: "AI analyzes your code faster than you can grab coffee",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Security & Bug Detection",
    desc: "Catch vulnerabilities and issues before they hit production",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Consistent Quality",
    desc: "Every review follows the same high standards, every time",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Educational Feedback",
    desc: "Learn from AI insights that make your team better",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Connect GitHub",
    desc: "Install our GitHub app with OAuth in seconds",
    icon: <Github className="w-6 h-6" />,
  },
  {
    step: "02",
    title: "Configure Repositories",
    desc: "Select repos and set review preferences",
    icon: <Zap className="w-6 h-6" />,
  },
  {
    step: "03",
    title: "Open Pull Requests",
    desc: "Your workflow stays exactly the same",
    icon: <GitPullRequest className="w-6 h-6" />,
  },
  {
    step: "04",
    title: "Receive AI Reviews",
    desc: "Get detailed feedback and suggestions instantly",
    icon: <Bot className="w-6 h-6" />,
  },
];

const stats = [
  { number: "2,847", label: "PRs Reviewed" },
  { number: "127", label: "Active Teams" },
  { number: "99.9%", label: "Uptime SLA" },
  { number: "87s", label: "Avg Review Time" },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Staff Engineer",
    company: "Stripe",
    quote:
      "GitRoaster identified a critical race condition that would have cost us thousands in downtime. The AI understands our codebase better than some of our engineers.",
    avatar: "/api/placeholder/48/48",
    verified: true,
  },
  {
    name: "Marcus Rodriguez",
    role: "VP of Engineering",
    company: "Vercel",
    quote:
      "We've reduced our code review cycle time by 85% while actually improving quality. GitRoaster has become essential to our development process.",
    avatar: "/api/placeholder/48/48",
    verified: true,
  },
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

const LandingPage = () => {
  // const [isVideoMuted, setIsVideoMuted] = React.useState(true);
  return (
    <div
      className="flex-1 flex flex-col items-center w-[100%] max-w-[100%] relative overflow-x-hidden bg-background"
      style={{
        scrollBehavior: "smooth",
        scrollbarColor: "gray transparent",
        scrollbarWidth: "thin",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b ">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(156,163,175,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(156,163,175,0.03)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      </div>

      {/* Hero Section - The Hook */}
      <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center gap-8 pt-[8vh] pb-16 px-4">
        {/* Problem Statement */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-orange-200 dark:border-orange-800">
            <AlertTriangle className="w-4 h-4" />
            <span>Code reviews slowing you down?</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-center max-w-4xl mb-6 text-gray-900 dark:text-gray-50">
            Stop waiting <span className="text-red-600">days</span> for code
            reviews.
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Get them in minutes.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            AI-powered code reviews that catch bugs, improve quality, and
            accelerate your development workflow.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="/auth">
            <Button
              size="lg"
              className="font-semibold  px-8 py-4 text-lg bg-primary/90 hover:bg-primary transition-all duration-200 text-background hover:scale-105 rounded-full"
            >
              Start Free Trial
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="#demo">
            <Button
              variant="outline"
              size="lg"
              className="font-semibold rounded-full px-8 py-4 text-lg border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </Link>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          7-day free trial • No credit card required
        </div>
      </div>

      {/* Demo Video Section */}
      <div id="demo" className="relative w-full py-20 bg-background">
        <div className="absolute inset-0 bg-gradient-to-b ">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(156,163,175,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(156,163,175,0.03)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-50">
              See GitRoaster in Action
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              From setup to first review in under 2 minutes
            </p>
          </div>

          {/* Video Placeholder */}
 
              <DemoVideoPlayer/>
          
        </div>
      </div>

      {/* Problem Section - Redesigned */}
      <div className="relative w-full py-20">
        <div className="absolute inset-0 bg-gradient-to-b ">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(156,163,175,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(156,163,175,0.03)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-50">
              The Cost of Slow Code Reviews
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Manual code reviews create bottlenecks that slow down entire teams
              and let critical issues slip through.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {problemStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-red-600 mb-2">
                  {stat.metric}
                </div>
                <p className="text-gray-600 dark:text-gray-400">{stat.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-50">
              Common Pain Points
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Pull requests sitting idle for days",
                "Critical bugs escaping to production",
                "Inconsistent review quality across reviewers",
                "Senior developers becoming review bottlenecks",
                "Context switching disrupting deep work",
                "Junior developers not getting enough feedback",
              ].map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Solution Section - Redesigned */}
      <div className="relative w-full py-20">
        <div className="absolute inset-0 bg-gradient-to-b ">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(156,163,175,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(156,163,175,0.03)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-50">
              How GitRoaster Solves This
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              AI-powered reviews that are faster, more consistent, and more
              thorough than manual reviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solutionFeatures.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-blue-600 dark:text-blue-400">
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-50">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works - Redesigned */}
      <div className="relative w-full py-20">
        {/* Background Pattern for How It Works Section */}
        <div className="absolute inset-0 bg-gradient-to-b ">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(156,163,175,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(156,163,175,0.03)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-50">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Get up and running in minutes, not hours
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={step.step} className="text-center">
                <div className="relative mb-6">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center text-lg font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-6 left-full w-8 h-0.5 bg-gray-300 dark:bg-gray-600 -translate-x-2"></div>
                  )}
                </div>
                <div className="mb-3 flex justify-center">{step.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-50">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative w-full py-24">
        {/* Background Pattern for CTA */}
        <div className="absolute inset-0 bg-gradient-to-b ">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(156,163,175,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(156,163,175,0.03)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-12 border border-gray-200 dark:border-gray-600">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-50">
              Ready to accelerate your code reviews?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join engineering teams using GitRoaster to ship better code
              faster.
            </p>
            <Link href="/auth">
              <Button
                size="lg"
                className="font-semibold  px-8 py-4 text-lg bg-primary/90 hover:bg-primary transition-all duration-200 text-background hover:scale-105 rounded-full"
              >
                Start Free Trial
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              {"7-day free trial • No setup fees • Cancel anytime"}
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative w-full py-24">
        <div className="absolute inset-0 bg-gradient-to-b ">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(156,163,175,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(156,163,175,0.03)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-50">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need to know about GitRoaster
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline text-lg font-semibold text-gray-900 dark:text-gray-50">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {"Still have questions? We're here to help."}
            </p>
            <Button variant="outline" className="rounded-full">
              <a href="mailto:team@gitroaster.space">Contact Support</a>
            </Button>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="relative w-full text-center py-8 text-gray-500 dark:text-gray-400 text-sm bg-background">
        <div className="relative max-w-6xl mx-auto px-4">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            {"GitRoaster • Built by developers, for developers"}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
