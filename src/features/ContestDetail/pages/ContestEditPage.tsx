import { useCallback, useMemo, useState } from "react";
import { API } from "@/api";
import { ContestCreateEditor } from "@/features";
import { ContestType, ProblemContestType, StateType } from "@/types";
import { ButtonIcon } from "@/components";
import { KeyboardBackspace } from "@mui/icons-material";
import { PageTemplate } from "@/templates";
import { addToast } from "@/utils";

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
  const stateTab = useState<"main" | "problems">("main");
  const [tab, setTab] = stateTab;

  const handleSubmit = useCallback(
    (values: ContestType) => {
      API(
        "patch_contest",
        {
          body: values,
        },
        {
          onSuccess() {
            setLoading(false);
            setContest(values);
            onEdit && onEdit();
            addToast({ text: "Contest updated." });
          },
          onFail() {
            setLoading(false);
            addToast({ text: "Could not update the contest." });
          },
          showFailMessage: false,
        }
      );
    },
    [onEdit, setLoading, setContest]
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
        title="Edit Page"
        stateProblems={stateProblems}
        stateLoading={stateLoading}
        contest={contest}
        onSubmit={handleSubmit}
        onLeaveEditor={onLeaveEditor}
        stateTab={stateTab}
      />
    </PageTemplate>
  );
}
