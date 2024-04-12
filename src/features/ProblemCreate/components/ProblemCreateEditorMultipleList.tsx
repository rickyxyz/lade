import { ReactNode, useMemo } from "react";
import { Button, ButtonIcon, Card, Paragraph } from "@/components";
import { ProblemType, StateType } from "@/types";
import { ProblemDetailTopics } from "@/features/ProblemDetail";
import { Delete } from "@mui/icons-material";
import { PROBLEM_CREATE_SIMULTANEOUS_COUNT } from "@/consts";
import { useTopics } from "@/hooks";

export interface ProblemCreateEditorMultipleListProps {
  className?: string;
  problems: ProblemType[];
  stateLoading: StateType<boolean>;
  onAdd: () => void;
  onDelete: (index: number) => void;
  onSubmit: () => void;
}

export function ProblemCreateEditorMultipleList({
  stateLoading,
  problems,
  onAdd,
  onDelete,
  onSubmit,
}: ProblemCreateEditorMultipleListProps) {
  const loading = stateLoading[0];

  const canCreateMore = useMemo(
    () => problems.length < PROBLEM_CREATE_SIMULTANEOUS_COUNT,
    [problems.length]
  );

  return (
    <Card className="flex flex-col flex-grow lg:max-w-[320px] h-fit lg:sticky lg:top-0">
      <Paragraph as="h2" size="l">
        Problems ({problems.length} / {PROBLEM_CREATE_SIMULTANEOUS_COUNT})
      </Paragraph>
      <div className="flex flex-col gap-2 mt-2">
        {problems.map(({ id, title }, index) => (
          <div key={id}>
            <div className="flex items-center justify-between">
              <Paragraph>{title}</Paragraph>
              <ButtonIcon
                className="!p-1 !h-6"
                icon={Delete}
                variant="ghost"
                color="danger"
                onClick={() => {
                  onDelete(index);
                }}
                disabled={problems.length === 1}
              />
            </div>
          </div>
        ))}
      </div>
      <Button
        className="flex-grow mt-4"
        onClick={onAdd}
        alignText="center"
        label="Add Problem"
        variant="outline"
        disabled={!canCreateMore}
      />
      <Button
        className="flex-grow mt-4"
        onClick={onSubmit}
        alignText="center"
        label="Post All"
        loading={loading}
      />
    </Card>
  );
}
