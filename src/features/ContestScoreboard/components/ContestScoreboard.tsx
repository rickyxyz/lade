import { Paragraph } from "@/components";
import { ContestDatabaseType, ContestParticipantType } from "@/types";
import clsx from "clsx";
import { useMemo } from "react";

interface ContestScoreboardProps {
  contest: ContestDatabaseType;
  userSubmissions: ContestParticipantType[];
}

export function ContestScoreboard({
  contest,
  userSubmissions,
}: ContestScoreboardProps) {
  const { problemsData: problems = [] } = contest;

  const renderUserSubmission = useMemo(
    () =>
      userSubmissions.map(
        ({ userId, finalScore: totalScore, answers }, index) => (
          <tr key={userId} className="border-t border-secondary-300">
            <td className="text-center">
              <Paragraph>{index + 1}</Paragraph>
            </td>
            <td>
              <Paragraph>{userId}</Paragraph>
            </td>
            {answers.map(
              (
                {
                  finalScore = 0,
                  unofficialScore = 0,
                  attempts,
                  unofficialCount,
                },
                index2
              ) => {
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
                    key={index2}
                  >
                    <Paragraph>{finalScore}</Paragraph>
                  </td>
                );
              }
            )}
            <td className="text-center">
              <Paragraph>{totalScore}</Paragraph>
            </td>
          </tr>
        )
      ),
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
