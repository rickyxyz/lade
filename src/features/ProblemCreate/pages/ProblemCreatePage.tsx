import { useCallback, useMemo, useState } from "react";
import { PROBLEM_BLANK } from "@/consts";
import { ProblemCreateEditor } from "../components";
import { PageTemplate } from "@/templates";
import { ProblemType } from "@/types";
import { crudData } from "@/libs/firebase";
import { useDebounce } from "@/hooks";
import { useRouter } from "next/router";
import { api } from "@/utils/api";

export function ProblemCreatePage() {
  const stateProblem = useState<ProblemType>(
    PROBLEM_BLANK as unknown as ProblemType
  );

  const stateLoading = useState(false);
  const [, setLoading] = stateLoading;
  const debounce = useDebounce();
  const router = useRouter();

  const renderHead = useMemo(() => {
    return <h1 className="mb-8">Create Problem</h1>;
  }, []);

  const handleSubmit = useCallback(
    async (values: ProblemType) => {
      await api
        .post("/problem", {
          ...values,
          authorId: "placeholder",
        })
        .then(() => {
          const { id } = values;
          debounce(() => {
            setLoading(false);
            if (id) router.replace(`/problem/${id}`);
          });
        })
        .catch(() => {
          setLoading(false);
        });
    },
    [debounce, router, setLoading]
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
