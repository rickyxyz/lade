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
              attempts: 0,
              score: 0,
              submittedAt: new Date().getTime(),
            },
            ...(problemSubmissions[problemId] ?? {}),
          })),
          totalScore: Object.entries(problemSubmissions).reduce(
            (prev, [_id, { finalScore = 0, official }]) =>
              official ? finalScore + prev : prev,
            0
          ),
        };
        userSubmissions.push(participant);
      });

      userSubmissions.sort((a, b) => b.totalScore - a.totalScore);

      console.log(userSubmissions);

      return userSubmissions;
    },
    [problemsData]
  );

  const handleCalculateScore = useCallback(
    (
      { answer, attempts, score }: ContestSingleSubmissionType,
      official?: boolean
    ) => {
      // if(!official) return 0;

      return score - attempts;
    },
    []
  );

  useEffect(() => {
    const docRef = ref(rb, `contests/${contestId}`);

    const listener = onValue(docRef, (snapshot) => {
      const rawData: ContestSubmissionType = snapshot.val();

      const end = new Date(endDate).getTime();

      Object.entries(rawData).forEach(([problemId, problemSubmissions]) => {
        Object.entries(problemSubmissions).forEach(
          ([userId, userSubmission]) => {
            const official = userSubmission.submittedAt
              ? end > userSubmission.submittedAt
              : false;

            rawData[problemId][userId] = {
              ...rawData[problemId][userId],
              finalScore: handleCalculateScore(userSubmission, official),
              official,
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
  }, [contestId, endDate, handleCalculateScore, handleMakeUserList, onUpdate]);

  return useMemo(() => data, [data]);
}
