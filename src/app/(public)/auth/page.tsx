import { auth } from "@/auth";
import { AuthenticationPage } from "@/components/auth/auth-page";
import React from "react";

import { redirect } from "next/navigation";

const AuthPage = async () => {
  const session = await auth();

  if (session?.accessToken) {
    redirect("/dashboard");
  }
  return <AuthenticationPage />;
};

export default AuthPage;
