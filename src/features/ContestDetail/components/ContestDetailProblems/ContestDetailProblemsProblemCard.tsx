import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProblemAnswer } from "@/features";
import { Button, Card, Paragraph } from "@/components";
import { md } from "@/utils";
import { PROBLEM_ANSWER_DEFAULT_VALUES } from "@/consts";
import { ProblemDatabaseType } from "@/types";

export interface ProblemCardProps {
  problem: ProblemDatabaseType;
  className?: string;
  cooldown: number;
  loading: boolean;
  onClick?: () => void;
  onSubmit: (id: string, answer: any) => Promise<boolean | null>;
}

export function ContestDetailProblemsProblemCard({
  problem,
  className,
  cooldown,
  loading,
  onClick,
  onSubmit,
}: ProblemCardProps) {
  const stateAnswer = useState<any>({
    content: "",
  });
  const [answer, setAnswer] = stateAnswer;
  const [solved, setSolved] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { id, statement, title, type } = problem;

  const statementRef = useRef<HTMLDivElement>(null);

  const renderMain = useMemo(
    () => (
      <>
        <div className="relative flex justify-between mb-2">
          <Paragraph className="mr-16" as="h2" color="primary-6">
            {title}
          </Paragraph>
        </div>
        <article className="mb-5" ref={statementRef}></article>
      </>
    ),
    [title]
  );

  const handleRenderMarkdown = useCallback(() => {
    if (statementRef.current)
      statementRef.current.innerHTML = md.render(statement);
  }, [statement]);

  useEffect(() => {
    handleRenderMarkdown();
  }, [handleRenderMarkdown]);

  const handleInitDefaultAnswer = useCallback(() => {
    setAnswer(PROBLEM_ANSWER_DEFAULT_VALUES[type]);
  }, [setAnswer, type]);

  useEffect(() => {
    handleInitDefaultAnswer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        onClick={() => {
          onSubmit(id as any, answer)
            .then((v) => {
              if (v !== null) setSolved(v);
            })
            .finally(() => {
              setSubmitted(true);
            });
        }}
        disabled={cooldown > 0 || solved}
        loading={loading}
      >
        Submit
      </Button>
    </Card>
  );
}