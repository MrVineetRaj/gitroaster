import { create } from "zustand";

type AuthState = {
  username: string;
  defaultOrg: string;

  subscription: {
    planId: string;
    status: string;
  };
  setUseDetails: (userDetails: {
    username: string;
    defaultOrg: string;
  }) => void;
  setSubscription: (subscription: { planId: string; status: string }) => void;
};

const useAuthStore = create<AuthState>((set) => ({
  username: "",

  subscription: {
    planId: "",
    status: "",
  },
  defaultOrg: "",
  installationId: "",
  setUseDetails: ({ username, defaultOrg }) => set({ username, defaultOrg }),
  setSubscription: (subscription) => set({ subscription }),
}));

export default useAuthStore;
