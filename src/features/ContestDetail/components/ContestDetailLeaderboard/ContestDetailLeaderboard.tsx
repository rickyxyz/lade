import { useMemo } from "react";
import clsx from "clsx";
import { Paragraph } from "@/components";
import { ContestDatabaseType, ContestParticipantType } from "@/types";
import { getFinalScore } from "../../utils";

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
          {answers.map((answer) => {
            const { displayScore, isOfficial, status } = getFinalScore(answer);

            return (
              <td
                className={clsx(
                  "text-center",
                  !isOfficial && "opacity-30",
                  status === "success"
                    ? "bg-success-200 text-success-700 font-bold"
                    : status === "attempted" &&
                        "bg-danger-200 text-danger-700 font-bold"
                )}
                key={`${answer.problemId}`}
              >
                <Paragraph color="inherit" weight="inherit">
                  {displayScore}
                </Paragraph>
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
