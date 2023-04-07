import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Card,
  Icon,
  Input,
  ProblemStats,
  ProblemTopics,
} from "@/components";
import { md } from "@/utils";
import { ProblemType } from "@/types";
import clsx from "clsx";

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

  const [userAnswer, setUserAnswer] = useState<any>();
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

    const verdict = (() => {
      switch (type) {
        case "matrix":
          return !answer.some((column, j) =>
            column.some((cell, i) => String(cell) !== userAnswer[j][i])
          );
        case "short_answer":
          return userAnswer === String(answer);
      }
      return false;
    })();

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
    if (userAnswer === undefined) return;

    switch (type) {
      case "matrix":
        const { matrixHeight, matrixWidth } = problem;
        const vertical = Array.from({ length: matrixHeight });
        const horizontal = Array.from({ length: matrixWidth });

        return (
          <div className="flex flex-col gap-2 mb-4">
            {userAnswer &&
              vertical.map((_, j) => (
                <div key={`${id}-Matrix-${j}`} className="flex gap-2">
                  {horizontal.map((_, i) => (
                    <Input
                      key={`${id}-Matrix-${j}-${i}`}
                      variant="solid"
                      className="w-24 text-center"
                      value={userAnswer[j][i]}
                      onChange={(e: any) => {
                        setUserAnswer((prev: any) => {
                          const temp = JSON.parse(JSON.stringify(prev));
                          temp[j][i] = e.target.value;
                          for (let y = 0; y <= j; y++) {
                            for (let x = 0; x <= i; x++) {
                              if (temp[y][x] === "" && e.target.value !== "")
                                temp[y][x] = "0";
                            }
                          }
                          return temp;
                        });
                      }}
                    />
                  ))}
                </div>
              ))}
          </div>
        );
      case "short_answer":
        return (
          <Input
            className="mb-4"
            value={userAnswer}
            onChange={(e: any) => {
              setUserAnswer(e.target.value);
            }}
            disabled={userSolved}
          />
        );
    }
  }, [id, problem, type, userAnswer, userSolved]);

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
    switch (type) {
      case "matrix":
        const vertical = Array.from({ length: 3 });
        const horizontal = Array.from({ length: 3 });

        setUserAnswer(vertical.map((_) => horizontal.map((_) => "")));
        break;
      case "short_answer":
        setUserAnswer("");
        break;
    }
  }, [type]);

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
