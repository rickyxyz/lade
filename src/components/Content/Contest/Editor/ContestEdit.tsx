import { ReactNode, useCallback, useState } from "react";
import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { sleep, validateFormContest } from "@/utils";
import {
  ContentEditType,
  ContentViewType,
  StateType,
  ContestDatabaseType,
  ContestType,
} from "@/types";
import { CONTEST_BLANK, CONTEST_DEFAULT } from "@/consts";
import { Formik } from "formik";
import { ContestEditForm, ContestEditFormProps } from "./ContestEditForm";
import { crudData } from "@/firebase";
import { useRouter } from "next/router";
import { Card } from "@/components/Generic";
import { useAppSelector } from "@/redux/dispatch";

interface ContestEditProps extends Partial<ContestEditFormProps> {
  headElement?: ReactNode;
  stateMode?: StateType<ContentViewType>;
  stateContest?: StateType<ContestDatabaseType>;
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

  const handleSubmit = useCallback(
    async (values: ContestDatabaseType) => {
      setLoading(true);

      const common: Partial<ContestDatabaseType> = {
        postDate: new Date().getTime(),
        authorId: user?.id,
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

      if (purpose === "create") {
        await crudData("set_contest", {
          data: completeValues as unknown as ContestDatabaseType,
        })
          .then(async (res) => {
            await sleep(200);
            setLoading(false);
            if (res && res.id) router.replace(`/contest/${res.id}`);
          })
          .catch(() => {
            setLoading(false);
          });
      } else if (contest) {
        const { id } = contest as unknown as ContestDatabaseType;
        await crudData("update_contest", {
          id: id ?? "invalid",
          data: completeValues as unknown as ContestDatabaseType,
        })
          .then(async () => {
            setLoading(false);
            await sleep(200);
            router.replace(`/problem/${id}`);

            if (stateMode && stateContest) {
              const setMode = stateMode[1];
              const setContest = stateContest[1];
              setMode("view");
              setContest((prev) => ({
                ...prev,
                ...(completeValues as unknown as ContestType),
              }));
            }
          })
          .catch(() => {
            setLoading(false);
          });
      }
    },
    [contest, purpose, router, setLoading, stateContest, stateMode, user?.id]
  );

  return (
    <Card>
      {headElement}
      <Formik
        initialValues={
          contest ?? (CONTEST_BLANK as unknown as ContestDatabaseType)
        }
        validate={validateFormContest}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={false}
      >
        <ContestEditForm
          stateMode={stateMode}
          stateLoading={stateLoading}
          {...rest}
        />
      </Formik>
    </Card>
  );
}
