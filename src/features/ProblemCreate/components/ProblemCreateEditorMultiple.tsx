import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
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
  stateProblems: StateType<ProblemType[]>;
  stateLoading: StateType<boolean>;
  headElement?: ReactNode;
  onSubmit: (problem: ProblemType[]) => void;
}

export function ProblemCreateEditorMultiple({
  headElement,
  stateProblems,
  stateLoading,
  onSubmit,
  ...rest
}: ProblemCreateEditorProps) {
  const setLoading = stateLoading[1];
  const problems = stateProblems[0];
  const stateAnswers = useState<unknown[]>([
    {
      content: "",
    },
  ]);
  const [answer, setAnswer] = stateAnswers;
  const user = useAppSelector("user");

  const handleSubmit = useCallback(
    async (values: { problems: ProblemType[] }) => {
      if (!user) return;

      setLoading(true);

      console.log("onSubmit");
      onSubmit(
        values.problems.map((problem) => {
          const common: ProblemType = {
            createdAt: new Date(),
            ...problem,
            answer: JSON.stringify(answer),
            authorId: user.id,
          };

          const completeValues: ProblemType = {
            ...PROBLEM_DEFAULT,
            ...common,
          };

          return completeValues;
        })
      );
    },
    [answer, onSubmit, setLoading, user]
  );

  const handleUpdateInitialAnswer = useCallback(() => {
    if (problems) {
      console.log("Set Initial Answer");
      const castAnswers = problems.map((problem) =>
        parseAnswer(problem.type, problem.answer)
      );
      setAnswer(castAnswers);
    }
  }, [problems, setAnswer]);

  useEffect(() => {
    handleUpdateInitialAnswer();
  }, [handleUpdateInitialAnswer, problems]);

  return (
    <Card>
      {headElement}
      <Formik
        initialValues={{
          problems,
        }}
        // validate={validateFormProblem}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {/* <ProblemCreateEditorFormMultiple
          stateProblems={stateProblems}
          stateAnswers={stateAnswers}
          stateLoading={stateLoading}
          {...rest}
        /> */}
      </Formik>
    </Card>
  );
}
