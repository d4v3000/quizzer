import { create } from "zustand";
import { IQuestion } from "../../models/question";

type State = {
  name: string;
  questions: IQuestion[];
  currentQuestion: number;
};

type Actions = {
  setName: (name: string) => void;
  setQuestions: (questions: IQuestion[]) => void;
  setCurrentQuestion: (currentQuestion: number) => void;
};

const initialState: State = {
  name: "",
  questions: [],
  currentQuestion: -1,
};

export const useQuizStore = create<State & Actions>((set) => ({
  ...initialState,
  setName: (name: string) => set({ name }),
  setQuestions: (questions: IQuestion[]) => set({ questions }),
  setCurrentQuestion: (currentQuestion: number) => set({ currentQuestion }),
}));
