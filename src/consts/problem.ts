import {
  ProblemAllTopicNameType,
  ProblemTopicType,
  SelectOptionType,
  ProblemAnswerType,
  ProblemTopicNameType,
  ProblemSubtopicNameType,
  ProblemSortByType,
  ProblemSortOptionType,
  ProblemType,
  AnswerObjectType,
} from "@/types";
import { makeAnswer } from "@/utils";

export const PROBLEM_BLANK: ProblemType = {
  id: "",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a sem arcu. Nam nec consectetur nulla.",
  title: "",
  topicId: "calculus",
  subTopicId: "derivatives",
  type: "short_answer",
  answer: "",
  authorId: "",
  ...makeAnswer("short_answer", {
    content: "123",
  }),
};

export const PROBLEM_DEFAULT: ProblemType = {
  ...PROBLEM_BLANK,
  createdAt: new Date(),
  solveds: [],
};

export const PROBLEM_ANSWER_DEFAULT_VALUES: AnswerObjectType = {
  matrix: {
    content: Array.from({ length: 3 }).map(() =>
      Array.from({ length: 3 }).map(() => "")
    ),
    matrixHeight: 0,
    matrixWidth: 0,
  },
  short_answer: {
    content: "",
  },
};

export const PROBLEM_TOPICS_DETAIL_OBJECT: Record<
  ProblemAllTopicNameType,
  ProblemTopicType
> = {
  "applications-of-derivative": {
    name: "Applications of Derivative",
  },
  calculus: {
    name: "Calculus",
  },
  "linear-algebra": {
    name: "Linear Algebra",
  },
  limits: {
    name: "Limits",
  },
  derivatives: {
    name: "Derivatives",
  },
  integral: {
    name: "Integral",
  },
  "first-order-differential-equations": {
    name: "First Order Differential Equations",
  },
  vectors: {
    name: "Vectors",
  },
  "lines-planes": {
    name: "Lines and Planes",
  },
  "eigenvalues-eigenvectors": {
    name: "Eigenvalues and Eigenvectors",
  },
};

export const PROBLEM_TOPICS_RELATIONSHIP_OBJECT = {
  calculus: [
    "limits",
    "derivatives",
    "applications-of-derivative",
    "integral",
    "first-order-differential-equations",
  ],
  "linear-algebra": ["vectors", "lines-planes", "eigenvalues-eigenvectors"],
} as const;

export const PROBLEM_ANSWER_TYPE_OPTIONS: SelectOptionType<ProblemAnswerType>[] =
  [
    { id: "short_answer", text: "Short Answer" },
    { id: "matrix", text: "Matrix" },
  ];

export const PROBLEM_TOPIC_OPTIONS: SelectOptionType<ProblemTopicNameType>[] = [
  { id: "calculus", text: "Calculus" },
  { id: "linear-algebra", text: "Linear Algebra" },
];

export const PROBLEM_SUBTOPIC_OPTIONS = Object.entries(
  PROBLEM_TOPICS_RELATIONSHIP_OBJECT
).reduce(
  (prev, [key, value]) => ({
    ...prev,
    [key]: value.map((subtopic) => ({
      id: subtopic,
      text: PROBLEM_TOPICS_DETAIL_OBJECT[subtopic].name,
    })),
  }),
  {}
) as Record<ProblemTopicNameType, SelectOptionType<ProblemSubtopicNameType>[]>;

export const PROBLEM_SORT_BY_OPTIONS: ProblemSortOptionType<ProblemSortByType>[] =
  [
    { id: "newest", text: "Newest", key: "createdAt", descending: true },
    { id: "oldest", text: "Oldest", key: "createdAt", descending: false },
    {
      id: "most-solved",
      text: "Most Solved",
      key: "solveds",
      descending: true,
    },
    {
      id: "least-solved",
      text: "Least Solved",
      key: "solveds",
      descending: false,
    },
  ];

export const PROBLEM_PAGINATION_COUNT = 6;
export const PROBLEM_CREATE_SIMULTANEOUS_COUNT = 5;
export const PROBLEM_MAX_DESCRIPTION_LENGTH = 1024;
export const PROBLEM_MIN_DESCRIPTION_LENGTH = 8;
export const PROBLEM_MAX_TITLE_LENGTH = 64;
export const PROBLEM_MIN_TITLE_LENGTH = 4;

export const PROBLEM_SORT_CRITERIA = [
  "least-solved",
  "oldest",
  "most-solved",
  "newest",
];
