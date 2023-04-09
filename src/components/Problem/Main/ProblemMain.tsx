import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Card,
  Icon,
  Input,
  ProblemAnswer,
  ProblemStats,
  ProblemTopics,
} from "@/components";
import { md } from "@/utils";
import { ProblemType } from "@/types";
import clsx from "clsx";
import { PROBLEM_ANSWER_DEFAULT_VALUES } from "@/consts";
import { validateAnswer } from "@/utils/answer";

export interface ProblemMainProps {
  problem: ProblemType;
}

export function ProblemMain({ problem }: ProblemMainProps) {
  const {
    id,
    statement,
    title,
    topic,
    subtopic,
    solved = 0,
    views = 0,
    type,
    answer,
  } = problem;

  const stateUserAnswer = useState<any>();
  const [userAnswer, setUserAnswer] = stateUserAnswer;
  const [userSolved, setUserSolved] = useState(false);
  const [submitted, setSubmitted] = useState<number>();
  const [cooldownIntv, setCooldownIntv] = useState<NodeJS.Timer>();
  const [cooldown, setCooldown] = useState(0);

  const statementRef = useRef<HTMLDivElement>(null);

  const handleCheckAnswer = useCallback(() => {
    const now = new Date().getTime();

    if (submitted && now - submitted <= 1000 * 5) {
      return;
    }

    const verdict = validateAnswer(type, answer, userAnswer);

    if (cooldownIntv) clearInterval(cooldownIntv);

    setCooldown(5000);

    const interval = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 100));
    }, 100);

    setSubmitted(now);
    setUserSolved(verdict);

    if (!verdict) setCooldownIntv(interval);
  }, [answer, cooldownIntv, submitted, type, userAnswer]);

  const renderTags = useMemo(
    () => <ProblemTopics topic={topic} subtopic={subtopic} className="mb-3" />,
    [subtopic, topic]
  );

  const renderStats = useMemo(
    () => (
      <div
        className={clsx(
          "flex w-fit items-center mb-9",
          "text-sm text-gray-600 gap-8"
        )}
      >
        <ProblemStats type="view" value={views} />
        <ProblemStats type="solved" value={solved} />
      </div>
    ),
    [solved, views]
  );

  const renderMain = useMemo(
    () => (
      <>
        <h1 className="mb-3">{title}</h1>
        {renderTags}
        {renderStats}
        <h2 className="mb-2">Problem Statement</h2>
        <article className="mb-9" ref={statementRef}></article>
      </>
    ),
    [renderStats, renderTags, title]
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

  const renderAnswerVerdict = useMemo(() => {
    if (submitted) {
      return userSolved ? (
        <Icon icon="check" size="lg" className="text-green-600" />
      ) : (
        <Icon icon="X" size="lg" className="text-red-600" />
      );
    }
  }, [submitted, userSolved]);

  const renderAnswer = useMemo(
    () => (
      <>
        <div className="flex items-center mb-3">
          <h2>Your Answer</h2>
          {renderAnswerVerdict}
        </div>
        {renderAnswerInputs}
        <Button
          className="w-20"
          disabled={cooldown > 0 || userSolved}
          onClick={handleCheckAnswer}
        >
          {cooldown > 0 && !userSolved ? Math.ceil(cooldown / 1000) : "Submit"}
        </Button>
      </>
    ),
    [
      cooldown,
      handleCheckAnswer,
      renderAnswerInputs,
      renderAnswerVerdict,
      userSolved,
    ]
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
    <Card>
      {renderMain}
      {renderAnswer}
    </Card>
  );
}
