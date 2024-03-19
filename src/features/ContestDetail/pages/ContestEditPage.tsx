import { useCallback, useMemo, useState } from "react";
import { API } from "@/api";
import { PageTemplate } from "@/templates";
import { ContestType, ProblemContestType, StateType } from "@/types";
import { ContestCreateEditor } from "@/features";

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
  const [, setLoading] = stateLoading;

  const renderHead = useMemo(() => {
    return <h1 className="mb-8">Edit Contest</h1>;
  }, []);

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
    <PageTemplate>
      <ContestCreateEditor
        headElement={renderHead}
        stateProblems={stateProblems}
        stateLoading={stateLoading}
        contest={contest}
        onSubmit={handleSubmit}
        onLeaveEditor={onLeaveEditor}
      />
    </PageTemplate>
  );
}
