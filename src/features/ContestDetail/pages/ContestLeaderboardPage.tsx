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
import {
  ContestLeaderboard,
  ContestLeaderboardFreeze,
} from "../components/ContestDetailLeaderboard";
import { Loader } from "@/components/Loader";
import { useDevice } from "@/hooks";

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
  const { device } = useDevice();

  const renderLeaderboard = useMemo(() => {
    if (loading)
      return (
        <Card className="flex-1 h-fit">
          <Loader caption="fetching leaderboard" />
        </Card>
      );

    return device === "mobile" ? (
      <ContestLeaderboard
        contest={contest as unknown as ContestDatabaseType}
        userSubmissions={userSubmissions}
      />
    ) : (
      <ContestLeaderboardFreeze
        contest={contest as unknown as ContestDatabaseType}
        userSubmissions={userSubmissions}
      />
    );
  }, [contest, device, loading, userSubmissions]);

  return renderLeaderboard;
}
