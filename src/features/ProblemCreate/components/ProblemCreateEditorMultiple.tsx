import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { Formik } from "formik";
import { Card, Paragraph } from "@/components";
import { useAppSelector } from "@/libs/redux";
import { parseAnswer, validateFormProblem } from "@/utils";
import {
  PROBLEM_AT_A_TIME_COUNT,
  PROBLEM_BLANK,
  PROBLEM_DEFAULT,
} from "@/consts";
import { ProblemType, StateType } from "@/types";
import { ProblemCreateEditorFormProps } from "./ProblemCreateEditorForm";
import { ProblemCreateEditorMultipleEntry } from "./ProblemCreateEditorMultipleEntry";
import clsx from "clsx";

interface ProblemCreateEditorProps
  extends Partial<ProblemCreateEditorFormProps> {
  stateProblems: StateType<ProblemType[]>;
  stateLoading: StateType<boolean>;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onAdd: () => void;
}

export function ProblemCreateEditorMultiple({
  stateProblems,
  onEdit,
  onDelete,
  onAdd,
}: ProblemCreateEditorProps) {
  const problems = stateProblems[0];

  const renderProblems = useMemo(
    () =>
      problems.map((problem, index) => (
        <ProblemCreateEditorMultipleEntry
          key={problem.id}
          problem={problem as any}
          onEdit={() => onEdit(index)}
          onDelete={() => {
            onDelete(index);
          }}
        />
      )),
    [onDelete, onEdit, problems]
  );

  return (
    <div className="flex-grow grid grid-cols-1 gap-8">{renderProblems}</div>
  );
}
