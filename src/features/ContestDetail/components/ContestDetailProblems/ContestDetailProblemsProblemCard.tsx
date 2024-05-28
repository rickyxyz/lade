import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProblemAnswer } from "@/features";
import { Button, Card, MarkdownPreview, Paragraph } from "@/components";
import { md, parseAnswer } from "@/utils";
import { PROBLEM_ANSWER_DEFAULT_VALUES } from "@/consts";
import { ContestSingleSubmissionType, ProblemDatabaseType } from "@/types";

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
  const stateAnswer = useState<any>({
    content: "",
  });
  const [answer, setAnswer] = stateAnswer;
  const [solved, setSolved] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { id, description, title, type } = problem;

  const descriptionRef = useRef<HTMLDivElement>(null);

  const renderMain = useMemo(
    () => (
      <>
        <div className="relative flex justify-between mb-2">
          <Paragraph className="mr-16" as="h2" color="primary-6">
            {title}
          </Paragraph>
        </div>
        <MarkdownPreview className="mb-5" markdown={description} />
      </>
    ),
    [description, title]
  );

  const handleInitDefaultAnswer = useCallback(() => {
    setAnswer(PROBLEM_ANSWER_DEFAULT_VALUES[type]);
  }, [setAnswer, type]);

  const handleInitExistingAnswer = useCallback(() => {
    const lastCorrectAnswer = submission
      ? submission.attempts.find((attempt) => attempt.score > 0)
      : null;

    const parsed = parseAnswer(type, lastCorrectAnswer?.answer);

    if (parsed) {
      setAnswer(parsed);
      setSolved(true);
    }
  }, [setAnswer, submission, type]);

  useEffect(() => {
    handleInitDefaultAnswer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleInitExistingAnswer();
  }, [handleInitExistingAnswer]);

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
          onSubmit(id, answer)
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
