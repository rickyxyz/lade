/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MapProblemTypeToAnswerType,
  ProblemAnswerType,
  TestType,
} from "@/types";

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

export function constructAnswerString<X extends ProblemAnswerType>(
  type: X,
  answer: MapProblemTypeToAnswerType[X]
): string {
  switch (type) {
    case "short_answer":
      return typeof answer === "string" ? answer : String(answer);
    default:
      return JSON.stringify(answer);
  }
}

export function deconstructAnswerString<X extends ProblemAnswerType>(
  type: X,
  answer: unknown
): any {
  if (!answer) return "";
  console.log("Parsing: ", answer);
  // console.log(JSON.parse(`{"test": ${answer}}`));
  switch (type) {
    case "short_answer":
      return (
        typeof answer === "string" ? answer : String(answer)
      ) as MapProblemTypeToAnswerType["short_answer"];
    default:
      return JSON.parse(answer as string) as MapProblemTypeToAnswerType[X];
  }
}
