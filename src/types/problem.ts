export interface ProblemToAnswerType {
  short_answer: string | number;
  matrix: (string | number)[][];
  true_or_false: boolean[];
}

export type ProblemAnswerType = keyof ProblemToAnswerType;

type ProblemMapTypeToAnswerType<
  K extends keyof ProblemToAnswerType = keyof ProblemToAnswerType
> = { [P in K]: { type: P } & { answer: ProblemToAnswerType[P] } }[K];

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
