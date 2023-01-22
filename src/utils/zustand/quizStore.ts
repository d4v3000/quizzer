import { create } from "zustand";

interface IProps {
  name: string;
  numTeams: number;
  setName: (name: string) => void;
  setNumTeams: (numTeams: number) => void;
}

export const useQuizStore = create<IProps>((set) => ({
  name: "",
  numTeams: 0,
  setName: (name: string) => set({ name }),
  setNumTeams: (numTeams: number) => set({ numTeams }),
}));
