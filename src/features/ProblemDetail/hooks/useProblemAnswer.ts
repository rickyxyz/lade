import { API } from "@/api";
import { PROBLEM_ANSWER_DEFAULT_VALUES } from "@/consts";
import { useAppDispatch, useAppSelector } from "@/libs/redux";
import { ProblemType, StateType, UserType } from "@/types";
import { addToast } from "@/utils";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useAnswer({
  problem,
  user,
  onCorrectAnswer,
  onIncorrectAnswer,
}: {
  problem: ProblemType;
  user?: UserType | null;
  onCorrectAnswer?: () => void;
  onIncorrectAnswer?: () => void;
}) {
  const stateUserAnswer = useState<any>();
  const [userAnswer, setUserAnswer] = stateUserAnswer;
  const stateUserSolved = useState(false);
  const setUserSolved = stateUserSolved[1];
  const stateSubmitted = useState<number>();
  const [submitted, setSubmitted] = stateSubmitted;
  const stateSolvable = useState(false);
  const setSolvable = stateSolvable[1];
  const stateLoading = useState(true);
  const [loading, setLoading] = stateLoading;
  const [cooldownIntv, setCooldownIntv] = useState<NodeJS.Timer>();
  const stateCooldown = useState(0);
  const [cooldown, setCooldown] = stateCooldown;
  const dispatch = useAppDispatch();
  const { id: problemId, type } = problem;

  const allUserSolved = useAppSelector("solveds");
  const solveCache = useMemo(
    () => problemId && allUserSolved && allUserSolved[problemId],
    [allUserSolved, problemId]
  );

  const handleAfterSubmitAnswer = useCallback(
    (verdict: boolean) => {
      const submittedAt = new Date().getTime();

      setUserSolved(verdict);
      setLoading(false);
      console.log("Handle After Submit ANswer");
      addToast({
        text: verdict ? "Correct answer." : "Incorrect answer.",
      });

      if (!verdict) {
        setCooldown(1000 * 5);
        if (cooldownIntv) clearInterval(cooldownIntv);

        const interval = setInterval(() => {
          const currentTime = new Date().getTime();
          const unfreezeAt = submittedAt + 1000 * 5;
          setCooldown(unfreezeAt - currentTime);
        }, 100);

        setSubmitted(submittedAt);

        setCooldownIntv(interval);
        onIncorrectAnswer && onIncorrectAnswer();
      } else {
        setCooldown(0);
        onCorrectAnswer && onCorrectAnswer();
        dispatch("update_solveds", {
          [problemId]: userAnswer,
        });
      }
    },
    [
      cooldownIntv,
      dispatch,
      onCorrectAnswer,
      onIncorrectAnswer,
      problemId,
      setCooldown,
      setLoading,
      setSubmitted,
      setUserSolved,
      userAnswer,
    ]
  );

  const handleCheckAnswer = useCallback(async () => {
    if (!problemId || !userAnswer) return;

    const now = new Date().getTime();
    if (submitted && now - submitted <= 1000 * 5) {
      return;
    }

    setLoading(true);

    API(
      "post_solved",
      {
        body: {
          id: String(problemId),
          answer: userAnswer,
        },
      },
      {
        onSuccess(res) {
          handleAfterSubmitAnswer(res.data.message === "correct");
        },
        onFail() {
          handleAfterSubmitAnswer(false);
        },
      }
    );
  }, [problemId, userAnswer, submitted, setLoading, handleAfterSubmitAnswer]);

  const handleInitDefaultAnswer = useCallback(() => {
    setUserAnswer(PROBLEM_ANSWER_DEFAULT_VALUES[type]);
  }, [setUserAnswer, type]);

  useEffect(() => {
    handleInitDefaultAnswer();
  }, [handleInitDefaultAnswer]);

  return useMemo(
    () => ({
      handleCheckAnswer,
      stateUserAnswer,
      stateUserSolved,
      stateSubmitted,
      stateSolvable,
      stateLoading,
      stateCooldown,
    }),
    [
      handleCheckAnswer,
      stateCooldown,
      stateLoading,
      stateSolvable,
      stateSubmitted,
      stateUserAnswer,
      stateUserSolved,
    ]
  );
}
