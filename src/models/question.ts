export interface IQuestion {
  title: string;
  type: string;
  imgUrl?: string;
  sourceUrl?: string;
}

export interface IQuestionAnswer extends IQuestion {
  answers: {
    id: string;
    title: string;
    correct: boolean;
  }[];
}

export interface IGuessingAnswer extends IQuestion {
  answer: number;
}

export interface ILocationAnswer extends IQuestion {
  answer: {
    x: number;
    y: number;
  };
}
