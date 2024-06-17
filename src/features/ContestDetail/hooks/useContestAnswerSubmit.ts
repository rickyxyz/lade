import { useCallback, useMemo, useState } from "react";
import { ContestType } from "@/types";
import { API } from "@/api";

export function useContestAnswerSubmit({ contest }: { contest: ContestType }) {
  const { id } = contest;

  const [cooldownIntv, setCooldownIntv] = useState<NodeJS.Timer>();
  const [cooldown, setCooldown] = useState(0);
  const [submitted, setSubmitted] = useState(0);

  const stateAnswerLoading = useState<string | null>();
  const [answerLoading, setAnswerLoading] = stateAnswerLoading;

  const handleCheckAnswer = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (problemId: string, answer: any) => {
      const submittedAt = new Date().getTime();

      if (submitted && submittedAt - submitted <= 1000 * 5) {
        return null;
      }

      setSubmitted(submittedAt);
      setCooldown(1000 * 5);

      let verdict = false;
      setAnswerLoading(problemId);

      await API(
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
            console.log("Verdict ", res.data.message);
            if (res.data.message === "correct") {
              verdict = true;
            }
            setAnswerLoading(null);
          },
          onFail() {
            setAnswerLoading(null);
          },
        }
      );

      if (!verdict) {
        if (cooldownIntv) clearInterval(cooldownIntv);

        const interval = setInterval(() => {
          const currentTime = new Date().getTime();
          const unfreezeAt = submittedAt + 1000 * 5;
          setCooldown(unfreezeAt - currentTime);
          if (unfreezeAt - currentTime <= 0) {
            clearInterval(cooldownIntv);
          }
        }, 100);

        setSubmitted(submittedAt);
        setCooldownIntv(interval);
      } else {
        setCooldown(0);
      }
      return verdict;
    },
    [submitted, setAnswerLoading, id, cooldownIntv]
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
