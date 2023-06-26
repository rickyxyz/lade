import {
  ProblemAnswerType,
  ProblemBlankType,
  ProblemDatabaseType,
  ProblemWithoutIdType,
} from "@/types";
import { parseMatrixSize } from "./matrix";

export function validateFormProblem(problem: ProblemWithoutIdType) {
  const { title, statement, answer, topic, subtopic, type } =
    problem as unknown as ProblemBlankType;

  const errors: Partial<Record<keyof ProblemWithoutIdType, string>> = {};

  if (title === "") {
    errors.title = "Title must not be empty.";
  } else if (title.length < 3) {
    errors.title = "Title is too short.";
  } else if (title.length > 24) {
    errors.title = "Title is too long.";
  }

  if (statement === "") {
    errors.statement = "Problem statement is required.";
  } else if (statement.length < 3) {
    errors.statement = "Problem statement is too short.";
  } else if (title.length > 200) {
    errors.statement = "Problem statement is too long.";
  }

  if (type === "") errors.type = "Type is required!";
  if (topic === "") errors.topic = "Topic is required!";
  if (subtopic === "") errors.subtopic = "Subtopic is required!";

  const answerError = validateFormAnswer({
    type: type as ProblemAnswerType,
    answer,
  });

  if (answerError) errors.answer = answerError;

  return errors;
}

export function validateFormAnswer(problem: Partial<ProblemDatabaseType>) {
  console.log(problem.answer);
  if (
    problem.type === "short_answer" &&
    (problem.answer === undefined || String(problem.answer) === "")
  ) {
    return "Answer must not be empty.";
  }
  if (problem.type === "matrix" && problem.answer) {
    try {
      const sizes = parseMatrixSize(JSON.parse(problem.answer));
      if (sizes[0] === 0 && sizes[1] === 0) {
        return "Answer must not be empty.";
      }
    } catch (e) {
      return "Invalid Format";
    }
  }
}
