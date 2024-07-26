import {
  AnswerType,
  ContestQuery,
  ContestType,
  ProblemAnswerType,
  ProblemQuery,
  ProblemType,
} from "@/types";
import {
  CONTEST_MAX_DESCRIPTION_LENGTH,
  CONTEST_MAX_PROBLEMS,
  CONTEST_MAX_TITLE_LENGTH,
  CONTEST_MIN_DESCRIPTION_LENGTH,
  CONTEST_MIN_PROBLEMS,
  CONTEST_MIN_TITLE_LENGTH,
  CONTEST_TAB,
  PROBLEM_MAX_DESCRIPTION_LENGTH,
  PROBLEM_MAX_TITLE_LENGTH,
  PROBLEM_MIN_DESCRIPTION_LENGTH,
  PROBLEM_MIN_TITLE_LENGTH,
  PROBLEM_SORT_CRITERIA,
} from "@/consts";

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
  } else if (title.length < PROBLEM_MIN_TITLE_LENGTH) {
    return "Title is too short.";
  } else if (title.length > PROBLEM_MAX_TITLE_LENGTH) {
    return "Title is too long.";
  }
  return null;
}

export function validateProblemdescription(description: string) {
  if (description === "") {
    return "Problem description is required.";
  } else if (description.length < PROBLEM_MIN_DESCRIPTION_LENGTH) {
    return "Problem description is too short.";
  } else if (description.length > PROBLEM_MAX_DESCRIPTION_LENGTH) {
    return "Problem description is too long.";
  }
  return null;
}

export function validateFormProblem(problem: ProblemType) {
  const { title, description, answer, type } = problem;

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
  validateColumn(description, "description", validateProblemdescription);
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
  const { title, description, startAt, endAt } = contest;

  const errors: Partial<Record<keyof ContestType, string>> = {};

  if (title === "") {
    errors.title = "Title must not be empty.";
  } else if (title.length < CONTEST_MIN_TITLE_LENGTH) {
    errors.title = "Title is too short.";
  } else if (title.length > CONTEST_MAX_TITLE_LENGTH) {
    errors.title = "Title is too long.";
  }

  if (description === "") {
    errors.description = "Description is required.";
  } else if (description.length < CONTEST_MIN_DESCRIPTION_LENGTH) {
    errors.description = "Description is too short.";
  } else if (description.length > CONTEST_MAX_DESCRIPTION_LENGTH) {
    errors.description = "Description is too long.";
  }

  if (startAt && endAt && startAt > endAt)
    errors.endAt = "End date cannot be earlier than start date.";

  const problems = JSON.parse((contest.problems ?? "{}") as unknown as string);
  console.log(problems);

  const count = Object.keys(problems).length;

  if (count < CONTEST_MIN_PROBLEMS)
    errors.problems = `Contest cannot have less than ${CONTEST_MIN_PROBLEMS} problems.`;
  else if (count > CONTEST_MAX_PROBLEMS)
    errors.problems = `Contest cannot have more than ${CONTEST_MAX_PROBLEMS} problems`;

  console.log(errors);
  return errors;
}

export function validateProblemQuery(query: unknown): ProblemQuery {
  let { page = 1, sort = "newest" } = query as ProblemQuery;
  page = isNaN(page) ? 1 : page;
  if (!PROBLEM_SORT_CRITERIA.includes(sort)) sort = "newest";

  return {
    ...(query as ProblemQuery),
    page,
    sort,
  };
}

// export function validateContestQuery({ tab }: ContestQuery): ContestQuery {
//   const validTabs = CONTEST_TAB.filter((t) => t !== "edit");
//   return validTabs.includes(tab) ? { tab } : { tab: "description" };
// }
