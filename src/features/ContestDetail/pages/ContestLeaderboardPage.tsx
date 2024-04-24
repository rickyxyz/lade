/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { Card } from "@/components";
import {
  UserType,
  ProblemContestType,
  ContestDatabaseType,
  ContestParticipantType,
  StateType,
} from "@/types";
import { ContestLeaderboard } from "../components/ContestDetailLeaderboard";
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
  const renderLeaderboard = useMemo(() => {
    if (loading) return <Loader caption="fetching leaderboard" />;

    return (
      <ContestLeaderboard
        contest={contest as unknown as ContestDatabaseType}
        userSubmissions={userSubmissions}
      />
    );
  }, [contest, loading, userSubmissions]);

  return <Card className="flex-1 h-fit">{renderLeaderboard}</Card>;
}
