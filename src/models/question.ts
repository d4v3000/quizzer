export interface IQuestion {
  title: string;
  type: string;
  imgUrl?: string;
}

export interface IQuestionAnswer extends IQuestion {
  answers: {
    id: string;
    title: string;
    correct: boolean;
  }[];
}

export interface IGuessingAnswer extends IQuestion {
  answers: (string | undefined)[];
}

export interface ILocationAnswer extends IQuestion {
  answers: {
    x: number;
    y: number;
  }[];
}
