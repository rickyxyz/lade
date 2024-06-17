import { useCallback, useEffect, useMemo, useState } from "react";
import { ContestSingleSubmissionType, ProblemType } from "@/types";
import { parseAnswer } from "@/utils";
import { PROBLEM_ANSWER_DEFAULT_VALUES } from "@/consts";

export function useContestAnswer({
  problem,
  submission,
  onSubmit,
}: {
  problem: ProblemType;
  submission: ContestSingleSubmissionType | undefined;
  onSubmit: (id: string, answer: any) => Promise<boolean | null>;
}) {
  const stateAnswer = useState<any>({
    content: "",
  });
  const [answer, setAnswer] = stateAnswer;
  const stateSolved = useState(false);
  const [solved, setSolved] = stateSolved;
  const stateSubmitted = useState(false);
  const [submitted, setSubmitted] = stateSubmitted;

  const { id, type } = problem;

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
  }, [setAnswer, setSolved, submission, type]);

  const handleAnswer = useCallback(() => {
    onSubmit(id, answer)
      .then((v) => {
        if (v !== null) setSolved(v);
      })
      .finally(() => {
        setSubmitted(true);
      });
  }, [answer, id, onSubmit, setSolved, setSubmitted]);

  useEffect(() => {
    handleInitDefaultAnswer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleInitExistingAnswer();
  }, [handleInitExistingAnswer]);

  return useMemo(
    () => ({
      stateAnswer,
      stateSolved,
      stateSubmitted,
      handleAnswer,
    }),
    [handleAnswer, stateAnswer, stateSolved, stateSubmitted]
  );
}
