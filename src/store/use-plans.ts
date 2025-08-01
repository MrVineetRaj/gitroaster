import { Plan } from "@/generated/prisma";
import { create } from "zustand";

type PlanState = {
  plans: Plan[];
  isPlansLoaded: boolean;
  setPlans: (plan: Plan[]) => void;
  getPlans: (period: string) => Plan[];
};

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
