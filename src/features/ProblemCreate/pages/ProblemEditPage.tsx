import { useCallback, useMemo, useState } from "react";
import { PROBLEM_BLANK } from "@/consts";
import { ProblemCreateEditor } from "../components";
import { PageTemplate } from "@/templates";
import { ProblemType, StateType } from "@/types";
import { crudData } from "@/libs/firebase";
import { useDebounce } from "@/hooks";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { API } from "@/api";

export function ProblemEditPage({
  stateProblem,
  onEdit,
  onLeaveEditor,
}: {
  stateProblem: StateType<ProblemType>;
  onEdit?: () => void;
  onLeaveEditor?: () => void;
}) {
  const setProblem = stateProblem[1];

  const stateLoading = useState(false);
  const [, setLoading] = stateLoading;
  const debounce = useDebounce();
  const router = useRouter();

  const renderHead = useMemo(() => {
    return <h1 className="mb-8">Edit Problem</h1>;
  }, []);

  const handleSubmit = useCallback(
    async (values: ProblemType) => {
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
    <PageTemplate>
      <ProblemCreateEditor
        headElement={renderHead}
        stateProblem={stateProblem}
        stateLoading={stateLoading}
        onSubmit={handleSubmit}
        onLeaveEditor={onLeaveEditor}
        disableEditId
      />
    </PageTemplate>
  );
}
