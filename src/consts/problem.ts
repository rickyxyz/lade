import {
  ProblemAllTopicNameType,
  MapProblemTypeToAnswerType,
  ProblemTopicType,
  ProblemWithoutIdType,
  SelectOptionType,
  ProblemAnswerType,
  ProblemTopicNameType,
  ProblemSubtopicNameType,
  ProblemSortByType,
  ProblemSortOptionType,
  ProblemBlankType,
} from "@/types";

export const PROBLEM_DEFAULT: ProblemWithoutIdType = {
  statement: "1 + 1 = ?",
  title: "Problem Statement",
  topic: "calculus",
  subtopic: "derivatives",
  type: "short_answer",
  answer: "2",
  postDate: 0,
  solved: 0,
  views: 0,
};

export const PROBLEM_BLANK: ProblemBlankType = {
  statement: "",
  title: "",
  topic: "",
  subtopic: "",
  type: "",
  answer: "",
};

export const PROBLEM_ANSWER_DEFAULT_VALUES: MapProblemTypeToAnswerType = {
  matrix: Array.from({ length: 3 }).map(() =>
    Array.from({ length: 3 }).map(() => "")
  ),
  short_answer: "",
  true_or_false: [false],
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
    { id: "newest", text: "Newest", key: "postDate", descending: true },
    { id: "oldest", text: "Oldest", key: "postDate", descending: false },
    {
      id: "most-solved",
      text: "Most Solved",
      key: "solved",
      descending: true,
    },
    {
      id: "least-solved",
      text: "Least Solved",
      key: "solved",
      descending: false,
    },
    { id: "most-viewed", text: "Most Viewed", key: "views", descending: true },
    {
      id: "least-viewed",
      text: "Least Viewed",
      key: "views",
      descending: false,
    },
  ];
