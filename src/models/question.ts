export interface IQuestion {
  title: string;
  type: "question" | "location" | "guessing";
  imgUrl?: string;
  multipleChoiceAnswers: IMultipleChoiceQuestionAnswer | null;
  guessingAnswer: IGuessingAnswer | null;
  locationAnswer: ILocationAnswer | null;
}

export interface IMultipleChoiceQuestionAnswer {
  answers: { name: string; isCorrect: boolean }[];
}

export interface IGuessingAnswer {
  answer: number;
}

export interface ILocationAnswer {
  x: number;
  y: number;
}

export interface IAnswer {
  title?: string;
  placeholder?: string;
  isCorrect?: boolean;
  x?: number;
  y?: number;
}
