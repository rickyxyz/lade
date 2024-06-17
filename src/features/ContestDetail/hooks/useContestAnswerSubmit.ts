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
    async (problemId: string, answer: any) => {
      const now = new Date().getTime();

      if (submitted && now - submitted <= 1000 * 5) {
        setCooldown(Math.max(0, submitted + 1000 * 5 - now));
        return null;
      }

      setSubmitted(now);
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

        setCooldown(10000);
        const interval = setInterval(() => {
          setCooldown((prev) => Math.max(0, prev - 100));
        }, 100);

        setSubmitted(now);

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
