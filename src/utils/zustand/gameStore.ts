import { IMessage } from "@components/playQuiz/Lobby";
import { create } from "zustand";

type State = {
  socketId: string;
  userName: string;
  quizName: string;
  numOfQuestions: string;
  numOfTeams: number;
  messages: IMessage[];
  teamMessages: IMessage[];
  gameStarted: boolean;
};

type Actions = {
  setSocketId: (socketId: string) => void;
  setUserName: (userName: string) => void;
  setQuizName: (quizName: string) => void;
  setNumOfQuestions: (numOfQuestions: string) => void;
  setNumOfTeams: (numOfTeams: number) => void;
  setGameStarted: (gameStarted: boolean) => void;
  addMessage: (message: IMessage) => void;
  addTeamMessage: (message: IMessage) => void;
  resetTeamMessages: () => void;
  resetMessages: () => void;
  reset: () => void;
  startGame: () => void;
};

const initialState: State = {
  socketId: "",
  userName: "",
  quizName: "",
  numOfQuestions: "",
  numOfTeams: 2,
  messages: [],
  teamMessages: [],
  gameStarted: false,
};

export const useGameStore = create<State & Actions>((set, get) => ({
  ...initialState,
  setSocketId: (socketId: string) => set({ socketId }),
  setUserName: (userName: string) => set({ userName }),
  setQuizName: (quizName: string) => set({ quizName }),
  setNumOfQuestions: (numOfQuestions: string) => set({ numOfQuestions }),
  setNumOfTeams: (numOfTeams: number) => set({ numOfTeams }),
  setGameStarted: (gameStarted: boolean) => set({ gameStarted }),
  addMessage: (message: IMessage) =>
    set({ messages: [...get().messages, message] }),
  addTeamMessage: (message: IMessage) =>
    set({ teamMessages: [...get().teamMessages, message] }),
  resetMessages: () => {
    set({ messages: [], teamMessages: [] });
  },
  resetTeamMessages: () => {
    set({ teamMessages: [] });
  },
  reset: () => {
    set(initialState);
  },
  startGame: () => {
    set({ gameStarted: true });
  },
}));
