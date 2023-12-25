import { ReactNode, useCallback, useEffect, useState } from "react";
import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { parseAnswer, validateFormProblem } from "@/utils";
import { ContentEditType, ProblemType, StateType } from "@/types";
import { PROBLEM_BLANK, PROBLEM_DEFAULT } from "@/consts";
import { Formik } from "formik";
import { crudData } from "@/libs/firebase";
import { useRouter } from "next/router";
import { Card } from "@/components";
import { useAppSelector } from "@/libs/redux";
import {
  ProblemCreateEditorForm,
  ProblemCreateEditorFormProps,
} from "./ProblemCreateEditorForm";
import { useDebounce } from "@/hooks";

interface ProblemCreateEditorProps
  extends Partial<ProblemCreateEditorFormProps> {
  stateProblem: StateType<ProblemType>;
  stateLoading: StateType<boolean>;
  headElement?: ReactNode;
  onSubmit: (problem: ProblemType) => void;
}

export function ProblemCreateEditor({
  headElement,
  stateProblem,
  stateLoading,
  onSubmit,
  ...rest
}: ProblemCreateEditorProps) {
  const setLoading = stateLoading[1];
  const problem = stateProblem[0];
  const stateAnswer = useState<unknown>({
    content: "",
  });
  const [answer, setAnswer] = stateAnswer;
  const user = useAppSelector("user");

  const handleSubmit = useCallback(
    async (values: ProblemType) => {
      setLoading(true);

      const common: ProblemType = {
        createdAt: new Date().getTime(),
        ...values,
        answer: JSON.stringify(answer),
        authorId: user?.id,
      };

      const completeValues: ProblemType = {
        ...PROBLEM_DEFAULT,
        ...common,
      };

      onSubmit(completeValues);
    },
    [answer, onSubmit, setLoading, user?.id]
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
