import { ReactNode, useCallback, useState } from "react";
import { validateFormContest } from "@/utils";
import {
  ContentEditType,
  ContentViewType,
  StateType,
  ContestDatabaseType,
  ContestType,
  ProblemType,
  ProblemContestType,
} from "@/types";
import { CONTEST_DEFAULT } from "@/consts";
import { Formik } from "formik";
import {
  ContestEditForm,
  ContestEditFormProps,
} from "./ContestCreateEditorForm";
import { crudData } from "@/libs/firebase";
import { useRouter } from "next/router";
import { Card } from "@/components";
import { useAppSelector } from "@/libs/redux";
import { useDebounce } from "@/hooks";
import { API } from "@/api";

interface ContestEditProps extends Partial<ContestEditFormProps> {
  headElement?: ReactNode;
  stateMode?: StateType<ContentViewType>;
  stateContest?: StateType<ContestType>;
  purpose: ContentEditType;
}

export function ContestEdit({
  headElement,
  stateMode,
  stateContest,
  contest,
  purpose,
  ...rest
}: ContestEditProps) {
  const stateLoading = useState(false);
  const setLoading = stateLoading[1];
  const router = useRouter();
  const user = useAppSelector("user");
  const stateProblems = useState<ProblemContestType[]>([]);
  const problems = stateProblems[0];
  const debounce = useDebounce();

  const handleSubmit = useCallback(
    async (values: ContestType) => {
      // setLoading(true);

      const common: Partial<ContestType> = {
        createdAt: new Date().getTime(),
        authorId: user?.id,
        // problems: problems.reduce(
        //   (prev, curr) => ({
        //     ...prev,
        //     [curr.id]: curr.score,
        //   }),
        //   {}
        // ),
      };

      const completeValues =
        purpose === "create"
          ? {
              ...CONTEST_DEFAULT,
              ...values,
              ...common,
            }
          : {
              ...values,
              ...common,
            };

      console.log("Creating Events:");
      console.log(completeValues);

      await API("post_contest", {
        body: completeValues as any,
      })
        .then(() => {
          console.log("OK");
        })
        .catch((e) => {
          console.log("Nope");
          console.log(e);
        });
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
    [purpose, user?.id]
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
        <ContestEditForm
          stateMode={stateMode}
          stateLoading={stateLoading}
          stateProblems={stateProblems}
          {...rest}
        />
      </Formik>
    </Card>
  );
}
