import { ReactNode, useCallback, useEffect, useState } from "react";
import { Formik } from "formik";
import { Card } from "@/components";
import { useAppSelector } from "@/libs/redux";
import { parseAnswer, validateFormProblem } from "@/utils";
import { PROBLEM_BLANK, PROBLEM_DEFAULT } from "@/consts";
import { ProblemType, StateType } from "@/types";
import {
  ProblemCreateEditorForm,
  ProblemCreateEditorFormProps,
} from "./ProblemCreateEditorForm";

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
      if (!user) return;

      setLoading(true);

      const common: ProblemType = {
        createdAt: new Date(),
        ...values,
        answer: JSON.stringify(answer),
        authorId: user.id,
      };

      const completeValues: ProblemType = {
        ...PROBLEM_DEFAULT,
        ...common,
      };

      console.log("onSubmit");
      onSubmit(completeValues);
    },
    [answer, onSubmit, setLoading, user]
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
        // validate={validateFormProblem}
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
