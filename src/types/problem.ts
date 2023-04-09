import { PROBLEM_TOPICS_RELATIONSHIP_OBJECT } from "@/consts";

export type ProblemTopicNameType = "calculus" | "linear-algebra";

export type ProblemSubtopicNameType =
  | "limits"
  | "derivatives"
  | "applications-of-derivative"
  | "integral"
  | "first-order-differential-equations"
  | "vectors"
  | "lines-planes"
  | "eigenvalues-eigenvectors";

export type ProblemAllTopicNameType =
  | ProblemTopicNameType
  | ProblemSubtopicNameType;

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

export type ProblemTopicSpecificType<K extends ProblemTopicNameType> =
  (typeof PROBLEM_TOPICS_RELATIONSHIP_OBJECT)[K][number];

type ProblemMapTypeTopicType<
  K extends ProblemTopicNameType = ProblemTopicNameType
> = {
  [P in K]: { topic: P } & {
    subtopic: ProblemTopicSpecificType<P>;
  };
}[K];

export type ProblemType = ProblemMapTypeToAnswerType &
  ProblemMapTypeTopicType & {
    id: string;
    title: string;
    statement: string;
    solved?: number;
    views?: number;
  };

export interface ProblemMandatoryAnswerType {}

export type ProblemWithoutIdType = Omit<ProblemType, "id" | "type" | "answer"> &
  ProblemMapTypeToAnswerType &
  ProblemMapTypeTopicType;

export interface ProblemTopicType {
  name: string;
}

export interface ProblemMainTopicType extends ProblemTopicType {
  subtopics: ProblemTopicType[];
}
