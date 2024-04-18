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

export function useListenContestSubmission(contest: ContestDatabaseType) {
  const { id: contestId, problemsData = [] } = contest;

  const [data, setData] = useState<ContestSubmissionType>();

  const users = useMemo(() => {
    if (!data) return [];

    const result: ContestSubmissionType = {};
    const userSubmissions: ContestParticipantType[] = [];
    Object.entries(data).forEach(([problemId, problemSubmissions]) => {
      Object.entries(problemSubmissions).forEach(([userId, userSubmission]) => {
        if (!result[userId]) result[userId] = {};
        result[userId][problemId] = userSubmission;
      });
    });

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
          (prev, [_id, { finalScore = 0 }]) => finalScore + prev,
          0
        ),
      };
      userSubmissions.push(participant);
    });

    userSubmissions.sort((a, b) => b.totalScore - a.totalScore);

    console.log(userSubmissions);
    return userSubmissions;
  }, [data, problemsData]);

  const handleCalculateScore = useCallback(
    ({ answer, attempts, score, submittedAt }: ContestSingleSubmissionType) => {
      console.log("Attempts: ", score - attempts);
      return score - attempts;
    },
    []
  );

  useEffect(() => {
    const docRef = ref(rb, `contests/${contestId}`);

    const listener = onValue(docRef, (snapshot) => {
      const rawData: ContestSubmissionType = snapshot.val();

      Object.entries(rawData).forEach(([problemId, problemSubmissions]) => {
        Object.entries(problemSubmissions).forEach(
          ([userId, userSubmission]) => {
            console.log(userSubmission);
            rawData[problemId][userId] = {
              ...rawData[problemId][userId],
              finalScore: handleCalculateScore(userSubmission),
            };
          }
        );
      });

      setData(rawData);
    });

    return () => {
      listener();
    };
  }, [contestId, handleCalculateScore]);

  return useMemo(
    () => ({
      problemSubmissions: data,
      userSubmissions: users,
    }),
    [data, users]
  );
}
