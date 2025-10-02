
import { createTRPCRouter } from "../init";

import { userRouter } from "@/modules/user/provider";
import { githubRouter } from "@/modules/github/procedure";
import { teamRouter } from "@/modules/team/procedure";
import { razorPayRouter } from "@/modules/razorpay/procedure";
import { dashboardRouter } from "@/modules/dashboard/procedure";
import { feedbackRouter } from "@/modules/feedback/procedure";

// various endpoints for the tRPC
export const appRouter = createTRPCRouter({
  userRouter,
  githubRouter,
  teamRouter,
  razorPayRouter,
  dashboardRouter,
  feedbackRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
