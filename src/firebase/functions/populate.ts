import {
  PROBLEM_SAMPLE_1,
  PROBLEM_SAMPLE_2,
  PROBLEM_SAMPLE_3,
  PROBLEM_SAMPLE_4,
} from "../placeholders";
import { crudData } from "./getterSetter";

export async function populateProblems() {
  const sampleProblems = [
    PROBLEM_SAMPLE_1,
    PROBLEM_SAMPLE_2,
    PROBLEM_SAMPLE_3,
    PROBLEM_SAMPLE_4,
  ];

  for (const problem of sampleProblems) {
    await crudData("set_problem", {
      problem,
    });
  }

  return;
}
