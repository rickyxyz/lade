import { Fragment, ReactNode, useCallback, useMemo, useState } from "react";
import { Button, ButtonIcon, Card, Input, Paragraph, Tag } from "@/components";
import {
  ContestSubmissionType,
  ProblemContestType,
  ProblemType,
  StateType,
} from "@/types";
import { ProblemDetailTopics } from "@/features/ProblemDetail";
import {
  ArrowDownward,
  ArrowUpward,
  Delete,
  Numbers,
  SyncAlt,
} from "@mui/icons-material";
import {
  CONTEST_MAX_PROBLEMS,
  CONTEST_MIN_PROBLEMS,
  PROBLEM_CREATE_SIMULTANEOUS_COUNT,
} from "@/consts";
import { useTopics } from "@/hooks";
import clsx from "clsx";

export interface ContestCreateEditorListProps {
  className?: string;
  problems: ProblemContestType[];
  submission: ContestSubmissionType;
  userId: string;
}

export function ContestProblemsList({
  problems,
  submission,
  userId,
}: ContestCreateEditorListProps) {
  const renderProblem = useCallback(
    ({ problem: { id, title } }: ProblemContestType, index: number) => {
      const score =
        submission[id] &&
        submission[id][userId] &&
        submission[id][userId].score;

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
          {typeof score === "number" && (
            <div className="flex gap-1">
              <Paragraph
                color={score > 0 ? "success-6" : "danger-6"}
                weight="bold"
              >
                {score}
              </Paragraph>
            </div>
          )}
        </li>
      );
    },
    [submission, userId]
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
        <Paragraph as="h2" size="l">
          Problems
        </Paragraph>
      </div>
      {renderProblems}
    </Card>
  );
}
