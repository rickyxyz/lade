import { PROBLEM_TOPICS_RELATIONSHIP_OBJECT } from "@/consts";
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

type ProblemMapTypeTopicType<
  K extends ProblemTopicNameType = ProblemTopicNameType
> = {
  [P in K]: { topicId: P } & {
    subTopicId: ProblemSubtopicMapType<P>;
  };
}[K];

export interface ProblemBaseType {
  id: number | string;
  title: string;
  statement: string;
  solveds?: unknown[];
  views?: number;
  createdAt?: Date;
  updateAt?: Date;
  authorId: string;
  type: ProblemAnswerType;
  topic?: ProblemTopicType;
  subTopic?: ProblemTopicType;
  answer: string;
}

export type ProblemType = ProblemBaseType & ProblemMapTypeTopicType;

export type ProblemSortByType =
  | "least-solved"
  | "oldest"
  | "most-solved"
  | "newest";

export type ProblemSortOptionType<K = string> = SelectOptionType<K> & {
  key: keyof ProblemType;
  descending?: boolean;
};

export type SolvedMapType = Record<string, string>;

export interface SolvedType {
  id: number;
  createdAt: Date;
  userId: string;
  problemId: string;
  answer: string;
}

export type ContentViewType = "view" | "edit";

export type ContentEditType = "create" | "edit";

export type ContentAccessType = "viewer" | "author" | "admin";

export interface ContestBaseType {
  title: string;
  description: string;
  problems: Record<string, number>;
  participants?: number;
  views?: number;
  createdAt?: number;
  updateDate?: number;
  startDate?: number;
  endDate?: number;
  authorId?: string;
}

export type ContestType = ContestBaseType &
  ProblemMapTypeTopicType & {
    id: string;
  };

export type ProblemDatabaseType = Omit<ProblemType, "id"> & {
  id?: string;
};

export type ContestDatabaseType = Omit<ContestType, "id"> & {
  id?: string;
};

export type ContestBlankType = {
  [P in keyof ContestDatabaseType]: string;
};

export type ProblemMainTabType = "problem" | "discussion";
