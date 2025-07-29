import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

import { Octokit } from "@octokit/rest";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      authorization: {
        params: {
          scope: "read:user user:email read:org", // Added 'repo' scope for private repos
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Store the access token and GitHub username in the JWT token
      // console.log("token ",token)
      if (account && profile) {
        token.accessToken = account.access_token;
        token.githubUsername = profile.login; // GitHub username
      }
      // console.log(token.accessToken)
      return token;
    },
    async session({ session, token }) {
      const octokit = new Octokit({ auth: token.accessToken as string });
      console.log("token", token);
      // console.log("token.accessToken", token.accessToken);
      session.accessToken = token.accessToken as string;
      session.githubUsername = token.githubUsername as string;

      const orgs = await octokit.rest.orgs.listForAuthenticatedUser();

      const ownerOrgs: string[] = [];

      for (const org of orgs.data) {
        const membership =
          await octokit.rest.orgs.getMembershipForAuthenticatedUser({
            org: org.login,
          });
        if (membership.data.role === "admin") {
          // "admin" means Owner
          ownerOrgs.push(org.login);
        }
      }
      session.orgs = ownerOrgs || [];
      return session;
    },
  },
});
