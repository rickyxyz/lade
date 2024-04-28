import { useCallback, useEffect, useMemo, useState } from "react";
import { rb } from "@/libs/firebase";
import {
  ContestDatabaseType,
  ContestParticipantObjectType,
  ContestParticipantType,
  ContestSingleSubmissionType,
  ContestSubmissionType,
  ContestType,
} from "@/types";
import { onValue, ref } from "firebase/database";

export interface SubmissionData {
  problemSubmissions: ContestSubmissionType;
  userSubmissionsArray: ContestParticipantType[];
  userSubmissions: ContestSubmissionType;
}

export function useListenContestSubmission(
  contest: ContestDatabaseType,
  onUpdate?: (data: SubmissionData) => void
) {
  const { id: contestId, problemsData = [], startDate, endDate } = contest;
  const startAt = useMemo(() => new Date(startDate).getTime(), [startDate]);
  const endAt = useMemo(() => new Date(endDate).getTime(), [endDate]);
  const [data, setData] = useState<SubmissionData>({
    problemSubmissions: {},
    userSubmissionsArray: [],
    userSubmissions: {},
  });

  const handleMakeUserList = useCallback(
    (problemSubmissions: ContestSubmissionType) => {
      if (!problemSubmissions)
        return {
          userSubmissionsArray: [],
          userSubmissions: {},
        };

      const result: ContestSubmissionType = {};
      const userSubmissions: ContestParticipantType[] = [];
      Object.entries(problemSubmissions).forEach(
        ([problemId, problemSubmissions]) => {
          Object.entries(problemSubmissions).forEach(
            ([userId, userSubmission]) => {
              if (!result[userId]) result[userId] = {};
              result[userId][problemId] = userSubmission;
            }
          );
        }
      );

      Object.entries(result).forEach(([userId, problemSubmissions]) => {
        const participant: ContestParticipantType = {
          userId,
          totalPenalty: Math.floor(
            Object.entries(problemSubmissions).reduce(
              (prev, [, { penalty }]) => penalty + prev,
              0
            ) / 1000
          ),
          answers: problemsData.map(({ problem: { id: problemId } }) => ({
            ...{
              answer: "",
              attempts: [],
              score: 0,
            },
            ...(problemSubmissions[problemId] ?? {}),
            problemId: String(problemId),
          })),
          totalScore: Object.entries(problemSubmissions).reduce(
            (prev, [, { score = 0 }]) => score + prev,
            0
          ),
          unofficialScore: Object.entries(problemSubmissions).reduce(
            (prev, [, { unofficialScore = 0 }]) => unofficialScore + prev,
            0
          ),
        };
        userSubmissions.push(participant);
      });

      userSubmissions.sort((a, b) => {
        // let weightsA = a.totalScore - a.totalPenalty;
        // let weightsA = a.totalScore - a.totalPenalty;
        if (b.totalScore === a.totalScore) {
          if (b.totalPenalty === a.totalPenalty) {
            return b.unofficialScore - a.unofficialScore;
          }

          return a.totalPenalty - b.totalPenalty;
        }

        return b.totalScore - a.totalScore;
      });

      return {
        userSubmissionsArray: userSubmissions,
        userSubmissions: result,
      };
    },
    [problemsData]
  );

  const handleCalculateScore = useCallback(
    ({ attempts = [] }: ContestSingleSubmissionType) => {
      const attemptCount = attempts.length;
      let officialScore = 0;
      let unofficialScore = 0;
      let penalty = 0;
      attempts.forEach(({ score = 0, submittedAt }) => {
        if (endAt > submittedAt) {
          officialScore =
            Math.max(score, officialScore) -
            attempts.filter((attempt) => endAt > attempt.submittedAt).length +
            1;
          if (score === 0) officialScore--;
          if (officialScore > 0) {
            penalty = submittedAt - startAt;
          }
        }
        unofficialScore = Math.max(score, unofficialScore);
        if (score === 0) unofficialScore--;
      });

      return [officialScore, unofficialScore, penalty];
    },
    [endAt, startAt]
  );

  useEffect(() => {
    const docRef = ref(rb, `contests/${contestId}`);

    const listener = onValue(docRef, (snapshot) => {
      const rawData: ContestSubmissionType = snapshot.val();

      Object.entries(rawData).forEach(([problemId, problemSubmissions]) => {
        Object.entries(problemSubmissions).forEach(
          ([userId, userSubmission]) => {
            const [finalScore, unofficialScore, penalty] =
              handleCalculateScore(userSubmission);
            rawData[problemId][userId] = {
              ...rawData[problemId][userId],
              score: finalScore,
              unofficialScore,
              penalty,
              unofficialCount: (userSubmission.attempts ?? []).filter(
                ({ submittedAt }) => {
                  return endAt <= submittedAt;
                }
              ).length,
            };
          }
        );
      });

      const { userSubmissionsArray, userSubmissions } =
        handleMakeUserList(rawData);
      const newData: SubmissionData = {
        problemSubmissions: rawData,
        userSubmissions,
        userSubmissionsArray,
      };

      onUpdate && onUpdate(newData);
      setData(newData);
    });

    return () => {
      listener();
    };
  }, [contestId, endAt, handleCalculateScore, handleMakeUserList, onUpdate]);

  return useMemo(() => data, [data]);
}
