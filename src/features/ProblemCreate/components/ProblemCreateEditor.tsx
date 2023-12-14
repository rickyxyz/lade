import { ReactNode, useCallback, useEffect, useState } from "react";
import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { parseAnswer, validateFormProblem } from "@/utils";
import { ContentEditType, ProblemType, StateType } from "@/types";
import { PROBLEM_BLANK, PROBLEM_DEFAULT } from "@/consts";
import { Formik } from "formik";
import { crudData } from "@/firebase";
import { useRouter } from "next/router";
import { Card } from "@/components";
import { useAppSelector } from "@/redux/dispatch";
import {
  ProblemCreateEditorForm,
  ProblemCreateEditorFormProps,
} from "./ProblemCreateEditorForm";
import { useDebounce } from "@/hooks";

interface ProblemCreateEditorProps
  extends Partial<ProblemCreateEditorFormProps> {
  stateProblem: StateType<ProblemType>;
  headElement?: ReactNode;
  purpose: ContentEditType;
  handleUpdateProblem?: (problem: ProblemType) => void;
}

export function ProblemCreateEditor({
  headElement,
  stateProblem,
  purpose,
  handleUpdateProblem,
  ...rest
}: ProblemCreateEditorProps) {
  const stateLoading = useState(false);
  const setLoading = stateLoading[1];
  const problem = stateProblem[0];
  const stateAnswer = useState<unknown>({
    content: "",
  });
  const [answer, setAnswer] = stateAnswer;
  const router = useRouter();
  const user = useAppSelector("user");
  const debounce = useDebounce();

  const handleSubmit = useCallback(
    async (values: ProblemType) => {
      setLoading(true);

      const common: ProblemType = {
        ...values,
        answer: JSON.stringify(answer),
        postDate: new Date().getTime(),
        authorId: user?.id,
      };

      const completeValues: ProblemType =
        purpose === "create"
          ? {
              ...PROBLEM_DEFAULT,
              ...common,
            }
          : common;

      console.log("Creating Events:");
      console.log(completeValues);

      if (purpose === "create") {
        await crudData("set_problem", {
          data: completeValues,
        })
          .then(async (res) => {
            debounce(() => {
              setLoading(false);
              if (res && res.id) router.replace(`/problem/${res.id}`);
            });
          })
          .catch(() => {
            setLoading(false);
          });
      } else if (problem) {
        const { id } = problem;
        await crudData("update_problem", {
          id: id ?? "invalid",
          data: completeValues,
        })
          .then(async () => {
            setLoading(false);
            debounce(() => {
              router.replace(`/problem/${id}`);
              handleUpdateProblem && handleUpdateProblem(completeValues);
            });
          })
          .catch(() => {
            setLoading(false);
          });
      }
    },
    [
      answer,
      debounce,
      handleUpdateProblem,
      problem,
      purpose,
      router,
      setLoading,
      user?.id,
    ]
  );

  const handleUpdateInitialAnswer = useCallback(() => {
    if (problem) {
      console.log("Set Initial Answer");
      const newAnswer = parseAnswer(problem.type, problem.answer);
      if (newAnswer) setAnswer(newAnswer);
    }
  }, [problem, setAnswer]);

  useEffect(() => {
    handleUpdateInitialAnswer();
  }, [handleUpdateInitialAnswer, problem]);

  return (
    <Card>
      {headElement}
      <Formik
        initialValues={problem ?? PROBLEM_BLANK}
        validate={validateFormProblem}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={false}
      >
        <ProblemCreateEditorForm
          stateAnswer={stateAnswer}
          stateLoading={stateLoading}
          {...rest}
        />
      </Formik>
    </Card>
  );
}
