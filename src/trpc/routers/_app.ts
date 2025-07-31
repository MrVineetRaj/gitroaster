import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { TRPCError } from "@trpc/server";
import { userRouter } from "@/modules/user/provider";
import { githubRouter } from "@/modules/github/procedure";
import { teamRouter } from "@/modules/team/procedure";
import { razorPayRouter } from "@/modules/razorpay/procedure";
export const appRouter = createTRPCRouter({
  userRouter,
  githubRouter,
  teamRouter,
  razorPayRouter,
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query(async (opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
