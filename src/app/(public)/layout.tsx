import { auth } from "@/auth";
import { Navbar } from "@/components/shared/navbar";
import React from "react";

interface Props {
  children: React.ReactNode;
}
const PublicLayout = async ({ children }: Props) => {
  const session = await auth();
  return (
    <div
      className="flex flex-col items-center  w-screen max-w-[100vw] min-h-screen "
      suppressHydrationWarning
    >
      <Navbar session={session} />
      {children}
    </div>
  );
};

export default PublicLayout;
