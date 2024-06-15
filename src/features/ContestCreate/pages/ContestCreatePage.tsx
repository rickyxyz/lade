import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/libs/redux";
import { API } from "@/api";
import { useDebounce } from "@/hooks";
import { ContestType, ProblemContestType } from "@/types";
import { CONTEST_DEFAULT } from "@/consts";
import { ContestCreateEditor } from "../components";
import { PageTemplate } from "@/templates";
import { ButtonIcon } from "@/components";
import { KeyboardBackspace } from "@mui/icons-material";
import { addToast } from "@/utils";

export function ContestCreatePage() {
  const stateContest = useState<ContestType>(CONTEST_DEFAULT);
  const contest = stateContest[0];
  const stateProblems = useState<ProblemContestType[]>([]);
  const stateTab = useState<"main" | "problems">("main");
  const [tab, setTab] = stateTab;
  const stateLoading = useState(false);
  const setLoading = stateLoading[1];
  const debounce = useDebounce();
  const router = useRouter();
  const user = useAppSelector("user");

  const handleSubmit = useCallback(
    async (values: ContestType) => {
      if (!user) return;

      API(
        "post_contest",
        {
          body: {
            ...values,
            authorId: user.id,
          },
        },
        {
          onSuccess({ data }) {
            debounce(() => {
              if (data.id) {
                router.replace(`/contest/${data.id}`);
                addToast({ text: "Contest created." });
              }
            });
          },
          onFail: () => {
            setLoading(true);
            addToast({ text: "Could not create the contest." });
          },
          showFailMessage: false,
        }
      );
    },
    [debounce, router, setLoading, user]
  );

  const renderTitle = useMemo(
    () => (tab === "problems" ? "Import Problems" : "Create Contest"),
    [tab]
  );

  const renderLeftAction = useMemo(
    () =>
      tab === "problems" ? (
        <div className="mr-2">
          <ButtonIcon
            size="xs"
            variant="ghost"
            icon={KeyboardBackspace}
            onClick={() => {
              setTab("main");
            }}
          />
        </div>
      ) : (
        <></>
      ),
    [setTab, tab]
  );

  return (
    <PageTemplate title={renderTitle} leftTitle={renderLeftAction}>
      <ContestCreateEditor
        contest={contest}
        onSubmit={handleSubmit}
        stateLoading={stateLoading}
        stateProblems={stateProblems}
        stateTab={stateTab}
      />
    </PageTemplate>
  );
}
