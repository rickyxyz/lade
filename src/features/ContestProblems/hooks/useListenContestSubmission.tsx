import { rb } from "@/libs/firebase";
import { ContestSubmissionType } from "@/types";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

export function useListenContestSubmission(contestId: string) {
  const [data, setData] = useState<ContestSubmissionType>();

  useEffect(() => {
    const docRef = ref(rb, `contests/${contestId}`);

    const listener = onValue(docRef, (snapshot) => {
      setData(snapshot.val());
    });

    return () => {
      listener();
    };
  }, [contestId]);

  return data;
}
