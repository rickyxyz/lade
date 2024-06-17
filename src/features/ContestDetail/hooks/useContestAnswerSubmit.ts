import { useCallback, useMemo, useState } from "react";
import { ContestType } from "@/types";
import { API } from "@/api";
import { addToast } from "@/utils";

export function useContestAnswerSubmit({ contest }: { contest: ContestType }) {
  const { id } = contest;

  const [cooldownIntv, setCooldownIntv] = useState<NodeJS.Timer>();
  const [cooldown, setCooldown] = useState(0);
  const [submitted, setSubmitted] = useState(0);

  const stateAnswerLoading = useState<string | null>();
  const [answerLoading, setAnswerLoading] = stateAnswerLoading;

  const handleAfterSubmitAnswer = useCallback(
    (verdict: boolean) => {
      const startCooldown = new Date().getTime();

      console.log(verdict ? "Correct answer." : "Incorrect answer.");
      addToast({
        text: verdict ? "Correct answer." : "Incorrect answer.",
      });

      if (!verdict) {
        setCooldown(1000 * 5);
        if (cooldownIntv) clearInterval(cooldownIntv);

        const interval = setInterval(() => {
          const currentTime = new Date().getTime();
          const unfreezeAt = startCooldown + 1000 * 5;
          setCooldown(unfreezeAt - currentTime);
          if (unfreezeAt - currentTime <= 0) {
            clearInterval(cooldownIntv);
          }
        }, 100);

        setSubmitted(startCooldown);
        setCooldownIntv(interval);
      } else {
        setCooldown(0);
      }
      setAnswerLoading(null);
    },
    [cooldownIntv, setAnswerLoading]
  );

  const handleCheckAnswer = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (problemId: string, answer: any) => {
      const submittedAt = new Date().getTime();

      if (submitted && submittedAt - submitted <= 1000 * 5) {
        return null;
      }

      setSubmitted(submittedAt);
      setAnswerLoading(problemId);

      return API(
        "post_contest_answer",
        {
          body: {
            contestId: String(id),
            problemId,
            answer,
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
      )
        .then((res) => res.data.message === "correct")
        .catch(() => false);
    },
    [submitted, setAnswerLoading, id, handleAfterSubmitAnswer]
  );

  return useMemo(
    () => ({
      cooldown,
      answerLoading,
      handleCheckAnswer,
    }),
    [answerLoading, cooldown, handleCheckAnswer]
  );
}
