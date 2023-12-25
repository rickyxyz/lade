/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnswerType, ProblemAnswerType } from "@/types";

export function validateAnswer(
  type: ProblemAnswerType,
  correct: any,
  input: any
) {
  switch (type) {
    case "matrix":
      // eslint-disable-next-line no-case-declarations
      return !correct.some((column: any[], j: string | number) =>
        column.some((cell, i) => String(cell) !== input[j][i])
      );
    case "short_answer":
      return String(input) === String(correct);
  }
  return false;
}

export function makeAnswer<X extends ProblemAnswerType>(
  type: X,
  answer: AnswerType<X>
): any {
  return {
    type,
    answer: JSON.stringify(answer),
  };
}

export function parseAnswer<X extends ProblemAnswerType>(
  _: X,
  answer: unknown
): any {
  if (!answer || typeof answer !== "string") return null;

  return JSON.parse(answer) as AnswerType<X>;
}
