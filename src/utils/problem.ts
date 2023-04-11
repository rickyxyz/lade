import { ProblemWithoutIdType } from "@/types";
import { parseMatrixSize } from "./matrix";

export function validateErrors(problem: ProblemWithoutIdType) {
  const { title, statement, answer } = problem;

  const newErrors: any = {};

  if (title === "") {
    newErrors.title = "Title must not be empty.";
  } else if (title.length < 3) {
    newErrors.title = "Title is too short.";
  } else if (title.length > 24) {
    newErrors.title = "Title is too long.";
  }

  if (statement.length < 3) {
    newErrors.statement = "Problem statement is too short.";
  } else if (title.length > 200) {
    newErrors.statement = "Problem statement is too long.";
  }

  if (problem.type === "short_answer" && answer === "") {
    newErrors.answer = "Answer must not be empty.";
  }
  if (problem.type === "matrix") {
    const sizes = parseMatrixSize(answer as any);
    if (sizes[0] === 0 && sizes[1] === 0) {
      newErrors.answer = "Answer must not be empty.";
    }
  }

  return newErrors;
}
