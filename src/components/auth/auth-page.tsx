import React from "react";
import {
  GithubIcon,
  GitlabIcon,
  LucideProps,
  Star,
  Zap,
  Shield,
  Users,
  ArrowRight,
  Code,
  GitPullRequest,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from "@/auth";

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
  // {
  //   icon: GitlabIcon,
  //   platformName: "gitlab",
  // },
];
const features = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Instant Reviews",
    desc: "Get AI-powered feedback in under 2 minutes",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Bug Detection",
    desc: "Catch security issues and bugs early",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Team Management",
    desc: "Control who gets reviews with granular permissions",
  },
];

const stats = [
  { number: "2,847", label: "PRs Reviewed" },
  { number: "127", label: "Active Teams" },
  { number: "87s", label: "Avg Review Time" },
];

// ...existing code...

const AuthenticationPage = () => {
  return (
    <div className="w-full flex-1 flex relative min-h-0">
      <div className="flex-[3]  bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/20  border-r relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(156,163,175,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(156,163,175,0.1)_1px,transparent_1px)] bg-[size:20px_20px] dark:bg-[linear-gradient(to_right,rgba(75,85,99,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(75,85,99,0.3)_1px,transparent_1px)]"></div>

        <div className="relative z-10 h-full flex flex-col justify-center px-12">
          {/* Main Content */}
          <div className="max-w-lg">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                GitRoaster
              </span>
            </div>

            {/* Hero Text */}
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4 leading-tight">
              Transform Your
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Code Reviews
              </span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Join thousands of developers using AI-powered reviews to ship
              better code faster.
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-white/20 dark:border-gray-700/50">
                    <div className="text-blue-600 dark:text-blue-400">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-gray-50">
                      {feature.title}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                      - {feature.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/50">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stat.number}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Floating Elements */}
          <div className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-32 right-16 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 right-8 w-8 h-8 bg-blue-500/30 rounded-full"></div>
        </div>
      </div>

      {/* Right Section - Redesigned */}
      <div className="flex-[2]  flex flex-col items-center justify-center relative px-8 py-12">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-3">
            Get Started
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm">
            Connect your GitHub account and start getting AI-powered code reviews instantly
          </p>
        </div>

        {/* Auth Buttons */}
        <div className="w-full max-w-sm space-y-4">
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
                  className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-50 border border-gray-300 dark:border-gray-600 font-semibold px-6 py-4 h-auto shadow-lg hover:shadow-xl transition-all duration-200 group rounded-xl"
                  type="submit"
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="capitalize">Continue with {option.platformName}</span>
                  <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </form>
            );
          })}
        </div>

   

  
    

        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-background dark:bg-[radial-gradient(#393e4a_1px,transparent_1px)] bg-[radial-gradient(#dadde2_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>
    </div>
  );
};

export { AuthenticationPage };
