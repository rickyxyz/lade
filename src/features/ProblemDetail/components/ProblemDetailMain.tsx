import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, Crumb, MarkdownPreview, Paragraph } from "@/components";
import { useAppDispatch, useAppSelector } from "@/libs/redux";
import { md } from "@/utils";
import {
  ProblemType,
  ContentViewType,
  StateType,
  ProblemMainTabType,
} from "@/types";
import { PROBLEM_ANSWER_DEFAULT_VALUES } from "@/consts";
import { ProblemAnswer } from "./ProblemAnswer";
import { API } from "@/api";
import { CardTab, CardTabType } from "@/components/Card/CardTab";

export interface ProblemMainProps {
  stateProblem: StateType<ProblemType>;
  stateAccept: StateType<unknown>;
  stateMode: StateType<ContentViewType>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stateUserAnswer: StateType<any>;
  stateUserSolved: StateType<boolean>;
  stateSubmited: StateType<number | undefined>;
  stateSolvable: StateType<boolean>;
  className?: string;
}

export function ProblemDetailMain({
  className,
  stateProblem,
  stateMode,
  stateUserAnswer,
  stateUserSolved,
  stateSubmited,
  stateSolvable,
}: ProblemMainProps) {
  const [problem, setProblem] = stateProblem;
  const { id, statement, title, topicId, subTopicId, type } = problem;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userAnswer, setUserAnswer] = stateUserAnswer;
  const [userSolved, setUserSolved] = stateUserSolved;
  const [submitted, setSubmitted] = stateSubmited;
  const [cooldownIntv, setCooldownIntv] = useState<NodeJS.Timer>();
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const solvable = stateSolvable[0];
  const dispatch = useAppDispatch();
  const statementRef = useRef<HTMLDivElement>(null);
  const stateTab = useState<ProblemMainTabType>("problem");
  const [tab, setTab] = stateTab;

  const tabs = useMemo<CardTabType<ProblemMainTabType>[]>(
    () => [
      {
        id: "problem",
        label: "Problem",
        onClick: () => {
          setTab("problem");
        },
      },
      {
        id: "discussion",
        label: "Discussion",
        onClick: () => {
          setTab("discussion");
        },
      },
    ],
    [setTab]
  );

  const handleCheckAnswer = useCallback(async () => {
    if (!id || !userAnswer) return;

    const now = new Date().getTime();
    if (submitted && now - submitted <= 1000 * 5) {
      return;
    }

    let verdict = false;
    setLoading(true);
    await API("post_solved", {
      body: {
        id: String(id),
        answer: userAnswer,
      },
    })
      .then((res) => {
        if (res.data.message === "correct") {
          verdict = true;
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });

    if (cooldownIntv) clearInterval(cooldownIntv);
    setCooldown(10000);
    const interval = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 100));
    }, 100);

    setSubmitted(now);
    setUserSolved(verdict);

    if (!verdict) {
      setCooldownIntv(interval);
    } else {
      dispatch("update_solveds", {
        [id]: userAnswer,
      });
      setProblem((prev) => ({
        ...prev,
        solveds: [],
      }));
    }
  }, [
    id,
    userAnswer,
    submitted,
    cooldownIntv,
    setSubmitted,
    setUserSolved,
    dispatch,
    setProblem,
  ]);

  const renderMain = useMemo(
    () => (
      //<article className="mb-8" ref={statementRef} />
      <MarkdownPreview className="mb-8" markdown={statement} />
    ),
    [statement]
  );

  const renderAnswerVerdict = useMemo(() => {
    if (submitted) {
      return userSolved ? (
        <Paragraph weight="semibold" color="success-5">
          Correct answer
        </Paragraph>
      ) : (
        Boolean(cooldown > 0 && !userSolved && Math.ceil(cooldown / 1000)) && (
          <Paragraph color="danger-5">
            Incorrect answer. You can answer again in{" "}
            {Math.ceil(cooldown / 1000)}s
          </Paragraph>
        )
      );
    }
  }, [cooldown, submitted, userSolved]);

  const renderAnswerInputs = useMemo(() => {
    if (userAnswer === undefined || !problem) return;

    return (
      <ProblemAnswer
        type={type}
        stateAnswer={stateUserAnswer}
        disabled={userSolved}
        caption={renderAnswerVerdict}
      />
    );
  }, [
    problem,
    renderAnswerVerdict,
    stateUserAnswer,
    type,
    userAnswer,
    userSolved,
  ]);

  const renderAnswer = useMemo(
    () => (
      <>
        {renderAnswerInputs}
        {!userSolved && (
          <div className="flex items-center justify-between mt-8">
            <Button
              className="w-20"
              disabled={!solvable || cooldown > 0 || userSolved || loading}
              onClick={handleCheckAnswer}
              label="Submit"
            />
          </div>
        )}
      </>
    ),
    [
      cooldown,
      handleCheckAnswer,
      loading,
      renderAnswerInputs,
      solvable,
      userSolved,
    ]
  );

  const handleInitDefaultAnswer = useCallback(() => {
    setUserAnswer(PROBLEM_ANSWER_DEFAULT_VALUES[type]);
  }, [setUserAnswer, type]);

  useEffect(() => {
    handleInitDefaultAnswer();
  }, [handleInitDefaultAnswer]);

  const renderContent = useMemo(() => {
    switch (tab) {
      case "problem":
        return (
          <>
            {renderMain}
            {renderAnswer}
          </>
        );
      case "discussion":
        return <div>Discussion</div>;
    }
  }, [renderAnswer, renderMain, tab]);

  return <Card className={className}>{renderContent}</Card>;
}
