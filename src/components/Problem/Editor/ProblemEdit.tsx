import { useCallback, useState } from "react";
import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { validateFormAnswer, validateFormProblem } from "@/utils";
import { ProblemDatabaseType, ProblemWithoutIdType } from "@/types";
import { PROBLEM_BLANK, PROBLEM_DEFAULT } from "@/consts";
import { Formik } from "formik";
import { ProblemEditForm, ProblemEditFormProps } from "./ProblemEditForm";
import { ProblemEditInitializedContext } from "@/hooks";
import { crudData } from "@/firebase";
import { useRouter } from "next/router";

interface ProblemEditProps extends Partial<ProblemEditFormProps> {}

export function ProblemEdit(props: ProblemEditProps) {
  const [initialized, setInitialized] = useState(false);
  const stateLoading = useState(false);
  const [loading, setLoading] = stateLoading;
  const stateAnswer = useState<any>();
  const router = useRouter();

  const handleSubmit = useCallback(
    async (values: ProblemWithoutIdType) => {
      console.log("Submitting");
      await crudData("set_problem", {
        data: {
          ...PROBLEM_DEFAULT,
          ...values,
          postDate: new Date().getTime(),
        } as unknown as ProblemDatabaseType,
      })
        .then(() => {
          router.replace("/");
        })
        .catch(() => {
          setLoading(false);
        });
    },
    [router, setLoading]
  );

  return (
    <Formik
      initialValues={
        props.defaultProblem ??
        (PROBLEM_BLANK as unknown as ProblemWithoutIdType)
      }
      validate={validateFormProblem}
      onSubmit={handleSubmit}
      validateOnChange
    >
      <ProblemEditInitializedContext.Provider
        value={[initialized, setInitialized]}
      >
        <ProblemEditForm
          stateAnswer={stateAnswer}
          stateLoading={stateLoading}
          {...props}
        />
      </ProblemEditInitializedContext.Provider>
    </Formik>
  );
}
