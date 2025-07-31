"use client";

import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { SunMoonIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { ISignedIn, ISignedOut } from "../auth/auth-control";
import { Session } from "next-auth";
import ThemeController from "./theme-controller";

export const Navbar = ({ session }: { session: Session | null }) => {
  return (
    <header className="bg-card w-full flex flex-col items-center border-b">
      <nav className="max-w-[1200px] px-4 flex items-center justify-between py-2 w-full">
        <Link href={"/"} className="flex items-center gap-2">
          <Image
            className="size-12"
            src={"/logo.png"}
            width={120}
            height={120}
            alt="logo"
          />
          <h2 className="text-xl font-semibold">GitRoaster</h2>
        </Link>
        <span className="flex items-center gap-2">
          <ThemeController />

          <ISignedOut session={session}>
            <Link href={"/auth"}>
              <Button variant="default" className="font-bold ">
                Get Started
              </Button>
            </Link>
          </ISignedOut>
          <ISignedIn session={session}>
            <Link href={"/dashboard"}>
              <Button variant="outline" className="font-bold !text-foreground">
                Dashboard
              </Button>
            </Link>
            <Image
              src={session?.user?.image!}
              alt={session?.githubUsername!}
              width={120}
              height={120}
              className="size-8 rounded-full"
            />
          </ISignedIn>
        </span>
      </nav>
    </header>
  );
};
