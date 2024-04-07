import { useMemo, useEffect } from "react";
import { Markdown, Button, Paragraph } from "@/components";
import { ContentViewType, ProblemType, StateType } from "@/types";
import {
  PROBLEM_ANSWER_DEFAULT_VALUES,
  PROBLEM_ANSWER_TYPE_OPTIONS,
} from "@/consts";
import {
  FormulaToolbar,
  MarkdownEditor,
  SettingInput,
  SettingSelect,
} from "@/components";
import { useFormikContext } from "formik";
import { ProblemAnswer } from "@/features";
import { useProblemEditInitialized } from "@/hooks";
import { useTopics } from "@/hooks";

export interface ProblemCreateEditorFormProps {
  stateMode?: StateType<ContentViewType>;
  stateAnswers: StateType<unknown[]>;
  stateLoading: StateType<boolean>;
  disableEditId?: boolean;
  onLeaveEditor?: () => void;
}

export function ProblemCreateEditorFormMultiple({
  stateAnswers,
  stateLoading,
  onLeaveEditor,
}: ProblemCreateEditorFormProps) {
  const [answer, setAnswer] = stateAnswers;
  const [loading, setLoading] = stateLoading;

  const { initialized } = useProblemEditInitialized();
  const {
    setFieldValue,
    submitForm,
    values,
    errors,
    touched,
    setFieldTouched,
    validateForm,
  } = useFormikContext<ProblemType>();
  const { subTopicOptions, topicOptions } = useTopics();
  const { statement, subTopicId, topicId, type } = values;
  const atLeastOneError = useMemo(
    () => Object.entries(errors).length > 0,
    [errors]
  );

  const renderProblemSettings = useMemo(
    () => (
      <section className="mb-8">
        <h2 className="mb-4">Problem Details</h2>
        <div className="flex flex-col gap-4">
          <SettingInput name="Problem Title" formName="title" />
          <SettingSelect
            name="Problem Type"
            formName="type"
            options={PROBLEM_ANSWER_TYPE_OPTIONS}
            selectedOption={type}
            onSelectOption={(option) => {
              setFieldValue("type", option ? option.id : undefined);
              if (option) {
                const defaultAnswer = PROBLEM_ANSWER_DEFAULT_VALUES[option.id];
                setFieldValue("answer", JSON.stringify(defaultAnswer));
                setAnswer(defaultAnswer as any);
              }
            }}
            disabled={!initialized}
          />
          <SettingSelect
            name="Problem Topic"
            formName="topicId"
            options={topicOptions}
            selectedOption={topicId}
            onSelectOption={(option) => {
              setFieldValue("topicId", option ? option.id : undefined);
              setFieldValue("subTopicId", "");
            }}
            disabled={!initialized}
          />
          <SettingSelect
            name="Problem Subtopic"
            formName="subTopicId"
            options={
              topicId
                ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (subTopicOptions[topicId] as any)
                : []
            }
            selectedOption={subTopicId}
            onSelectOption={(option) => {
              setFieldValue("subTopicId", option ? option.id : undefined);
            }}
            disabled={!initialized || !topicId}
          />
        </div>
      </section>
    ),
    [
      type,
      initialized,
      topicOptions,
      topicId,
      subTopicOptions,
      subTopicId,
      setFieldValue,
      setAnswer,
    ]
  );

  const renderProblemEditor = useMemo(
    () => (
      <section className="border-transparent mb-8" data-color-mode="light">
        <h2 className="mb-4">Problem Statement</h2>
        <div className="mb-4">
          <MarkdownEditor
            value={statement}
            onChange={(newValue) => {
              setFieldValue("statement", newValue);
            }}
            onBlur={() => {
              setFieldTouched("statement", true);
            }}
          />
          {errors["statement"] && touched["statement"] && (
            <Paragraph color="danger-6" className="mt-2">
              {errors["statement"]}
            </Paragraph>
          )}
        </div>
      </section>
    ),
    [statement, errors, touched, setFieldValue, setFieldTouched]
  );

  const renderProblemAnswer = useMemo(
    () =>
      type && (
        <section className="mb-8">
          <h2 className="mb-4">Problem Answer</h2>
          <ProblemAnswer
            type={type}
            stateAnswer={stateAnswers}
            caption={
              touched["answer"] &&
              errors["answer"] && (
                <Paragraph color="danger-6" className="mt-2">
                  {errors["answer"]}
                </Paragraph>
              )
            }
            onBlur={() => {
              setFieldTouched("answer", true);
            }}
            disabled={!initialized}
          />
        </section>
      ),
    [errors, initialized, setFieldTouched, stateAnswers, touched, type]
  );

  useEffect(() => {
    setFieldValue("answer", JSON.stringify(answer));
  }, [answer, setFieldValue, type]);

  useEffect(() => {
    validateForm();
  }, [validateForm, values]);

  return (
    <>
      {renderProblemSettings}
      {renderProblemEditor}
      {renderProblemAnswer}
      <div className="flex gap-4 mt-4">
        <Button
          loading={loading}
          disabled={!initialized || atLeastOneError}
          type="submit"
          onClick={submitForm}
          label="Submit"
        />
        {onLeaveEditor && (
          <Button variant="ghost" onClick={onLeaveEditor} label="Cancel" />
        )}
      </div>
    </>
  );
}
