/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useCallback, useState, useEffect } from "react";
import { API } from "@/api";
import {
  UserType,
  ProblemContestType,
  ContestDatabaseType,
  ContestSubmissionType,
} from "@/types";
import { ContestDetailProblemsProblemCard } from "../components/ContestDetailProblems";

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
  const { id } = contest;

  const [cooldownIntv, setCooldownIntv] = useState<NodeJS.Timer>();
  const [cooldown, setCooldown] = useState(0);
  const [submitted, setSubmitted] = useState(0);

  const stateAnswerLoading = useState<string | null>();
  const [answerLoading, setAnswerLoading] = stateAnswerLoading;

  const handleCheckAnswer = useCallback(
    async (problemId: string, answer: any) => {
      const now = new Date().getTime();

      if (submitted && now - submitted <= 1000 * 5) {
        setCooldown(Math.max(0, submitted + 1000 * 5 - now));
        return null;
      }

      setCooldown(1000 * 5);

      let verdict = false;
      setAnswerLoading(problemId);

      await API("post_contest_answer", {
        body: {
          contestId: String(id),
          problemId,
          answer,
        },
      })
        .then((res) => {
          console.log("Verdict ", res.data.message);
          if (res.data.message === "correct") {
            verdict = true;
          }
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setAnswerLoading(null);
        });

      if (!verdict) {
        if (cooldownIntv) clearInterval(cooldownIntv);

        setCooldown(10000);
        const interval = setInterval(() => {
          setCooldown((prev) => Math.max(0, prev - 100));
        }, 100);

        setSubmitted(now);

        setCooldownIntv(interval);
      } else {
        setCooldown(0);
      }
      return verdict;
    },
    [submitted, setAnswerLoading, id, cooldownIntv]
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
