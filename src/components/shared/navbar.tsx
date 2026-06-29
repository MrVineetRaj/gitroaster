"use client";

import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

import { ISignedIn, ISignedOut } from "../auth/auth-control";
import { Session } from "next-auth";
import ThemeController from "./theme-controller";

export const Navbar = ({ session }: { session: Session | null }) => {
  return (
    <header className="sticky top-0 z-50 flex w-full flex-col items-center border-b bg-background/80 backdrop-blur-xl">
      <nav className="flex w-full max-w-[1200px] items-center justify-between px-4 py-2">
        <Link href={"/"} className="flex items-center gap-2">
          <Image
            className="size-10"
            src={"/logo.png"}
            width={120}
            height={120}
            alt="logo"
          />
          <h2 className="text-xl font-semibold tracking-tight">GitRoaster</h2>
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
