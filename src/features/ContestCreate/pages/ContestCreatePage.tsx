import { useCallback, useMemo, useState } from "react";
import { ContestDatabaseType, ContestType, ProblemContestType } from "@/types";
import { CONTEST_DEFAULT } from "@/consts";
import { PageTemplate } from "@/templates";
import { ContestCreateEditor } from "../components";
import { useDebounce } from "@/hooks";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/libs/redux";
import { API } from "@/api";

export function ContestCreatePage() {
  const stateContest = useState<ContestType>(CONTEST_DEFAULT);
  const contest = stateContest[0];
  const stateProblems = useState<ProblemContestType[]>([]);

  const stateLoading = useState(false);
  const [, setLoading] = stateLoading;
  const debounce = useDebounce();
  const router = useRouter();
  const user = useAppSelector("user");

  const renderHead = useMemo(() => {
    return <h1 className="mb-8">Create Contest</h1>;
  }, []);

  const handleSubmit = useCallback(
    async (values: ContestType) => {
      if (!user) return;

      await API("post_contest", {
        body: {
          ...values,
          authorId: user.id,
        },
      })
        .then(({ data }) => {
          debounce(() => {
            if (data.id) router.replace(`/contest/${data.id}`);
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
    <PageTemplate title="Create Contest">
      <ContestCreateEditor
        headElement={renderHead}
        contest={contest}
        onSubmit={handleSubmit}
        stateLoading={stateLoading}
        stateProblems={stateProblems}
      />
    </PageTemplate>
  );
}
