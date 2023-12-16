import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, Icon, More, User } from "@/components";
import { getPermissionForContent, md } from "@/utils";
import { ProblemType, ContentViewType, StateType } from "@/types";
import clsx from "clsx";
import { PROBLEM_ANSWER_DEFAULT_VALUES } from "@/consts";
import { validateAnswer } from "@/utils/answer";
import { useAppSelector } from "@/libs/redux";
import { crudData } from "@/libs/firebase";
import { increment } from "firebase/firestore";
import { BsCheck, BsX } from "react-icons/bs";
import { ProblemDetailStats } from "./ProblemDetailStats";
import { ProblemDetailTopics } from "./ProblemDetailTopic";
import { ProblemAnswer } from "./ProblemAnswer";

export interface ProblemMainProps {
  stateProblem: StateType<ProblemType>;
  stateAccept: StateType<unknown>;
  stateMode: StateType<ContentViewType>;
}

export function ProblemDetailMain({
  stateProblem,
  stateAccept,
  stateMode,
}: ProblemMainProps) {
  const [problem, setProblem] = stateProblem;
  const accept = stateAccept[0];

  const {
    id,
    statement,
    title,
    topic,
    subtopic,
    solved = 0,
    views = 0,
    type,
    authorId,
  } = problem;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stateUserAnswer = useState<any>();
  const [userAnswer, setUserAnswer] = stateUserAnswer;
  const [userSolved, setUserSolved] = useState(false);
  const [submitted, setSubmitted] = useState<number>();
  const [cooldownIntv, setCooldownIntv] = useState<NodeJS.Timer>();
  const [cooldown, setCooldown] = useState(0);
  const user = useAppSelector("user");
  const setMode = stateMode[1];
  const permission = useMemo(
    () =>
      getPermissionForContent({
        content: problem,
        user,
      }),
    [problem, user]
  );

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

  const renderTags = useMemo(
    () => (
      <ProblemDetailTopics topic={topic} subtopic={subtopic} className="mb-4" />
    ),
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
        <ProblemDetailStats type="view" value={views} />
        <ProblemDetailStats type="solved" value={solved} />
      </div>
    ),
    [solved, views]
  );

  const renderMain = useMemo(
    () => (
      <>
        <div className="flex justify-between mb-4">
          <User id={authorId} caption="3h" />
          <More
            options={
              permission === "author"
                ? [
                    {
                      id: "edit",
                      element: "Edit",
                      onClick: () => {
                        console.log("Edit");
                        setMode("edit");
                      },
                    },
                  ]
                : []
            }
          />
        </div>
        <h1 className="mb-4">{title}</h1>
        {renderTags}
        {renderStats}
        <h2 className="mb-2">Problem Statement</h2>
        <article className="mb-9" ref={statementRef}></article>
      </>
    ),
    [authorId, permission, renderStats, renderTags, setMode, title]
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
        <Icon IconComponent={BsCheck} size="l" className="text-green-600" />
      ) : (
        <Icon IconComponent={BsX} size="l" className="text-red-600" />
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