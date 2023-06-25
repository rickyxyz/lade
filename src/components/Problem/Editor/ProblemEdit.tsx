import { ReactNode, useCallback, useEffect, useState } from "react";
import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { constructAnswerString, sleep, validateFormProblem } from "@/utils";
import { ProblemDatabaseType, ProblemWithoutIdType } from "@/types";
import { PROBLEM_BLANK, PROBLEM_DEFAULT } from "@/consts";
import { Formik } from "formik";
import { ProblemEditForm, ProblemEditFormProps } from "./ProblemEditForm";
import { crudData } from "@/firebase";
import { useRouter } from "next/router";
import { Card } from "@/components/Generic";
import { useAppSelector } from "@/redux/dispatch";

interface ProblemEditProps extends Partial<ProblemEditFormProps> {
  headElement?: ReactNode;
  mode: "edit" | "create";
}

export function ProblemEdit({
  headElement,
  problem,
  mode,
  ...rest
}: ProblemEditProps) {
  const stateLoading = useState(false);
  const setLoading = stateLoading[1];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stateAnswer = useState<any>();
  const [answer, setAnswer] = stateAnswer;
  const router = useRouter();
  const user = useAppSelector("user");

  const handleSubmit = useCallback(
    async (values: ProblemWithoutIdType) => {
      setLoading(true);

      const common: Partial<ProblemWithoutIdType> = {
        answer: constructAnswerString(values.type, answer),
        postDate: new Date().getTime(),
        authorId: user?.id,
      };

      const completeValues =
        mode === "create"
          ? {
              ...PROBLEM_DEFAULT,
              ...values,
              ...common,
            }
          : {
              ...values,
              ...common,
            };

      console.log("Creating Events:");
      console.log(completeValues);

      if (mode === "create") {
        await crudData("set_problem", {
          data: completeValues as unknown as ProblemDatabaseType,
        })
          .then(async (res) => {
            await sleep(200);
            setLoading(false);
            if (res && res.id) router.replace(`/problem/${res.id}`);
          })
          .catch(() => {
            setLoading(false);
          });
      } else if (problem) {
        const { id } = problem as unknown as ProblemDatabaseType;
        await crudData("update_problem", {
          id: id ?? "invalid",
          data: completeValues as unknown as ProblemDatabaseType,
        })
          .then(async () => {
            setLoading(false);
            await sleep(200);
            router.replace(`/problem/${id}`);
          })
          .catch(() => {
            setLoading(false);
          });
      }
    },
    [answer, mode, problem, router, setLoading, user?.id]
  );

  const handleUpdateInitialAnswer = useCallback(() => {
    if (problem) setAnswer(problem.answer);
  }, [problem, setAnswer]);

  useEffect(() => {
    handleUpdateInitialAnswer();
  }, [handleUpdateInitialAnswer, problem]);

  return (
    <Card>
      {headElement}
      <Formik
        initialValues={
          problem ?? (PROBLEM_BLANK as unknown as ProblemWithoutIdType)
        }
        validate={validateFormProblem}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={false}
      >
        <ProblemEditForm
          stateAnswer={stateAnswer}
          stateLoading={stateLoading}
          {...rest}
        />
      </Formik>
    </Card>
  );
}
