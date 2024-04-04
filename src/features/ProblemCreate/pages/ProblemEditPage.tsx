import { useCallback, useMemo, useState } from "react";
import { API } from "@/api";
import { PageTemplate } from "@/templates";
import { ProblemType, StateType } from "@/types";
import { ProblemCreateEditor } from "../components";

export function ProblemEditPage({
  stateProblem,
  onEdit,
  onLeaveEditor,
}: {
  stateProblem: StateType<ProblemType>;
  onEdit?: () => void;
  onLeaveEditor?: () => void;
}) {
  const [problem, setProblem] = stateProblem;

  const stateLoading = useState(true);
  const [, setLoading] = stateLoading;

  const renderHead = useMemo(() => {
    return <h1 className="mb-8">Edit Problem</h1>;
  }, []);

  const handleSubmit = useCallback(
    async (values: ProblemType) => {
      setLoading(true);
      await API("patch_problem", {
        body: values,
      })
        .then(() => {
          setLoading(false);
          setProblem(values);
          onEdit && onEdit();
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    },
    [onEdit, setLoading, setProblem]
  );

  return (
    <PageTemplate title="Edit Problem">
      <ProblemCreateEditor
        headElement={renderHead}
        problem={problem}
        stateLoading={stateLoading}
        onSubmit={handleSubmit}
        onLeaveEditor={onLeaveEditor}
        disableEditId
      />
    </PageTemplate>
  );
}
