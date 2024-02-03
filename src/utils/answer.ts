/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AnswerType,
  MapProblemTypeToAnswerType,
  ProblemAnswerType,
} from "@/types";

function validateMatrix(correct: any, input: any) {
  const castedCorrect = correct as AnswerType<"matrix">;
  const castedInput = input as AnswerType<"matrix">;

  if (
    castedInput.matrixWidth !== castedCorrect.matrixWidth ||
    castedInput.matrixHeight !== castedCorrect.matrixHeight
  )
    return false;

  const mCorrect = castedCorrect.content;
  const mInput = castedInput.content;

  return !mCorrect.some((column: any[], j: number) =>
    column.some((cell, i) => String(cell) !== String(mInput[j][i]))
  );
}

export function validateAnswer(
  type: ProblemAnswerType,
  correct: any,
  input: any,
  parseJson?: boolean
) {
  if (parseJson) {
    correct = JSON.parse(correct);
    input = JSON.parse(input);
  }

  switch (type) {
    case "matrix":
      return validateMatrix(correct, input);
    case "short_answer":
      return String(input.content) === String(correct.content);
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
