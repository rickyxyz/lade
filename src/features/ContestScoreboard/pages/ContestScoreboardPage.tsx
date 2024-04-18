/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { API } from "@/api";
import { ProblemCardSkeleton } from "@/features/ProblemList";
import { ButtonListEntry, Card, Paragraph } from "@/components";
import {
  ContestType,
  UserType,
  ProblemContestType,
  ContentAccessType,
  ContestDatabaseType,
} from "@/types";
import { CONTEST_DEFAULT } from "@/consts";
import { PageTemplate } from "@/templates";
import { useListenContestSubmission } from "../../ContestProblems/hooks";
import clsx from "clsx";

interface ContestProps {
  contestId: string;
  user?: UserType | null;
}

export function ContestScoreboardPage({ contestId, user }: ContestProps) {
  const stateContest = useState<ContestType>(
    CONTEST_DEFAULT as unknown as ContestType
  );
  const stateProblems = useState<ProblemContestType[]>([]);
  const [problems, setProblems] = stateProblems;
  const [contest, setContest] = stateContest;
  const { title } = contest;

  const stateLoading = useState(true);
  const [loading, setLoading] = stateLoading;

  const [cooldownIntv, setCooldownIntv] = useState<NodeJS.Timer>();
  const [cooldown, setCooldown] = useState(0);
  const [submitted, setSubmitted] = useState(0);

  const stateAnswerLoading = useState<string | null>();
  const [answerLoading, setAnswerLoading] = stateAnswerLoading;

  const router = useRouter();

  const { userSubmissions } = useListenContestSubmission(
    contest as unknown as ContestDatabaseType
  );

  const handleGetContests = useCallback(async () => {
    if (!loading) return;

    setLoading(true);

    await API("get_contest", {
      params: {
        id: contestId,
      },
    })
      .then(({ data }) => {
        if (!data) throw Error("");

        const { id } = data;
        setContest(data as any);
        setProblems(
          data.problemsData.sort((pd1, pd2) => pd1.order - pd2.order)
        );
        setLoading(false);

        return id;
      })
      .catch(() => null);
  }, [loading, setLoading, contestId, setContest, setProblems]);

  useEffect(() => {
    handleGetContests();
  }, [handleGetContests]);

  const renderUserSubmission = useMemo(
    () =>
      userSubmissions.map(({ userId, totalScore, answers }, index) => (
        <tr key={userId} className="border-t border-secondary-300">
          <td className="text-center">
            <Paragraph>{index + 1}</Paragraph>
          </td>
          <td>
            <Paragraph>{userId}</Paragraph>
          </td>
          {answers.map(({ problemId, finalScore = 0, attempts }) => {
            return (
              <td
                className={clsx(
                  "text-center",
                  finalScore > 0
                    ? "bg-success-200"
                    : attempts > 0
                    ? "bg-danger-200"
                    : ""
                )}
                key={problemId}
              >
                <Paragraph>{finalScore}</Paragraph>
              </td>
            );
          })}
          <td className="text-center">
            <Paragraph>{totalScore}</Paragraph>
          </td>
        </tr>
      )),
    [userSubmissions]
  );

  return (
    <PageTemplate title={title} className="w-full">
      <Card>
        <div className="relative flex flex-row flex-wrap gap-8">
          <div className="table-container w-full">
            <table className="table table-auto w-full">
              <thead>
                <tr className="font-bold">
                  <th className="!text-center">
                    <Paragraph weight="inherit">Rank</Paragraph>
                  </th>
                  <th>
                    <Paragraph weight="inherit">User</Paragraph>
                  </th>
                  {problems.map(({ problem }, idx) => (
                    <th className="!text-center" key={problem.id}>
                      <Paragraph weight="inherit">
                        {String.fromCharCode(65 + idx)}
                      </Paragraph>
                    </th>
                  ))}
                  <th className="!text-center">
                    <Paragraph weight="inherit">Score</Paragraph>
                  </th>
                </tr>
              </thead>
              <tbody>{renderUserSubmission}</tbody>
            </table>
          </div>
        </div>
      </Card>
    </PageTemplate>
  );
}
