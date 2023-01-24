import { create } from "zustand";
import {
  IGuessingAnswer,
  ILocationAnswer,
  IQuestion,
  IQuestionAnswer,
} from "../../models/question";

interface IProps {
  name: string;
  numTeams: number;
  questions: (IQuestionAnswer | IGuessingAnswer | ILocationAnswer)[];
  setName: (name: string) => void;
  setNumTeams: (numTeams: number) => void;
  setQuestions: (
    questions: (IQuestionAnswer | IGuessingAnswer | ILocationAnswer)[]
  ) => void;
  currentQuestion: number;
  setCurrentQuestion: (currentQuestion: number) => void;
}

export const useQuizStore = create<IProps>((set) => ({
  name: "",
  numTeams: 0,
  questions: [],
  setName: (name: string) => set({ name }),
  setNumTeams: (numTeams: number) => set({ numTeams }),
  setQuestions: (
    questions: (IQuestionAnswer | IGuessingAnswer | ILocationAnswer)[]
  ) => set({ questions }),
  currentQuestion: -1,
  setCurrentQuestion: (currentQuestion: number) => set({ currentQuestion }),
}));
