import {
  ProblemAllTopicNameType,
  ProblemMainTopicType,
  MapProblemTypeToAnswerType,
  ProblemTopicType,
  ProblemType,
  ProblemWithoutIdType,
} from "@/types";

export const PROBLEM_DEFAULT: ProblemWithoutIdType = {
  statement: "1 + 1 = ?",
  title: "Problem Statement",
  topic: "calculus",
  subtopic: "derivatives",
  type: "short_answer",
  answer: "2",
};

export const PROBLEM_ANSWER_DEFAULT_VALUES: MapProblemTypeToAnswerType = {
  matrix: Array.from({ length: 3 }).map((_) =>
    Array.from({ length: 3 }).map((_) => "")
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
