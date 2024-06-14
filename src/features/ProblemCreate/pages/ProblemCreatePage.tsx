import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PROBLEM_BLANK } from "@/consts";
import { ProblemCreateEditor } from "../components";
import { PageTemplate } from "@/templates";
import { ProblemType } from "@/types";
import { crudData } from "@/libs/firebase";
import { useDebounce } from "@/hooks";
import { api } from "@/utils/api";
import { useAppSelector } from "@/libs/redux";
import { API } from "@/api";

export function ProblemCreatePage() {
  const stateProblem = useState<ProblemType>(
    PROBLEM_BLANK as unknown as ProblemType
  );
  const problem = stateProblem[0];

  const stateLoading = useState(false);
  const [, setLoading] = stateLoading;
  const debounce = useDebounce();
  const router = useRouter();
  const user = useAppSelector("user");

  const renderHead = useMemo(() => {
    return <h1 className="mb-8">Create Problem</h1>;
  }, []);

  const handleSubmit = useCallback(
    async (values: ProblemType) => {
      const { id } = values;

      if (!user) return;

      API(
        "post_problem",
        {
          body: {
            ...values,
            authorId: user.id,
          },
        },
        {
          onSuccess({ data }) {
            debounce(() => {
              if (data.id) router.replace(`/problem/${data.id}`);
            });
          },
          onFail() {
            setLoading(false);
          },
        }
      );
    },
    [debounce, router, setLoading, user]
  );

  return (
    <PageTemplate title="Create Problem">
      <div className="flex flex-row flex-wrap gap-8">
        <ProblemCreateEditor
          problem={problem}
          stateLoading={stateLoading}
          onSubmit={handleSubmit}
        />
      </div>
    </PageTemplate>
  );
}
