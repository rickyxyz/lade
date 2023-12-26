import { useCallback, useMemo, useState } from "react";
import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { ProblemCreateEditor } from "../components";
import { PageTemplate } from "@/templates";
import { ProblemType, StateType } from "@/types";
import { crudData } from "@/libs/firebase";
import { useDebounce } from "@/hooks";
import { useRouter } from "next/router";

export function ProblemEditPage({
  stateProblem,
}: {
  stateProblem: StateType<ProblemType>;
}) {
  const problem = stateProblem[0];

  const stateLoading = useState(false);
  const [, setLoading] = stateLoading;
  const debounce = useDebounce();
  const router = useRouter();

  const renderHead = useMemo(() => {
    return <h1 className="mb-8">Edit Problem</h1>;
  }, []);

  const handleSubmit = useCallback(
    async (values: ProblemType) => {
      const { id } = problem;
      await crudData("update_problem", {
        id: id ?? "invalid",
        data: values,
      })
        .then(async () => {
          setLoading(false);
          debounce(() => {
            router.replace(`/problem/${id}`);
          });
        })
        .catch(() => {
          setLoading(false);
        });
    },
    [debounce, problem, router, setLoading]
  );

  return (
    <PageTemplate>
      <ProblemCreateEditor
        headElement={renderHead}
        stateProblem={stateProblem}
        stateLoading={stateLoading}
        onSubmit={handleSubmit}
      />
    </PageTemplate>
  );
}
