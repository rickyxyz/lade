export interface ProblemToAnswerType {
  short_answer: string | number;
  matrix: (string | number)[][];
  true_or_false: boolean[];
}

export interface AnswerSpecificProblemType {
  short_answer: {};
  matrix: {
    matrixWidth: number;
    matrixHeight: number;
  };
  true_or_false: {};
}

export type ProblemAnswerType = keyof ProblemToAnswerType;

type ProblemMapTypeToAnswerType<
  K extends keyof ProblemToAnswerType = keyof ProblemToAnswerType
> = {
  [P in K]: { type: P } & {
    answer: ProblemToAnswerType[P];
  } & AnswerSpecificProblemType[P];
}[K];

export type ProblemType = ProblemMapTypeToAnswerType & {
  id: string;
  topics: string[];
  title: string;
  statement: string;
  solved?: number;
  views?: number;
};

export interface ProblemMandatoryAnswerType {}

export type ProblemWithoutIdType = Omit<ProblemType, "id" | "type" | "answer"> &
  ProblemMapTypeToAnswerType;
