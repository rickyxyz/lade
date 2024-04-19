/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { API } from "@/api";
import { ProblemCardSkeleton } from "@/features/ProblemList";
import { ButtonListEntry, Card, Paragraph } from "@/components";
import {
  ContestType,
  UserType,
  ProblemContestType,
  ContentAccessType,
  ContestDatabaseType,
} from "@/types";
import { CONTEST_DEFAULT } from "@/consts";
import { PageTemplate } from "@/templates";
import { useListenContestSubmission } from "../../ContestDetail/hooks";
import clsx from "clsx";
import { ContestScoreboard } from "../components";
import { ContestDetailMainSkeleton } from "@/features/ContestDetail";
import { ContestDetailData } from "@/features/ContestDetail/components/ContestDetailData";

interface ContestProps {
  contestId: string;
  user?: UserType | null;
}

export function ContestScoreboardPage({ contestId, user }: ContestProps) {
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

  const { userSubmissions } = useListenContestSubmission(
    contest as unknown as ContestDatabaseType
  );

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

  const renderScoreboard = useMemo(() => {
    const className = "flex-1";

    if (loading || !contest)
      return <ContestDetailMainSkeleton className={className} />;

    return (
      <Card className={className}>
        <ContestScoreboard
          contest={contest as unknown as ContestDatabaseType}
          userSubmissions={userSubmissions}
        />
      </Card>
    );
  }, [contest, loading, userSubmissions]);

  const renderContestMetadata = useMemo(() => {
    const className = "flex-grow md:max-w-[320px] h-fit lg:sticky lg:top-0";

    if (loading || !contest)
      return <ContestDetailMainSkeleton className={className} />;

    return (
      <ContestDetailData
        className={className}
        contest={contest as unknown as ContestDatabaseType}
        showAuthorMenu={!!user && contest.authorId === user?.id}
        onEdit={() => {
          //
        }}
        onDelete={() => {
          //
        }}
      />
    );
  }, [contest, loading, user]);

  return (
    <PageTemplate title={title} className="w-full">
      <div className="relative flex flex-row flex-wrap gap-8">
        {renderScoreboard}
        {renderContestMetadata}
      </div>
    </PageTemplate>
  );
}