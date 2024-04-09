import { ReactNode, useCallback, useMemo, useState } from "react";
import { validateFormContest } from "@/utils";
import {
  ContentEditType,
  ContentViewType,
  StateType,
  ContestType,
  ProblemContestType,
} from "@/types";
import { CONTEST_DEFAULT } from "@/consts";
import { Formik } from "formik";
import {
  ContestCreateEditorForm,
  ContestEditFormProps,
} from "./ContestCreateEditorForm";
import { ButtonIcon, Card } from "@/components";
import { useAppSelector } from "@/libs/redux";
import { CardTab, CardTabType } from "@/components/Card/CardTab";
import { PageTemplate } from "@/templates";
import {
  ArrowLeft,
  KeyboardArrowLeft,
  KeyboardBackspace,
} from "@mui/icons-material";

interface ContestEditProps extends Omit<ContestEditFormProps, "stateTab"> {
  title?: string;
  stateMode?: StateType<ContentViewType>;
  stateLoading: StateType<boolean>;
  onSubmit: (problem: ContestType) => void;
}

export function ContestCreateEditor({
  title = "Create Contest",
  stateMode,
  stateLoading,
  contest,
  onSubmit,
  ...rest
}: ContestEditProps) {
  const setLoading = stateLoading[1];
  const user = useAppSelector("user");
  const stateTab = useState<"main" | "problems">("main");
  const [tab, setTab] = stateTab;

  const handleSubmit = useCallback(
    async (values: ContestType) => {
      if (!user) return;

      setLoading(true);

      const common: Partial<ContestType> = {
        createdAt: new Date().getTime(),
        ...values,
        authorId: user?.id,
        // problems: problems.reduce(
        //   (prev, curr) => ({
        //     ...prev,
        //     [curr.id]: curr.score,
        //   }),
        //   {}
        // ),
      };

      const completeValues = {
        ...CONTEST_DEFAULT,
        ...common,
      };

      onSubmit(completeValues as ContestType);
      // if (purpose === "create") {
      //   await crudData("set_contest", {
      //     data: completeValues as unknown as ContestDatabaseType,
      //   })
      //     .then(async (res) => {
      //       debounce(() => {
      //         setLoading(false);
      //         if (res && res.id) router.replace(`/contest/${res.id}`);
      //       });
      //     })
      //     .catch(() => {
      //       setLoading(false);
      //     });
      // } else if (contest) {
      //   const { id } = contest as unknown as ContestDatabaseType;
      //   await crudData("update_contest", {
      //     id: id ?? "invalid",
      //     data: completeValues as unknown as ContestDatabaseType,
      //   })
      //     .then(async () => {
      //       setLoading(false);
      //       debounce(() => {
      //         router.replace(`/problem/${id}`);

      //         if (stateMode && stateContest) {
      //           const setMode = stateMode[1];
      //           const setContest = stateContest[1];
      //           setMode("view");
      //           setContest((prev) => ({
      //             ...prev,
      //             ...(completeValues as unknown as ContestType),
      //           }));
      //         }
      //       });
      //     })
      //     .catch(() => {
      //       setLoading(false);
      //     });
      // }
    },
    [onSubmit, setLoading, user]
  );

  const renderTitle = useMemo(
    () => (tab === "problems" ? "Edit Contest Problems" : title),
    [tab, title]
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
      <Formik
        initialValues={contest ?? CONTEST_DEFAULT}
        validate={validateFormContest}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={false}
      >
        <ContestCreateEditorForm
          stateTab={stateTab}
          stateMode={stateMode}
          stateLoading={stateLoading}
          contest={contest}
          {...rest}
        />
      </Formik>
    </PageTemplate>
  );
}
