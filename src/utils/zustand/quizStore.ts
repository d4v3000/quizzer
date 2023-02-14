import { create } from "zustand";
import { IQuestion } from "../../models/question";

interface IProps {
  name: string;
  numTeams: number;
  questions: IQuestion[];
  setName: (name: string) => void;
  setNumTeams: (numTeams: number) => void;
  setQuestions: (questions: IQuestion[]) => void;
  currentQuestion: number;
  setCurrentQuestion: (currentQuestion: number) => void;
}

export const useQuizStore = create<IProps>((set) => ({
  name: "",
  numTeams: 0,
  questions: [],
  setName: (name: string) => set({ name }),
  setNumTeams: (numTeams: number) => set({ numTeams }),
  setQuestions: (questions: IQuestion[]) => set({ questions }),
  currentQuestion: -1,
  setCurrentQuestion: (currentQuestion: number) => set({ currentQuestion }),
}));
