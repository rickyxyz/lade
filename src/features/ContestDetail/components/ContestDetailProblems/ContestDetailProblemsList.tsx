import { Fragment, useCallback, useMemo } from "react";
import clsx from "clsx";
import { Card, Paragraph } from "@/components";
import {
  ContestParticipantType,
  ContestSingleSubmissionType,
  ContestSubmissionType,
  ProblemContestType,
} from "@/types";
import { getFinalScore } from "../../utils";

export interface ContestDetailProblemsListProps {
  className?: string;
  problems: ProblemContestType[];
  participants: ContestParticipantType[];
  userId?: string;
}

export function ContestDetailProblemsList({
  problems,
  participants,
  userId,
}: ContestDetailProblemsListProps) {
  const renderProblem = useCallback(
    ({ problem: { id, title } }: ProblemContestType, index: number) => {
      const attempt: ContestSingleSubmissionType | undefined = participants
        .find((participant) => participant.userId === userId)
        ?.answers.find((answer) => answer.problemId === id);

      const { displayScore, isOfficial, status } = getFinalScore(attempt);

      return (
        <li className={clsx("flex items-center justify-between")}>
          <Paragraph
            style={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              wordWrap: "break-word",
              overflow: "hidden",
              maxHeight: "1.8em",
              lineHeight: "1.8em",
            }}
          >
            <Paragraph color="primary-6" weight="bold" className="mr-2">
              {String.fromCharCode(65 + index)}.
            </Paragraph>
            <Paragraph>{title}</Paragraph>
          </Paragraph>
          {typeof displayScore === "number" && (
            <div className={clsx("flex gap-1", !isOfficial && "opacity-40")}>
              <Paragraph
                color={
                  status === "success"
                    ? "success-6"
                    : status === "attempted"
                      ? "danger-6"
                      : "inherit"
                }
                weight="bold"
              >
                {displayScore}
              </Paragraph>
            </div>
          )}
        </li>
      );
    },
    [participants, userId]
  );

  const renderProblems = useMemo(
    () => (
      <ol className="flex flex-col gap-2 mt-2">
        {problems.length > 0 ? (
          problems.map((problem, index) => (
            <Fragment key={problem.problem.id}>
              {renderProblem(problem, index)}
            </Fragment>
          ))
        ) : (
          <li>
            <Paragraph>This contest has no problems.</Paragraph>
          </li>
        )}
      </ol>
    ),
    [problems, renderProblem]
  );

  return (
    <Card className="flex flex-col flex-grow lg:min-w-[320px] lg:max-w-[320px] h-fit lg:sticky lg:top-0">
      <div className="flex flex-row items-center gap-2">
        <Paragraph tag="h2" size="l">
          Problems
        </Paragraph>
      </div>
      {renderProblems}
    </Card>
  );
}
