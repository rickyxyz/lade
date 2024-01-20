import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, Crumb, Paragraph } from "@/components";
import { useAppDispatch, useAppSelector } from "@/libs/redux";
import { getPermissionForContent, md, parseTopicId, api } from "@/utils";
import { ProblemType, ContentViewType, StateType } from "@/types";
import { PROBLEM_ANSWER_DEFAULT_VALUES } from "@/consts";
import { ProblemDetailTopics } from "./ProblemDetailTopic";
import { ProblemAnswer } from "./ProblemAnswer";
import { API } from "@/api";

export interface ProblemMainProps {
  stateProblem: StateType<ProblemType>;
  stateAccept: StateType<unknown>;
  stateMode: StateType<ContentViewType>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stateUserAnswer: StateType<any>;
  stateUserSolved: StateType<boolean>;
  stateSubmited: StateType<number | undefined>;
  stateSolvable: StateType<boolean>;
}

export function ProblemDetailMain({
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

  const topicText = useMemo(() => parseTopicId(topicId).name, [topicId]);
  const subtopicText = useMemo(
    () => parseTopicId(subTopicId).name,
    [subTopicId]
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
        id,
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
    () => <article className="mb-8" ref={statementRef}></article>,
    []
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
