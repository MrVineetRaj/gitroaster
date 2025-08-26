import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useAuthStore from "@/store/use-auth";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const LandingPage = () => {
  const currentYear = new Date().getFullYear();

  // Terms and Conditions

  // Privacy Policy

  // Shipping Policy

  // Contact Us

  // Cancellation and Refunds
  const POLICY_PAGES = [
    { name: "Privacy Policy", href: "/policy/privacy-policy" },
    { name: "Terms of Conditions", href: "/policy/terms-of-conditions" },
    { name: "Shipping Policy", href: "/policy/shipping-policy" },
    {
      name: "Cancellation and Refunds",
      href: "/policy/cancellation-and-refunds",
    },
  ];
  return (
    <div className="h-full flex flex-col items-center  w-full">
      <div className="py-[16vh] flex items-center flex-col gap-6 h-full  ">
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
      {/* <div className="w-full bg-card flex flex-col items-center py-2 ">
        <div className="w-full max-w-[1200px] flex gap-20 p-4 justify-around">
          <div className=" min-w-84 w-full flex flex-col gap-4">
            <div className="">
              <h1 className="text-2xl font-bold">GitRoaster</h1>
              <span className="text-sm text-muted-foreground">
                © {currentYear} All rights reserved.
              </span>
            </div>

            <form action="" className="flex flex-col gap-2 ">
              <span className="text-sm text-muted-foreground grid grid-cols-4">
                <Label className="col-span-1">Email</Label>
                <Input
                  className="col-span-3"
                  type="email"
                  placeholder="Your email please"
                />
              </span>
              <span className="text-sm text-muted-foreground grid grid-cols-4">
                <Label className="col-span-1">Message</Label>
                <Textarea
                  className="col-span-3"
                  placeholder="Your message please"
                />
              </span>
              <Button className="mt-4" type="submit">
                Submit
              </Button>
            </form>
          </div>
          <div className="w-full ">
            <h2 className="text-lg font-bold">Policies</h2>
            <ul className="flex flex-col gap-2">
              {POLICY_PAGES.map((page) => (
                <li key={page.name}>
                  <Link
                    href={page.href}
                    className="text-sm text-muted-foreground underline"
                  >
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Made with ❤️ by{" "}
          <Link
            href={"https://github.com/mrvineetraj"}
            target="_blank"
            className="underline"
          >
            Vineet Raj
          </Link>
        </div>
      </div> */}
    </div>
  );
};

export default LandingPage;
