import { useEffect, useMemo, useState } from "react";
import { rb } from "@/libs/firebase";
import { ContestSubmissionType } from "@/types";
import { onValue, ref } from "firebase/database";

export function useListenContestSubmission(contestId: string) {
  const [data, setData] = useState<ContestSubmissionType>();

  const users = useMemo(() => {
    if (!data) return [];

    const result: string[] = [];
    Object.values(data).forEach((problemSubmission) => {
      Object.keys(problemSubmission).forEach((userId) => {
        result.push(userId);
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

  return {
    submission: data,
    users,
  };
}
