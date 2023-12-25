import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Card } from "@/components";
import { md } from "@/utils";
import { ProblemType, ContentViewType, StateType } from "@/types";
import { PROBLEM_ANSWER_DEFAULT_VALUES } from "@/consts";
import { validateAnswer } from "@/utils/answer";
import { crudData } from "@/libs/firebase";
import { increment } from "firebase/firestore";
import { ProblemAnswer } from "./ProblemAnswer";

export interface ProblemMainProps {
  stateProblem: StateType<ProblemType>;
  stateAccept: StateType<unknown>;
  stateMode: StateType<ContentViewType>;
}

export function ProblemDetailMain({
  stateProblem,
  stateAccept,
}: ProblemMainProps) {
  const [problem, setProblem] = stateProblem;
  const accept = stateAccept[0];

  const { id, statement, type } = problem;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stateUserAnswer = useState<any>();
  const [userAnswer, setUserAnswer] = stateUserAnswer;
  const [userSolved, setUserSolved] = useState(false);
  const [submitted, setSubmitted] = useState<number>();
  const [cooldownIntv, setCooldownIntv] = useState<NodeJS.Timer>();
  const [cooldown, setCooldown] = useState(0);

  const statementRef = useRef<HTMLDivElement>(null);

  const handleCheckAnswer = useCallback(() => {
    console.log("Test: ");
    console.log(accept);
    if (!id || !accept || !userAnswer) return;

    const now = new Date().getTime();

    if (submitted && now - submitted <= 1000 * 5) {
      return;
    }

    const verdict = validateAnswer(
      type,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (accept as any).content,
      userAnswer.content
    );

    if (cooldownIntv) clearInterval(cooldownIntv);

    setCooldown(5000);

    const interval = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 100));
    }, 100);

    setSubmitted(now);
    setUserSolved(verdict);

    if (!verdict) {
      setCooldownIntv(interval);
    } else {
      crudData("update_problem", {
        id,
        data: {
          solved: increment(1) as unknown as number,
        },
      });
      setProblem((prev) => ({
        ...prev,
        solved: (prev.solved ?? 0) + 1,
      }));
    }
  }, [accept, id, submitted, type, userAnswer, cooldownIntv, setProblem]);

  const renderMain = useMemo(
    () => (
      <>
        {/* <h2 className="mb-2">Problem Statement</h2> */}
        <article className="mb-8" ref={statementRef}></article>
      </>
    ),
    []
  );

  const renderAnswerInputs = useMemo(() => {
    if (userAnswer === undefined || !problem) return;

    return (
      <ProblemAnswer
        type={type}
        stateAnswer={stateUserAnswer}
        disabled={userSolved}
      />
    );
  }, [problem, stateUserAnswer, type, userAnswer, userSolved]);

  const renderAnswer = useMemo(
    () => (
      <>
        {/* <div className="flex items-center mb-3">
          <h2>Your Answer</h2>
          {renderAnswerVerdict}
        </div> */}
        {renderAnswerInputs}
        <div className="flex items-center justify-between">
          <Button
            className="w-20"
            disabled={cooldown > 0 || userSolved}
            onClick={handleCheckAnswer}
          >
            {cooldown > 0 && !userSolved
              ? Math.ceil(cooldown / 1000)
              : "Submit"}
          </Button>
        </div>
      </>
    ),
    [cooldown, handleCheckAnswer, renderAnswerInputs, userSolved]
  );

  const handleRenderMarkdown = useCallback(() => {
    if (statementRef.current)
      statementRef.current.innerHTML = md.render(statement);
  }, [statement]);

  const handleInitDefaultAnswer = useCallback(() => {
    setUserAnswer(PROBLEM_ANSWER_DEFAULT_VALUES[type]);
  }, [setUserAnswer, type]);

  useEffect(() => {
    handleInitDefaultAnswer();
  }, [handleInitDefaultAnswer]);

  useEffect(() => {
    handleRenderMarkdown();
  }, [handleRenderMarkdown]);

  return (
    <>
      <Card>
        {renderMain}
        {renderAnswer}
      </Card>
    </>
  );
}
