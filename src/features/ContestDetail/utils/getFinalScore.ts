import { ContestSingleSubmissionType } from "@/types";

type ScoreStatusType = "success" | "attempted" | undefined;

export function getFinalScore(
  submission?: ContestSingleSubmissionType,
  isOfficialOnly = false
): {
  attemptCount: number;
  displayScore?: number | string;
  isOfficial: boolean;
  status: ScoreStatusType;
} {
  if (!submission)
    return {
      attemptCount: 0,
      displayScore: "-",
      isOfficial: true,
      status: undefined,
    };

  const {
    score,
    unofficialScore = 0,
    attempts,
    unofficialCount = 0,
  } = submission;
  const officialCount = attempts.length - unofficialCount;

  if (isOfficialOnly || score !== 0) {
    return {
      attemptCount: officialCount,
      displayScore: score,
      isOfficial: true,
      status:
        score > 0 ? "success" : officialCount > 0 ? "attempted" : undefined,
    };
  } else {
    return {
      attemptCount: unofficialCount,
      displayScore: unofficialScore !== 0 ? unofficialScore : "-",
      isOfficial: false,
      status:
        unofficialScore > 0
          ? "success"
          : unofficialCount > 0
          ? "attempted"
          : undefined,
    };
  }
}
