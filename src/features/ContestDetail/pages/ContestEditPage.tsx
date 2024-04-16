import { useCallback, useState } from "react";
import { API } from "@/api";
import { ContestCreateEditor } from "@/features";
import { ContestType, ProblemContestType, StateType } from "@/types";

export function ContestEditPage({
  stateContest,
  stateProblems,
  onEdit,
  onLeaveEditor,
}: {
  stateContest: StateType<ContestType>;
  stateProblems: StateType<ProblemContestType[]>;
  onEdit?: () => void;
  onLeaveEditor?: () => void;
}) {
  const [contest, setContest] = stateContest;
  const stateLoading = useState(false);
  const setLoading = stateLoading[1];

  const handleSubmit = useCallback(
    async (values: ContestType) => {
      console.log("handle submit");

      await API("patch_contest", {
        body: values,
      })
        .then(() => {
          setLoading(false);
          setContest(values);
          onEdit && onEdit();
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    },
    [onEdit, setLoading, setContest]
  );

  return (
    <ContestCreateEditor
      title="Edit Page"
      stateProblems={stateProblems}
      stateLoading={stateLoading}
      contest={contest}
      onSubmit={handleSubmit}
      onLeaveEditor={onLeaveEditor}
    />
  );
}
