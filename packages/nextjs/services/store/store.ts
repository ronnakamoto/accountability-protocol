import create from "zustand";

/**
 * Zustand Store
 *
 * You can add global state to the app using this AppStore, to get & set
 * values from anywhere in the app.
 *
 * Think about it as a global useState.
 */

type TAppStore = {
  ethPrice: number;
  setEthPrice: (newEthPriceState: number) => void;
  userRole: string;
  setUserRole: (newUserRoleState: string) => void;
  projects: any;
  setProjects: (newProjectsState: any) => void;
  projectToInvestIn: any;
  setProjectToInvestIn: (newProjectToInvestInState: any) => void;
};

export const useAppStore = create<TAppStore>(set => ({
  ethPrice: 0,
  setEthPrice: (newValue: number): void => set(() => ({ ethPrice: newValue })),
  userRole: "",
  setUserRole: (newValue: string): void => set(() => ({ userRole: newValue })),
  projects: [],
  setProjects: (newValue: any): void => set(() => ({ projects: newValue })),
  projectToInvestIn: null,
  setProjectToInvestIn: (newValue: any): void => set(() => ({ projectToInvestIn: newValue })),
}));
