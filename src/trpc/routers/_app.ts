import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { TRPCError } from "@trpc/server";
import { userRouter } from "@/modules/user/provider";
import { githubRouter } from "@/modules/github/procedure";
export const appRouter = createTRPCRouter({
  userRouter,
  githubRouter,
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
