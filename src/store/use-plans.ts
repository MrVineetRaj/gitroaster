import { Plan } from "@/generated/prisma";
import { create } from "zustand";

/**
 * Interface for storing active user's plan data in zustand
 */
type PlanState = {
  plans: Plan[];
  isPlansLoaded: boolean;
  setPlans: (plan: Plan[]) => void;
  getPlans: (period: string) => Plan[];
};

/**
 * Zustand store for active user's plan
 */
const usePlanStore = create<PlanState>((set, get) => ({
  isPlansLoaded: false,
  plans: [],
  plansToDisplay: [],
  setPlans: (plans) => {
    set({ plans, isPlansLoaded: true });
  },
  getPlans: (period) => {
    return get()
      .plans.filter((plan) => plan.period === period)
      .sort((a, b) => a.unitAmount - b.unitAmount);
  },
}));

export default usePlanStore;
