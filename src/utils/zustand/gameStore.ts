import { IMessage } from "@components/playQuiz/Lobby";
import { create } from "zustand";

interface IProps {
  socketId: string;
  userName: string;
  quizName: string;
  numOfQuestions: string;
  numOfTeams: number;
  messages: IMessage[];
  teamMessages: IMessage[];
  setSocketId: (socketId: string) => void;
  setUserName: (userName: string) => void;
  setQuizName: (quizName: string) => void;
  setNumOfQuestions: (numOfQuestions: string) => void;
  setNumOfTeams: (numOfTeams: number) => void;
  setMessages: (messages: IMessage[]) => void;
  setTeamMessages: (teamMessages: IMessage[]) => void;
}

export const useGameStore = create<IProps>((set) => ({
  socketId: "",
  userName: "",
  quizName: "",
  numOfQuestions: "",
  numOfTeams: 2,
  messages: [],
  teamMessages: [],
  setSocketId: (socketId: string) => set({ socketId }),
  setUserName: (userName: string) => set({ userName }),
  setQuizName: (quizName: string) => set({ quizName }),
  setNumOfQuestions: (numOfQuestions: string) => set({ numOfQuestions }),
  setNumOfTeams: (numOfTeams: number) => set({ numOfTeams }),
  setMessages: (messages: IMessage[]) => set({ messages }),
  setTeamMessages: (teamMessages: IMessage[]) => set({ teamMessages }),
}));
