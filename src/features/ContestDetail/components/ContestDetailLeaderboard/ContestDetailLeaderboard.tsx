import { useMemo } from "react";
import clsx from "clsx";
import { Paragraph } from "@/components";
import { ContestDatabaseType, ContestParticipantType } from "@/types";

interface ContestLeaderboardProps {
  contest: ContestDatabaseType;
  userSubmissions: ContestParticipantType[];
  loading?: boolean;
}

export function ContestLeaderboard({
  contest,
  userSubmissions,
  loading,
}: ContestLeaderboardProps) {
  const { problemsData: problems = [], endDate } = contest;

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
          {answers.map(
            ({
              problemId,
              score = 0,
              attempts,
              unofficialCount = 0,
              unofficialScore = 0,
            }) => {
              const officialCount = attempts.length - unofficialCount;

              const displayScore = unofficialScore ?? score;

              return (
                <td
                  className={clsx(
                    "text-center",
                    score === 0 &&
                      (unofficialCount || unofficialScore) &&
                      "opacity-30",
                    displayScore > 0
                      ? "bg-success-200 text-success-700"
                      : displayScore < 0 &&
                          (officialCount || unofficialCount) &&
                          "bg-danger-200 text-danger-700"
                  )}
                  key={problemId}
                >
                  <Paragraph color="inherit">{displayScore}</Paragraph>
                </td>
              );
            }
          )}
          <td className="text-center">
            <Paragraph>{totalScore}</Paragraph>
          </td>
        </tr>
      )),
    [userSubmissions]
  );

  return (
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
  );
}
