/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useCallback, useState, useEffect } from "react";
import { API } from "@/api";
import {
  UserType,
  ProblemContestType,
  ContestDatabaseType,
  ContestSubmissionType,
} from "@/types";
import { ContestDetailProblemsProblemCard } from "../components";
import { useContestAnswerSubmit } from "../hooks";

interface ContestProps {
  contest: ContestDatabaseType;
  problems: ProblemContestType[];
  userSubmissions?: ContestSubmissionType;
  user?: UserType | null;
}

export function ContestProblemsPage({
  contest,
  problems,
  userSubmissions,
  user,
}: ContestProps) {
  const { cooldown, answerLoading, handleCheckAnswer } = useContestAnswerSubmit(
    {
      contest,
    }
  );

  const renderListProblems = useMemo(() => {
    return (
      <div className="flex-1 grid grid-cols-1 gap-8">
        {problems.map((p) => {
          const submission = (() => {
            if (!user || !userSubmissions) return undefined;

            return userSubmissions[user.id]
              ? userSubmissions[user.id][p.problem.id]
              : undefined;
          })();

          return (
            <ContestDetailProblemsProblemCard
              key={p.problem.id}
              problem={p.problem}
              onSubmit={handleCheckAnswer}
              cooldown={cooldown}
              loading={answerLoading === p.problem.id}
              submission={submission}
            />
          );
        })}
      </div>
    );
  }, [
    answerLoading,
    cooldown,
    handleCheckAnswer,
    problems,
    user,
    userSubmissions,
  ]);

  return renderListProblems;
}
