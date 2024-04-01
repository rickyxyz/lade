import { ReactNode, useCallback, useEffect, useState } from "react";
import { Formik } from "formik";
import { Card, Modal } from "@/components";
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
  problem: ProblemType;
  stateLoading: StateType<boolean>;
  headElement?: ReactNode;
  onSubmit: (problem: ProblemType) => void;
}

export function ProblemCreateEditor({
  headElement,
  problem,
  stateLoading,
  onSubmit,
  ...rest
}: ProblemCreateEditorProps) {
  const setLoading = stateLoading[1];
  const stateAnswer = useState<unknown>({
    content: "",
  });
  const [answer, setAnswer] = stateAnswer;
  const user = useAppSelector("user");

  const handleSubmit = useCallback(
    async (values: ProblemType) => {
      if (!user) return;

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

      console.log(completeValues);

      onSubmit(completeValues);
    },
    [answer, onSubmit, user]
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
    <Card className="gap-8">
      <Formik
        initialValues={problem}
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
