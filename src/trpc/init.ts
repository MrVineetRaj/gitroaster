import { auth } from "@/auth";
import { UserRole } from "@/generated/prisma";
import { db } from "@/lib/prisma";
import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";
export const createTRPCContext = cache(async () => {
  return { auth: await auth() };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.auth?.githubUsername) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not Authenticated",
    });
  }

  return next({
    ctx: {
      auth: ctx.auth,
    },
  });
});
const isAdmin = t.middleware(async ({ next, ctx }) => {
  if (!ctx.auth?.githubUsername) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not Authenticated",
    });
  }

  const user = await db.user.findUnique({
    where: {
      username: ctx.auth?.githubUsername!,
    },
  });

  if (user?.role !== UserRole.ADMIN) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not Authenticated",
    });
  }

  return next({
    ctx: {
      auth: ctx.auth,
      user,
    },
  });
});

const isOrgTeamMember = t.middleware(async ({ next, ctx, getRawInput }) => {
  // orgname can be in input (for queries/mutations)
  const input = await getRawInput();
  const orgname =
    typeof input === "object" && input !== null && "orgname" in input
      ? (input as { orgname: string | null }).orgname
      : undefined;
  console.log("input", orgname);

  if (!ctx.auth?.githubUsername) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not Authenticated",
    });
  }

  if (!orgname) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "orgname is required",
    });
  }

  // Check if user is a team member of the org
  const isMember = await db.userAsMemberAndOrg.findUnique({
    where: {
      orgname_teamMemberUsername: {
        orgname,
        teamMemberUsername: ctx.auth.githubUsername,
      },
      isAllowed: true,
    },
  });

  if (!isMember) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You are not a team member of this org",
    });
  }

  return next({
    ctx: {
      ...ctx,
    },
  });
});

// Usage:
export const orgTeamMemberProcedure = t.procedure
  .use(isAuthed)
  .use(isOrgTeamMember);

// const isAdmin = t.middleware(async ({ next, ctx }) => {
//   if (!ctx.auth?.githubUsername) {
//     throw new TRPCError({
//       code: "UNAUTHORIZED",
//       message: "Not Authenticated",
//     });
//   }

//   const user = await db.user.findUnique({
//     where: {
//       username: ctx.auth?.githubUsername,
//     },
//   });

//   if (user?.role !== UserRole.ADMIN) {
//     throw new TRPCError({
//       code: "UNAUTHORIZED",
//       message: "Not an ADMIN",
//     });
//   }

//   return next({
//     ctx: {
//       auth: ctx.auth,
//       dbUser: user,
//     },
//   });
// });

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProtectedProcedure = t.procedure.use(isAdmin);
export const teamMemberProtectedProcedure = t.procedure.use(isOrgTeamMember);
// export const adminProtectedProcedure = t.procedure.use(isAdmin);
