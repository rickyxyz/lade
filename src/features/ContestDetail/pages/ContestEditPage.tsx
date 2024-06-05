import { useCallback, useMemo, useState } from "react";
import { API } from "@/api";
import { ContestCreateEditor } from "@/features";
import { ContestType, ProblemContestType, StateType } from "@/types";
import { ButtonIcon } from "@/components";
import { KeyboardBackspace } from "@mui/icons-material";
import { PageTemplate } from "@/templates";

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
