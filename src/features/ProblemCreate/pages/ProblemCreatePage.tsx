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
import { Button } from "@/components";
import { PROBLEM_PLACEHOLDERS } from "@/libs/firebase/placeholders";

export function ProblemCreatePage() {
  const stateProblem = useState<ProblemType>(
    PROBLEM_BLANK as unknown as ProblemType
  );

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

      await API("post_problem", {
        body: {
          ...values,
          authorId: user.id,
        },
      })
        .then(({ data }) => {
          debounce(() => {
            if (data.id) router.replace(`/problem/${data.id}`);
          });
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    },
    [debounce, router, setLoading, user]
  );

  return (
    <PageTemplate>
      <Button
        onClick={async () => {
          await API("post_problems", {
            body: [PROBLEM_PLACEHOLDERS[0], PROBLEM_PLACEHOLDERS[0]],
          });
        }}
      >
        Test
      </Button>
      <ProblemCreateEditor
        headElement={renderHead}
        stateProblem={stateProblem}
        stateLoading={stateLoading}
        onSubmit={handleSubmit}
      />
    </PageTemplate>
  );
}
