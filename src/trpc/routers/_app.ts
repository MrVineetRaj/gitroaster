import { z } from "zod";
import { createTRPCRouter } from "../init";

import { userRouter } from "@/modules/user/provider";
import { githubRouter } from "@/modules/github/procedure";
import { teamRouter } from "@/modules/team/procedure";
import { razorPayRouter } from "@/modules/razorpay/procedure";
export const appRouter = createTRPCRouter({
  userRouter,
  githubRouter,
  teamRouter,
  razorPayRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
