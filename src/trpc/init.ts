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
// export const adminProtectedProcedure = t.procedure.use(isAdmin);
