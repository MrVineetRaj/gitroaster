import { Session } from "next-auth";
import React from "react";

interface AuthControlProps {
  session?: Session | null;
  user?: {
    username: string;
  };
  children: React.ReactNode;
}
export const ISignedIn = ({ session, user, children }: AuthControlProps) => {
  console.log(session?.accessToken);

  if (session?.accessToken) {
    return <>{children}</>;
  } else if (user?.username) {
    return <>{children}</>;
  } else return null;
};

export const ISignedOut = ({ session, user, children }: AuthControlProps) => {
  if (session?.accessToken || user?.username) {
    return null;
  } else return <>{children}</>;
};
