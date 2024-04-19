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

interface ContestProps {
  contest: ContestDatabaseType;
  problems: ProblemContestType[];
  userSubmissions: ContestParticipantType[];
  user?: UserType | null;
}

export function ContestLeaderboardPage({
  contest,
  userSubmissions,
}: ContestProps) {
  const renderScoreboard = useMemo(() => {
    const className = "flex-1";

    if (!contest) return <ContestDetailMainSkeleton className={className} />;

    return (
      <Card className={className}>
        <ContestScoreboard
          contest={contest as unknown as ContestDatabaseType}
          userSubmissions={userSubmissions}
        />
      </Card>
    );
  }, [contest, userSubmissions]);

  return renderScoreboard;
}
