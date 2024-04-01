import {
  AnswerType,
  ContestBaseType,
  ContestBlankType,
  ContestType,
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
  } else if (statement.length > 512) {
    return "Problem statement is too long.";
  }
  return null;
}

export function validateFormProblem(problem: ProblemType) {
  const { title, statement, answer, type } = problem;

  const errors: Partial<Record<keyof ProblemType, string>> = {};

  function validateColumn<S>(
    value: S,
    column: keyof ProblemType,
    validator: (value: S) => string | null
  ) {
    const error = validator(value);
    if (error) errors[column] = error;
  }

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
    answer,
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
  const { type } = problem;

  const answer = problem.answer ? JSON.parse(problem.answer) : null;

  if (!answer) return "Answer must not be empty.";

  switch (type) {
    case "matrix":
      return validateMatrix(answer);
    case "short_answer":
      return validateShortAnswer(answer);
  }

  return "Answer must not be empty.";
}

export function validateFormContest(contest: ContestType) {
  const { title, description, startDate, endDate } = contest;

  const errors: Partial<Record<keyof ContestType, string>> = {};

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

  const problems = JSON.parse(contest.problems as unknown as string);
  console.log(problems);

  const count = Object.keys(problems).length;

  if (count < 3) errors.problems = "Contest cannot have less than 3 problems.";
  else if (count > 10)
    errors.problems = "Contest cannot have more than 10 problems";

  console.log(errors);
  return errors;
}
