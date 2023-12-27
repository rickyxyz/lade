import {
  AnswerType,
  ContestBlankType,
  ContestDatabaseType,
  ProblemAnswerType,
  ProblemType,
} from "@/types";
import { parseMatrixSize } from "./matrix";

export function validateFormProblem(problem: ProblemType) {
  const { title, statement, answer, type } = problem;

  const errors: Partial<Record<keyof ProblemType, string>> = {};

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

  // if (type === "") errors.type = "Type is required!";
  // if (topic === "") errors.topic = "Topic is required!";
  // if (subtopic === "") errors.subtopic = "Subtopic is required!";

  const answerError = validateFormAnswer({
    type: type as ProblemAnswerType,
    answer,
  });

  if (answerError) errors.answer = answerError;

  return errors;
}

export function validateShortAnswer(answer: unknown) {
  const { content } = answer as AnswerType<"short_answer">;
  if (String(content) == "") return "Answer must not be empty";
}

export function validateMatrix(answer: unknown) {
  const { matrixHeight, matrixWidth } = answer as AnswerType<"matrix">;
  try {
    if (matrixHeight === 0 || matrixWidth === 0) {
      return "Answer must not be empty.";
    }
  } catch (e) {
    return "Invalid format.";
  }
}

export function validateFormAnswer(problem: Partial<ProblemType>) {
  const { type, answer } = problem;

  if (!answer) return "Answer must not be empty.";

  switch (type) {
    case "matrix":
      return validateMatrix(answer);
    case "short_answer":
      return validateShortAnswer(answer);
  }
}

export function validateFormContest(contest: ContestDatabaseType) {
  const { title, description, startDate, endDate } =
    contest as unknown as ContestBlankType;

  const errors: Partial<Record<keyof ContestDatabaseType, string>> = {};

  if (title === "") {
    errors.title = "Title must not be empty.";
  } else if (title.length < 3) {
    errors.title = "Title is too short.";
  } else if (title.length > 24) {
    errors.title = "Title is too long.";
  }

  if (description === "") {
    errors.description = "Description is required.";
  } else if (description.length < 3) {
    errors.description = "Description is too short.";
  } else if (title.length > 200) {
    errors.description = "Description is too long.";
  }

  if (startDate && endDate && startDate > endDate)
    errors.endDate = "End date cannot be earlier than start date.";

  return errors;
}
