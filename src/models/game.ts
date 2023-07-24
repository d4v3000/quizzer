import { IQuestion } from "./question";

export interface IGame {
  id: string;
  teams: [];
  players: [];
  quizMaster: {
    id: string;
    name: string;
  };
  quizName: string;
  numOfQuestions: number;
  gameStarted: boolean;
  question: IQuestion;
  currentQuestionIndex: number;
}
