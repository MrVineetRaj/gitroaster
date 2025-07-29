import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const LandingPage = () => {
  return (
    <div>
      <div className="py-[16vh] flex items-center flex-col gap-6">
        <h1 className="text-6xl font-bold">
          Welcome To <span className="text-primary">GitRoaster</span>
        </h1>
        <h3 className="text-lg italic text-center text-muted-foreground">
          An AI companion to review all your pull requests on github
        </h3>
        <span className="mt-8 flex items-center gap-4">
          <Link href={"/auth"}>
            <Button className="font-bold rounded-full">
              <span>Start Now</span>
              <ChevronRight />
            </Button>
          </Link>
          <Link
            href={"https://github.com/unknownbug-tech/unknownbug-ui/pull/9"}
            target="_blank"
          >
            <Button variant={"outline"} className="font-bold rounded-full">
              <span>Check Demo</span>
              <ChevronRight />
            </Button>
          </Link>
        </span>
      </div>
      <div className="absolute inset-0 -z-10 h-full w-full bg-background dark:bg-[radial-gradient(#393e4a_1px,transparent_1px)] bg-[radial-gradient(#dadde2_1px,transparent_1px)]  [background-size:16px_16px]" />
    </div>
  );
};

export default LandingPage;
