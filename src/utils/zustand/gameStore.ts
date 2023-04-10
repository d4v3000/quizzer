import { create } from "zustand";

interface IProps {
  socketId: string;
  userName: string;
  quizName: string;
  numOfQuestions: string;
  setSocketId: (socketId: string) => void;
  setUserName: (userName: string) => void;
  setQuizName: (quizName: string) => void;
  setNumOfQuestions: (numOfQuestions: string) => void;
}

export const useGameStore = create<IProps>((set) => ({
  socketId: "",
  userName: "",
  quizName: "",
  numOfQuestions: "",
  setSocketId: (socketId: string) => set({ socketId }),
  setUserName: (userName: string) => set({ userName }),
  setQuizName: (quizName: string) => set({ quizName }),
  setNumOfQuestions: (numOfQuestions: string) => set({ numOfQuestions }),
}));
