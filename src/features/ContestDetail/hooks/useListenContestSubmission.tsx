import { useCallback, useEffect, useMemo, useState } from "react";
import { rb } from "@/libs/firebase";
import {
  ContestDatabaseType,
  ContestParticipantType,
  ContestSingleSubmissionType,
  ContestSubmissionType,
  ContestType,
} from "@/types";
import { onValue, ref } from "firebase/database";

export interface SubmissionData {
  problemSubmissions?: ContestSubmissionType;
  userSubmissions: ContestParticipantType[];
}

export function useListenContestSubmission(
  contest: ContestDatabaseType,
  onUpdate?: (data: SubmissionData) => void
) {
  const { id: contestId, problemsData = [], endDate } = contest;
  const endAt = useMemo(() => new Date(endDate).getTime(), [endDate]);
  const [data, setData] = useState<SubmissionData>({
    problemSubmissions: {},
    userSubmissions: [],
  });

  const handleMakeUserList = useCallback(
    (problemSubmissions: ContestSubmissionType) => {
      if (!problemSubmissions) return [];

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
          answers: problemsData.map(({ problem: { id: problemId } }) => ({
            ...{
              answer: "",
              attempts: [],
              score: 0,
            },
            ...(problemSubmissions[problemId] ?? {}),
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
        // if (b.totalScore === a.totalScore)
        //   return b.unofficialScore - a.unofficialScore;

        return b.totalScore - a.totalScore;
      });

      return userSubmissions;
    },
    [problemsData]
  );

  const handleCalculateScore = useCallback(
    ({ attempts = [] }: ContestSingleSubmissionType) => {
      const attemptCount = attempts.length;
      let officialScore = 0;
      let unofficialScore = 0;
      attempts.forEach(({ score = 0, submittedAt }) => {
        if (endAt > submittedAt) {
          officialScore =
            Math.max(score, officialScore) -
            attempts.filter((attempt) => endAt > attempt.submittedAt).length +
            1;
        }
        unofficialScore = Math.max(score, unofficialScore) - attemptCount + 1;
      });

      return [officialScore, unofficialScore];
    },
    [endAt]
  );

  useEffect(() => {
    const docRef = ref(rb, `contests/${contestId}`);

    const listener = onValue(docRef, (snapshot) => {
      const rawData: ContestSubmissionType = snapshot.val();

      Object.entries(rawData).forEach(([problemId, problemSubmissions]) => {
        Object.entries(problemSubmissions).forEach(
          ([userId, userSubmission]) => {
            const [finalScore, unofficialScore] =
              handleCalculateScore(userSubmission);
            rawData[problemId][userId] = {
              ...rawData[problemId][userId],
              score: finalScore,
              unofficialScore,
              unofficialCount: (userSubmission.attempts ?? []).filter(
                ({ submittedAt }) => {
                  return endAt <= submittedAt;
                }
              ).length,
            };
          }
        );
      });

      const newData: SubmissionData = {
        problemSubmissions: rawData,
        userSubmissions: handleMakeUserList(rawData),
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
