import { ReactNode, useMemo } from "react";
import { Button, ButtonIcon, Card, Paragraph } from "@/components";
import { ProblemType, StateType } from "@/types";
import { ProblemDetailTopics } from "@/features/ProblemDetail";
import { ArrowDownward, ArrowUpward, Delete } from "@mui/icons-material";
import { CONTEST_PROBLEM_MAX, PROBLEM_AT_A_TIME_COUNT } from "@/consts";
import { useTopics } from "@/hooks";

export interface ContestCreateEditorListProps {
  className?: string;
  problems: ProblemType[];
  stateLoading: StateType<boolean>;
  onReorder: (index: number, direction: 1 | -1) => void;
  onDelete: (index: number) => void;
}

export function ContestCreateEditorList({
  stateLoading,
  problems,
  onDelete,
  onReorder,
}: ContestCreateEditorListProps) {
  const renderProblems = useMemo(
    () => (
      <div className="flex flex-col gap-2 mt-2">
        {problems.length > 0 ? (
          problems.map(({ id, title }, index) => (
            <div key={id} className="flex items-center justify-between gap-2">
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
              <div className="flex gap-2">
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
    [onDelete, onReorder, problems]
  );

  return (
    <Card className="flex flex-col flex-grow lg:min-w-[320px] lg:max-w-[320px] h-fit lg:sticky lg:top-0">
      <Paragraph as="h2" size="l">
        Problems ({problems.length} / {CONTEST_PROBLEM_MAX})
      </Paragraph>
      {renderProblems}
    </Card>
  );
}
