export interface IQuestion {
  title: string;
  type: "question" | "location" | "guessing";
  imgUrl?: string;
  answers: IAnswer[];
}

export interface IAnswer {
  title?: string;
  placeholder?: string;
  isCorrect?: boolean;
  x?: number;
  y?: number;
}
