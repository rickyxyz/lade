import {
  AnswerType,
  ContestBlankType,
  ContestDatabaseType,
  ProblemAnswerType,
  ProblemType,
} from "@/types";
import { parseMatrixSize } from "./matrix";

export function validateProblemId(id: string) {
  const regex = new RegExp("^[a-z0-9_]*$");
  const lettersBetweenHypens =
    id.split("-").filter((words) => words.length === 0 || !regex.test(words))
      .length > 0;

  if (lettersBetweenHypens) {
    return "ID must be alphanumeric and lowercase.";
  } else if (id.length < 4) {
    return "ID is too short.";
  } else if (id.length > 24) {
    return "ID is too long.";
  }

  return null;
}

export function validateProblemTitle(title: string) {
  if (title === "") {
    return "Title must not be empty.";
  } else if (title.length < 3) {
    return "Title is too short.";
  } else if (title.length > 24) {
    return "Title is too long.";
  }
  return null;
}

export function validateProblemStatement(statement: string) {
  if (statement === "") {
    return "Problem statement is required.";
  } else if (statement.length < 3) {
    return "Problem statement is too short.";
  } else if (statement.length > 200) {
    return "Problem statement is too long.";
  }
  return null;
}

export function validateFormProblem(problem: ProblemType) {
  const { id, title, statement, answer, type } = problem;

  const errors: Partial<Record<keyof ProblemType, string>> = {};

  function validateColumn<S>(
    value: S,
    column: keyof ProblemType,
    validator: (value: S) => string | null
  ) {
    const error = validator(value);
    if (error) errors[column] = error;
  }

  validateColumn(id, "id", validateProblemId);
  validateColumn(title, "title", validateProblemTitle);
  validateColumn(statement, "statement", validateProblemStatement);
  validateColumn(
    {
      type: type as ProblemAnswerType,
      answer,
    },
    "answer",
    validateFormAnswer
  );

  // if (type === "") errors.type = "Type is required!";
  // if (topic === "") errors.topic = "Topic is required!";
  // if (subtopic === "") errors.subtopic = "Subtopic is required!";

  const answerError = validateFormAnswer({
    type: type as ProblemAnswerType,
    answer: JSON.parse(answer),
  });

  if (answerError) errors.answer = answerError;

  return errors;
}

export function validateShortAnswer(answer: unknown) {
  const { content } = answer as AnswerType<"short_answer">;
  if (String(content) == "") return "Answer must not be empty";
  return null;
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

  return null;
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

  return "Answer must not be empty.";
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
