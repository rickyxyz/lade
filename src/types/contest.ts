import { CONTEST_TAB } from "@/consts";
import {
  ProblemContestType,
  ProblemMapTypeTopicType,
  ProblemTopicType,
} from "./problem";

export interface ContestBaseType {
  title: string;
  description: string;
  problems: string;
  participants?: number;
  views?: number;
  createdAt?: number;
  updatedAt?: number;
  startDate: number;
  endDate: number;
  authorId: string;
}

export type ContestType = ContestBaseType &
  ProblemMapTypeTopicType & {
    id: string;
  };

export type ContestStatusType = "waiting" | "ongoing" | "closed";

export type ContestDatabaseType = Omit<ContestType, "id" | "problems"> & {
  id: string | number;
  toProblems?: ProblemContestType[];
  _count?: {
    toProblems: number;
  };
  problemsData: ProblemContestType[];
  problems: number;
  topic: ProblemTopicType;
  subTopic: ProblemTopicType;
  status: ContestStatusType;
};

export type ContestBlankType = {
  [P in keyof ContestBaseType]: string;
};

export type ContestMainTabType = "contest" | "result" | "discussion";

export interface ContestSingleSubmissionType {
  problemId?: string;
  attempts: number;
  score: number;
  answer: string;
  submittedAt?: number;
  finalScore?: number;
}

export interface ContestSubmissionType {
  [key1: string]: {
    [key2: string]: ContestSingleSubmissionType;
  };
}

export interface ContestParticipantType {
  userId: string;
  totalScore: number;
  answers: ContestSingleSubmissionType[];
}

export interface ContestQuery {
  tab: ContestTabType;
}

export type ContestTabType = (typeof CONTEST_TAB)[number];
