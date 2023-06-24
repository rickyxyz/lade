import { PROBLEM_TOPICS_RELATIONSHIP_OBJECT } from "@/consts";
import { SelectOptionType } from "./select";

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

export interface ProblemTopicType {
  name: string;
}

export interface ProblemMainTopicType extends ProblemTopicType {
  subtopics: ProblemTopicType[];
}

export type MapProblemTypeToAnswerType = {
  short_answer: string | number;
  matrix: (string | number)[][];
  true_or_false: boolean[];
};

export type TestType<X extends keyof MapProblemTypeToAnswerType> =
  MapProblemTypeToAnswerType[X];

export interface MapProblemTypeToTypeSpecificParams {
  short_answer: unknown;
  matrix: {
    matrixWidth: number;
    matrixHeight: number;
  };
  true_or_false: unknown;
}

export type ProblemAnswerType = keyof MapProblemTypeToAnswerType;

type ProblemAnswerTypeMap<
  K extends keyof MapProblemTypeToAnswerType = keyof MapProblemTypeToAnswerType
> = {
  [P in K]: { type: P } & {
    answer: MapProblemTypeToAnswerType[P];
  };
}[K];

type ProblemExtraParamsMapType<
  K extends keyof MapProblemTypeToAnswerType = keyof MapProblemTypeToAnswerType
> = {
  [P in K]: { type: P } & MapProblemTypeToTypeSpecificParams[P];
}[K];

export type ProblemSubtopicMapType<K extends ProblemTopicNameType> =
  (typeof PROBLEM_TOPICS_RELATIONSHIP_OBJECT)[K][number];

type ProblemMapTypeTopicType<
  K extends ProblemTopicNameType = ProblemTopicNameType
> = {
  [P in K]: { topic: P } & {
    subtopic: ProblemSubtopicMapType<P>;
  };
}[K];

export interface ProblemBaseType {
  title: string;
  statement: string;
  solved?: number;
  views?: number;
  postDate?: number;
  updateDate?: number;
  authorId?: string;
}

export type ProblemType = ProblemBaseType &
  ProblemAnswerTypeMap &
  ProblemExtraParamsMapType &
  ProblemMapTypeTopicType & {
    id: string;
  };

export type ProblemDatabaseType = ProblemBaseType &
  ProblemExtraParamsMapType &
  ProblemMapTypeTopicType & {
    id?: string;
    answer: string;
  };

export type ProblemWithoutIdType = Omit<ProblemType, "id">;

export type ProblemSortByType =
  | "least-solved"
  | "least-viewed"
  | "oldest"
  | "most-solved"
  | "most-viewed"
  | "newest";

export type ProblemSortOptionType<K = string> = SelectOptionType<K> & {
  key: keyof ProblemType;
  descending?: boolean;
};

export type ProblemBlankType = {
  [P in keyof ProblemWithoutIdType]: string;
};
