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
import { CONTEST_PROBLEM_MAX, PROBLEM_AT_A_TIME_COUNT } from "@/consts";
import { useTopics } from "@/hooks";
import clsx from "clsx";

export interface ContestCreateEditorListProps {
  className?: string;
  problems: ProblemContestType[];
  stateLoading: StateType<boolean>;
  onReorder: (index: number, direction: 1 | -1) => void;
  onDelete: (index: number) => void;
  onUpdateScore: (index: number, score: number | string) => void;
}

export function ContestCreateEditorList({
  stateLoading,
  problems,
  onDelete,
  onReorder,
  onUpdateScore,
}: ContestCreateEditorListProps) {
  const [mode, setMode] = useState<"order" | "score">("score");

  const renderProblems = useMemo(
    () => (
      <div className="flex flex-col gap-2 mt-2">
        {problems.length > 0 ? (
          problems.map(({ problem: { id, title }, score }, index) => (
            <div
              key={id}
              className={clsx(
                "flex items-center justify-between",
                mode === "score" ? "gap-4" : "gap-2"
              )}
            >
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
              <div className="flex gap-1">
                {mode === "order" ? (
                  <>
                    <ButtonIcon
                      size="xs"
                      icon={ArrowUpward}
                      variant="ghost"
                      onClick={() => {
                        onReorder(index, -1);
                      }}
                      disabled={index === 0}
                    />
                    <ButtonIcon
                      size="xs"
                      icon={ArrowDownward}
                      variant="ghost"
                      onClick={() => {
                        onReorder(index, 1);
                      }}
                      disabled={index === problems.length - 1}
                    />
                    <ButtonIcon
                      size="xs"
                      icon={Delete}
                      variant="ghost"
                      color="danger"
                      onClick={() => {
                        onDelete(index);
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Input
                      className="text-center"
                      size="s"
                      width={58}
                      value={score}
                      onChange={(e) => {
                        onUpdateScore(index, e.target.value);
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div>
            <Paragraph>This contest has no problems.</Paragraph>
          </div>
        )}
      </div>
    ),
    [mode, onDelete, onReorder, onUpdateScore, problems]
  );

  const handleToggleMode = useCallback(() => {
    setMode((prev) => (prev === "order" ? "score" : "order"));
  }, []);

  return (
    <Card className="flex flex-col flex-grow lg:min-w-[320px] lg:max-w-[320px] h-fit lg:sticky lg:top-0">
      <div className="flex flex-row items-center gap-2">
        <Paragraph as="h2" size="l">
          Problems
        </Paragraph>
        <Tag
          color={
            problems.length === CONTEST_PROBLEM_MAX
              ? "danger"
              : problems.length === 0
              ? "warning"
              : "primary"
          }
        >
          {problems.length} / {CONTEST_PROBLEM_MAX}
        </Tag>
        <ButtonIcon
          icon={mode === "score" ? Numbers : SyncAlt}
          iconClassName={mode === "score" ? "" : "rotate-90"}
          onClick={handleToggleMode}
          style={{
            marginLeft: "auto",
          }}
          variant="ghost"
          size="xs"
        />
      </div>
      {renderProblems}
    </Card>
  );
}
