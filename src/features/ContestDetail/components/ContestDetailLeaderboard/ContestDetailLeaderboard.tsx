import { useMemo } from "react";
import clsx from "clsx";
import { Paragraph } from "@/components";
import { ContestDatabaseType, ContestParticipantType } from "@/types";
import { getFinalScore } from "../../utils";
import { getHMS } from "@/utils";

interface ContestLeaderboardProps {
  contest: ContestDatabaseType;
  userSubmissions: ContestParticipantType[];
  loading?: boolean;
}

export function ContestLeaderboard({
  contest,
  userSubmissions,
}: ContestLeaderboardProps) {
  const { problemsData: problems = [] } = contest;

  const renderUserSubmission = useMemo(
    () =>
      userSubmissions.map(
        ({ userId, totalScore, answers, totalPenalty }, index) => (
          <tr key={userId} className="border-t border-secondary-300">
            <td className="text-center">
              <Paragraph>{index + 1}</Paragraph>
            </td>
            <td>
              <Paragraph>{userId}</Paragraph>
            </td>
            <td className="text-center">
              <Paragraph>{totalScore}</Paragraph>
            </td>
            <td className="text-center">
              <Paragraph>{getHMS(totalPenalty)}</Paragraph>
            </td>
            {answers.map((answer) => {
              const { displayScore, isOfficial, status } =
                getFinalScore(answer);

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
          </tr>
        )
      ),
    [userSubmissions]
  );

  return (
    <div className="relative flex flex-row flex-wrap gap-8">
      <div className="relative table-container w-full overflow-x-scroll">
        <table className="table table-auto w-full">
          <thead>
            <tr>
              <th className="!text-center">
                <Paragraph weight="semibold">Rank</Paragraph>
              </th>
              <th className="!text-center">
                <Paragraph weight="semibold">User</Paragraph>
              </th>
              <th className="!text-center">
                <Paragraph weight="semibold">Score</Paragraph>
              </th>
              <th className="!text-center">
                <Paragraph weight="semibold">Penalty</Paragraph>
              </th>
              {problems.map(({ problem }, idx) => (
                <th className="!text-center" key={problem.id}>
                  <Paragraph weight="semibold">
                    {String.fromCharCode(65 + idx)}
                  </Paragraph>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{renderUserSubmission}</tbody>
        </table>
      </div>
    </div>
  );
}
