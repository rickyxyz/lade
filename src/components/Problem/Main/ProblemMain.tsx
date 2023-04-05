import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, Input, Tag } from "@/components";
import { ProblemStats } from "../Stats";
import { md } from "@/utils";
import { ProblemToAnswerType, ProblemType } from "@/types";
import clsx from "clsx";
import { PROBLEM_ANSWER_DEFAULT_VALUES } from "@/consts";

export interface ProblemMainProps {
  problem: ProblemType;
}

export function ProblemMain({ problem }: ProblemMainProps) {
  const {
    id,
    statement,
    title,
    topics,
    solved = 0,
    views = 0,
    type,
    answer,
  } = problem;

  const [userAnswer, setUserAnswer] = useState<any>();

  const statementRef = useRef<HTMLDivElement>(null);

  const handleCheckAnswer = useCallback(() => {
    const verdict = (() => {
      switch (type) {
        case "matrix":
          return !answer.some((column, j) =>
            column.some((cell, i) => String(cell) !== userAnswer[j][i])
          );
        case "short_answer":
          return userAnswer === String(answer);
      }
    })();

    console.log("Verdict: ", verdict);
  }, [answer, type, userAnswer]);

  const renderTags = useMemo(
    () => (
      <div className="flex flex-wrap gap-4 mb-3">
        {topics.map((topic) => (
          <Tag key={`${id}-${topic}`}>{topic}</Tag>
        ))}
      </div>
    ),
    [id, topics]
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
          />
        );
    }
  }, [id, problem, type, userAnswer]);

  const renderAnswer = useMemo(
    () => (
      <>
        <h2 className="mb-3">Your Answer</h2>
        {renderAnswerInputs}
        <Button onClick={handleCheckAnswer}>Check</Button>
      </>
    ),
    [handleCheckAnswer, renderAnswerInputs]
  );

  const handleRenderMarkdown = useCallback(() => {
    if (statementRef.current)
      statementRef.current.innerHTML = md.render(statement);
  }, [statement]);

  const handleInitDefaultAnswer = useCallback(() => {
    if (type === "matrix") {
      const vertical = Array.from({ length: 3 });
      const horizontal = Array.from({ length: 3 });

      setUserAnswer(vertical.map((_) => horizontal.map((_) => "")));
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
