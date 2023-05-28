/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProblemAnswerType } from "@/types";

export function validateAnswer(
  type: ProblemAnswerType,
  correct: any,
  input: any
) {
  switch (type) {
    case "matrix":
      // eslint-disable-next-line no-case-declarations
      const parsed = JSON.parse(correct);
      return !parsed.some((column: any[], j: string | number) =>
        column.some((cell, i) => String(cell) !== input[j][i])
      );
    case "short_answer":
      return String(input) === String(correct);
  }
  return false;
}
