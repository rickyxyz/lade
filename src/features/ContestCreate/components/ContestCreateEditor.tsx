import { ReactNode, useCallback, useState } from "react";
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
import { Card } from "@/components";
import { useAppSelector } from "@/libs/redux";

interface ContestEditProps extends ContestEditFormProps {
  headElement?: ReactNode;
  stateMode?: StateType<ContentViewType>;
  stateLoading: StateType<boolean>;
  onSubmit: (problem: ContestType) => void;
}

export function ContestCreateEditor({
  headElement,
  stateMode,
  stateLoading,
  contest,
  onSubmit,
  ...rest
}: ContestEditProps) {
  const setLoading = stateLoading[1];
  const user = useAppSelector("user");

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

  return (
    <Card>
      {headElement}
      <Formik
        initialValues={contest ?? CONTEST_DEFAULT}
        validate={validateFormContest}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={false}
      >
        <ContestCreateEditorForm
          stateMode={stateMode}
          stateLoading={stateLoading}
          {...rest}
        />
      </Formik>
    </Card>
  );
}
