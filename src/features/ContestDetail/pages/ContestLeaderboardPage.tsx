/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { ContestDetailMainSkeleton } from "@/features/ContestDetail";
import { Card } from "@/components";
import {
  UserType,
  ProblemContestType,
  ContestDatabaseType,
  ContestParticipantType,
} from "@/types";
import { ContestScoreboard } from "../components/ContestDetailLeaderboard";
import { Loader } from "@/components/Loader";

interface ContestProps {
  contest: ContestDatabaseType;
  problems: ProblemContestType[];
  userSubmissions: ContestParticipantType[];
  user?: UserType | null;
  loading?: boolean;
}

export function ContestLeaderboardPage({
  contest,
  userSubmissions,
  loading,
}: ContestProps) {
  const renderScoreboard = useMemo(() => {
    if (loading) return <Loader caption="fetching leaderboard" />;

    return (
      <ContestScoreboard
        contest={contest as unknown as ContestDatabaseType}
        userSubmissions={userSubmissions}
      />
    );
  }, [contest, loading, userSubmissions]);

  return <Card className="flex-1 h-fit">{renderScoreboard}</Card>;
}
