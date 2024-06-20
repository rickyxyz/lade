import { ContestType } from "@/types";

export const CONTEST_DEFAULT: ContestType = {
  id: "",
  description: "",
  title: "",
  topicId: "calculus",
  subTopicId: "derivatives",
  problems: "[]",
  authorId: "",
  startAt: new Date().getTime(),
  endAt: (() => {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    return date;
  })().getTime(),
};

export const CONTEST_MAX_PROBLEMS = 10;
export const CONTEST_MIN_PROBLEMS = 3;
export const CONTEST_MAX_DESCRIPTION_LENGTH = 1024;
export const CONTEST_MIN_DESCRIPTION_LENGTH = 0;
export const CONTEST_MAX_TITLE_LENGTH = 64;
export const CONTEST_MIN_TITLE_LENGTH = 4;

export const CONTEST_TAB = [
  "description",
  "edit",
  "problems",
  "leaderboard",
] as const;
