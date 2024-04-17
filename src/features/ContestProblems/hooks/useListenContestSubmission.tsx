import { useCallback, useEffect, useMemo, useState } from "react";
import { rb } from "@/libs/firebase";
import { ContestSingleSubmissionType, ContestSubmissionType } from "@/types";
import { onValue, ref } from "firebase/database";

export function useListenContestSubmission(contestId: string) {
  const [data, setData] = useState<ContestSubmissionType>();

  const users = useMemo(() => {
    if (!data) return [];

    const result: ContestSubmissionType = {};
    Object.entries(data).forEach(([problemId, problemSubmissions]) => {
      Object.entries(problemSubmissions).forEach(([userId, userSubmission]) => {
        result[userId][problemId] = userSubmission;
      });
    });

    return result;
  }, [data]);

  useEffect(() => {
    const docRef = ref(rb, `contests/${contestId}`);

    const listener = onValue(docRef, (snapshot) => {
      setData(snapshot.val());
    });

    return () => {
      listener();
    };
  }, [contestId]);

  return useMemo(
    () => ({
      problemSubmissions: data,
      userSubmissions: users,
      problemCount: Object.values(data ?? {}).length,
      userCount: Object.values(users ?? {}).length,
    }),
    [data, users]
  );
}
