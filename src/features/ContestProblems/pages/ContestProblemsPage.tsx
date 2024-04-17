/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { API } from "@/api";
import { ProblemCardSkeleton } from "@/features/ProblemList";
import { ButtonListEntry } from "@/components";
import {
  ContestType,
  UserType,
  ProblemContestType,
  ContentAccessType,
  ContestDatabaseType,
} from "@/types";
import { CONTEST_DEFAULT } from "@/consts";
import { PageTemplate } from "@/templates";
import { useListenContestSubmission } from "../hooks";
import {
  ContestDetailMainSkeleton,
  ContestProblemsList,
  ContestProblemsProblemCard,
  ContestProblemsData,
} from "../components";

interface ContestProps {
  contestId: string;
  user?: UserType | null;
}

export function ContestProblemsPage({ contestId, user }: ContestProps) {
  const stateContest = useState<ContestType>(
    CONTEST_DEFAULT as unknown as ContestType
  );
  const stateProblems = useState<ProblemContestType[]>([]);
  const [problems, setProblems] = stateProblems;
  const [contest, setContest] = stateContest;
  const { title } = contest;

  const stateLoading = useState(true);
  const [loading, setLoading] = stateLoading;

  const [cooldownIntv, setCooldownIntv] = useState<NodeJS.Timer>();
  const [cooldown, setCooldown] = useState(0);
  const [submitted, setSubmitted] = useState(0);

  const stateAnswerLoading = useState<string | null>();
  const [answerLoading, setAnswerLoading] = stateAnswerLoading;

  const router = useRouter();

  const { problemSubmissions } = useListenContestSubmission(contestId);

  const handleCheckAnswer = useCallback(
    async (problemId: string, answer: any) => {
      const now = new Date().getTime();

      if (submitted && now - submitted <= 1000 * 5) {
        setCooldown(Math.max(0, submitted + 1000 * 5 - now));
        return null;
      }

      setCooldown(1000 * 5);

      let verdict = false;
      setAnswerLoading(problemId);

      await API("post_contest_answer", {
        body: {
          contestId,
          problemId,
          answer,
        },
      })
        .then((res) => {
          console.log("Verdict ", res.data.message);
          if (res.data.message === "correct") {
            verdict = true;
          }
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setAnswerLoading(null);
        });

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
    [submitted, setAnswerLoading, contestId, cooldownIntv]
  );

  const renderListProblems = useMemo(() => {
    return (
      <div className="flex-1 grid grid-cols-1 gap-8">
        {loading ? (
          <>
            <ProblemCardSkeleton />
            <ProblemCardSkeleton />
            <ProblemCardSkeleton />
            <ProblemCardSkeleton />
          </>
        ) : (
          problems.map((p) => (
            <ContestProblemsProblemCard
              key={p.problem.id}
              problem={p.problem as any}
              onSubmit={handleCheckAnswer}
              cooldown={cooldown}
              loading={answerLoading === p.problem.id}
            />
          ))
        )}
      </div>
    );
  }, [answerLoading, cooldown, handleCheckAnswer, loading, problems]);

  const handleGoBack = useCallback(() => {
    if (window.history?.length) {
      router.back();
    } else {
      router.replace("/");
    }
  }, [router]);

  const handleGetContests = useCallback(async () => {
    if (!loading) return;

    setLoading(true);

    await API("get_contest", {
      params: {
        id: contestId,
      },
    })
      .then(({ data }) => {
        if (!data) throw Error("");

        const { id } = data;
        setContest(data as any);
        setProblems(
          data.problemsData.sort((pd1, pd2) => pd1.order - pd2.order)
        );
        setLoading(false);

        return id;
      })
      .catch(() => null);
  }, [loading, setLoading, contestId, setContest, setProblems]);

  useEffect(() => {
    handleGetContests();
  }, [handleGetContests]);

  const renderQuestionMetadata = useMemo(() => {
    const className =
      "flex flex-col flex-grow md:max-w-[320px] gap-8 h-fit lg:sticky lg:top-0";

    if (loading || !contest)
      return <ContestDetailMainSkeleton className={className} />;

    return (
      <div className={className}>
        <ContestProblemsData
          contest={contest as unknown as ContestDatabaseType}
        />
        <ContestProblemsList
          problems={problems}
          submission={problemSubmissions}
          userId={user?.id}
        />
      </div>
    );
  }, [contest, loading, problems, problemSubmissions, user]);

  return (
    <PageTemplate title={title} className="w-full">
      <div className="relative flex flex-row flex-wrap gap-8">
        {renderListProblems}
        {renderQuestionMetadata}
      </div>
    </PageTemplate>
  );
}
