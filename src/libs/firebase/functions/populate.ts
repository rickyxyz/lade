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
    const date = new Date();

    const seed = Math.ceil(1 / (Math.pow(Math.random(), 2) + 0.01));

    date.setDate(seed % 27);
    date.setMonth(date.getMonth() - 1);

    await crudData("set_problem", {
      data: {
        ...problem,
        solved: Math.floor(seed / 2 - seed / 3),
        views: seed,
      },
    });
  }

  return;
}
