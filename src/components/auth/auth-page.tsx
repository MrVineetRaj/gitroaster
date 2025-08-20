import React from "react";
import { GithubIcon, GitlabIcon, LucideProps } from "lucide-react";
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

/**
 * @description For parent give it  a className of "flex flex-col h-{desired-height}" then it will take full remaining height in parent container
 */
const AuthenticationPage = () => {
  return (
    <div className="w-full flex items-center justify-between h-full relative">
      <div className="flex-3/5 bg-card h-full border-r"></div>
      <div className="flex-2/5 h-full flex items-center justify-center  w-full relative flex-col gap-4">
        {OAUTH_OPTIONS?.map((option) => {
          const Icon = option.icon;
          return (
            <form
              className="shadow-lg shadow-black border border-border rounded-lg flex items-center justify-center gap-4"
              action={async () => {
                "use server";
                await signIn(option?.platformName);
              }}
              key={option?.platformName}
            >
              <Button
                className="!bg-white font-bold !px-4 !py-2 active:scale-90 min-w-72"
                type="submit"
              >
                <Icon className="size-6" />
                <span>Continue with {option.platformName}</span>
              </Button>
            </form>
          );
        })}
        <div className="absolute inset-0 -z-10 h-full w-full bg-background dark:bg-[radial-gradient(#393e4a_1px,transparent_1px)] bg-[radial-gradient(#dadde2_1px,transparent_1px)]  [background-size:16px_16px]" />
      </div>
    </div>
  );
};

export { AuthenticationPage };
