import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProblemAnswer } from "@/features";
import { Button, Card, MarkdownPreview, Paragraph } from "@/components";
import { md, parseAnswer } from "@/utils";
import { PROBLEM_ANSWER_DEFAULT_VALUES } from "@/consts";
import { ContestSingleSubmissionType, ProblemDatabaseType } from "@/types";
import { useAnswer } from "@/hooks/useAnswer";
import { useContestAnswer } from "../../hooks/useContestAnswer";

export interface ProblemCardProps {
  problem: ProblemDatabaseType;
  submission?: ContestSingleSubmissionType;
  className?: string;
  cooldown: number;
  loading: boolean;
  onClick?: () => void;
  onSubmit: (id: string, answer: any) => Promise<boolean | null>;
}

export function ContestDetailProblemsProblemCard({
  problem,
  submission,
  className,
  cooldown,
  loading,
  onClick,
  onSubmit,
}: ProblemCardProps) {
  const { type, title, description } = problem;

  const { stateAnswer, stateSubmitted, stateSolved, handleAnswer } =
    useContestAnswer({
      onSubmit,
      problem,
      submission,
    });
  const solved = stateSolved[0];
  const [submitted, setSubmitted] = stateSubmitted;

  const renderMain = useMemo(
    () => (
      <>
        <div className="relative flex justify-between mb-2">
          <Paragraph className="mr-16" tag="h2" color="primary-6">
            {title}
          </Paragraph>
        </div>
        <MarkdownPreview className="mb-5" markdown={description} />
      </>
    ),
    [description, title]
  );

  const renderAnswerVerdict = useMemo(() => {
    if (solved)
      return (
        <Paragraph weight="semibold" color="success-5">
          Correct answer
        </Paragraph>
      );
    if (submitted)
      return (
        Boolean(cooldown > 0 && Math.ceil(cooldown / 1000)) && (
          <Paragraph color="danger-5">
            Incorrect answer. You can answer again in{" "}
            {Math.ceil(cooldown / 1000)}s
          </Paragraph>
        )
      );
  }, [cooldown, solved, submitted]);

  return (
    <Card className={className} onClick={onClick}>
      {renderMain}
      <ProblemAnswer
        stateAnswer={stateAnswer}
        type={type}
        onBlur={() => {
          setSubmitted(false);
        }}
        disabled={solved || cooldown > 0}
      />
      {renderAnswerVerdict}
      <Button
        className="mt-4"
        onClick={handleAnswer}
        disabled={cooldown > 0 || solved}
        loading={loading}
      >
        Submit
      </Button>
    </Card>
  );
}
