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
  mapName: string;
  lat: number | null;
  lon: number | null;
  placeName: string | null;
  withOutlines: boolean;
}
