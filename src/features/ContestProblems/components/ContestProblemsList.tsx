import { ReactNode, useCallback, useMemo, useState } from "react";
import { Button, ButtonIcon, Card, Input, Paragraph, Tag } from "@/components";
import { ProblemContestType, ProblemType, StateType } from "@/types";
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
}

export function ContestProblemsList({
  problems,
}: ContestCreateEditorListProps) {
  const renderProblems = useMemo(
    () => (
      <div className="flex flex-col gap-2 mt-2">
        {problems.length > 0 ? (
          problems.map(({ problem: { id, title }, score }, index) => (
            <div key={id} className={clsx("flex items-center justify-between")}>
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
                  {index + 1}.
                </Paragraph>
                <Paragraph>{title}</Paragraph>
              </Paragraph>
              <div className="flex gap-1"></div>
            </div>
          ))
        ) : (
          <div>
            <Paragraph>This contest has no problems.</Paragraph>
          </div>
        )}
      </div>
    ),
    [problems]
  );

  return (
    <Card className="flex flex-col flex-grow lg:min-w-[320px] lg:max-w-[320px] h-fit lg:sticky lg:top-0">
      <div className="flex flex-row items-center gap-2">
        <Paragraph as="h2" size="l">
          Problems
        </Paragraph>
        {/* <ButtonIcon
          icon={mode === "score" ? Numbers : SyncAlt}
          iconClassName={mode === "score" ? "" : "rotate-90"}
          onClick={handleToggleMode}
          style={{
            marginLeft: "auto",
          }}
          variant="ghost"
          size="xs"
        /> */}
      </div>
      {renderProblems}
    </Card>
  );
}
