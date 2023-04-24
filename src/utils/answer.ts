import { ProblemAnswerType, ProblemToAnswerType } from "@/types";

export function validateAnswer(
  type: ProblemAnswerType,
  correct: any,
  input: any
) {
  switch (type) {
    case "matrix":
      return !correct.some((column: any[], j: string | number) =>
        column.some((cell, i) => String(cell) !== input[j][i])
      );
    case "short_answer":
      return String(input) === String(correct);
  }
  return false;
}
