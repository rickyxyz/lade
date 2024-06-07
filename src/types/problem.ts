import {
  PROBLEM_SORT_CRITERIA,
  PROBLEM_TOPICS_RELATIONSHIP_OBJECT,
} from "@/consts";
import { SelectOptionType } from "./component";

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

export type ProblemTopicLinkType = Record<string, ProblemTopicType[]>;

export interface ProblemTopicType {
  id?: string;
  name: string;
  topicId?: string;
}

export interface ProblemMainTopicType extends ProblemTopicType {
  subtopics: ProblemTopicType[];
}

export type MapProblemTypeToAnswerType = {
  short_answer: string | number;
  matrix: (string | number)[][];
};

export interface AnswerObjectType {
  short_answer: {
    content: string | number;
  };
  matrix: {
    content: (string | number)[][];
    matrixWidth: number;
    matrixHeight: number;
  };
}

export type AnswerType<X extends keyof AnswerObjectType> = AnswerObjectType[X];

export type ProblemAnswerType = keyof AnswerObjectType;

export type ProblemSubtopicMapType<K extends ProblemTopicNameType> =
  (typeof PROBLEM_TOPICS_RELATIONSHIP_OBJECT)[K][number];

export type ProblemMapTypeTopicType<
  K extends ProblemTopicNameType = ProblemTopicNameType
> = {
  [P in K]: { topicId: P } & {
    subTopicId: ProblemSubtopicMapType<P>;
  };
}[K];

export interface ProblemBaseType {
  id: string;
  title: string;
  description: string;
  solveds?: unknown[];
  views?: number;
  createdAt?: Date;
  updateAt?: Date;
  authorId: string;
  type: ProblemAnswerType;
  answer: string;
  topic?: ProblemTopicType;
  subTopic?: ProblemTopicType;
}

export type ProblemType = ProblemBaseType & ProblemMapTypeTopicType;

export type ProblemContestType = {
  problem: ProblemType;
  score: number;
  order: number;
};

export type ProblemSortByType = (typeof PROBLEM_SORT_CRITERIA)[number];

export type ProblemSortOptionType<K = string> = SelectOptionType<K> & {
  key: keyof ProblemType;
  descending?: boolean;
};

export type SolvedMapType = Record<string, string>;

export interface SolvedType {
  id: number;
  createdAt: Date;
  problemId: string;
  answer: string;
}
export interface SolvedPublicType {
  id: number;
  createdAt: Date;
  problemId: string;
  problem: {
    title: string;
    topicId: string;
    subTopicId: string;
    topic: string;
    subTopic: string;
  };
}
export type ProblemDatabaseType = ProblemType & {
  topic?: ProblemTopicType;
  subTopic?: ProblemTopicType;
};

export type ProblemMainTabType = "problem" | "discussion";

export interface ProblemQuery {
  search?: string;
  topic?: ProblemTopicNameType;
  subTopic?: ProblemSubtopicNameType;
  sort?: ProblemSortByType;
  page?: number;
}
