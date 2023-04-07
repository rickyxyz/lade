import {
  PROBLEM_SAMPLE_1,
  PROBLEM_SAMPLE_2,
  PROBLEM_SAMPLE_3,
  PROBLEM_SAMPLE_4,
  PROBLEM_SAMPLE_5,
  PROBLEM_SAMPLE_6,
  PROBLEM_SAMPLE_7,
} from "../placeholders";
import { crudData } from "./getterSetter";

export async function populateProblems() {
  const sampleProblems = [
    PROBLEM_SAMPLE_1,
    PROBLEM_SAMPLE_2,
    PROBLEM_SAMPLE_3,
    PROBLEM_SAMPLE_4,
    PROBLEM_SAMPLE_5,
    PROBLEM_SAMPLE_6,
    PROBLEM_SAMPLE_7,
  ];

  for (const problem of sampleProblems) {
    await crudData("set_problem", {
      problem,
    });
  }

  return;
}
