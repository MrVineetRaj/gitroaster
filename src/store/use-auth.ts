import { create } from "zustand";

type AuthState = {
  username: string;
  defaultOrg: string;
  userRole: string;
  subscription: {
    planId: string;
    status: string;
  };
  setUseDetails: (userDetails: {
    username: string;
    defaultOrg: string;
    userRole?: string;
  }) => void;
  setSubscription: (subscription: { planId: string; status: string }) => void;
};

const useAuthStore = create<AuthState>((set) => ({
  username: "",
  userRole: "",
  subscription: {
    planId: "",
    status: "",
  },
  defaultOrg: "",
  installationId: "",
  setUseDetails: ({ username, defaultOrg, userRole = "USER" }) =>
    set({ username, defaultOrg, userRole }),
  setSubscription: (subscription) => set({ subscription }),
}));

export default useAuthStore;
