import { create } from "zustand";
import { IQuestion } from "../../models/question";

type State = {
  name: string;
  numTeams: number;
  questions: IQuestion[];
  currentQuestion: number;
};

type Actions = {
  setName: (name: string) => void;
  setNumTeams: (numTeams: number) => void;
  setQuestions: (questions: IQuestion[]) => void;
  setCurrentQuestion: (currentQuestion: number) => void;
};

const initialState: State = {
  name: "",
  numTeams: 0,
  questions: [],
  currentQuestion: -1,
};

export const useQuizStore = create<State & Actions>((set, get) => ({
  ...initialState,
  setName: (name: string) => set({ name }),
  setNumTeams: (numTeams: number) => set({ numTeams }),
  setQuestions: (questions: IQuestion[]) => set({ questions }),
  setCurrentQuestion: (currentQuestion: number) => set({ currentQuestion }),
}));
