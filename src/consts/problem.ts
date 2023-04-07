import {
  ProblemAllTopicNameType,
  ProblemMainTopicType,
  ProblemToAnswerType,
  ProblemTopicType,
} from "@/types";

export const PROBLEM_ANSWER_DEFAULT_VALUES: ProblemToAnswerType = {
  matrix: [[0]],
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
    name: "Lines and PLanes",
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
