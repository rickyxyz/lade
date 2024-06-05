import { useMemo, useEffect } from "react";
import { Button, Paragraph } from "@/components";
import { ContentViewType, ProblemType, StateType } from "@/types";
import {
  PROBLEM_ANSWER_DEFAULT_VALUES,
  PROBLEM_ANSWER_TYPE_OPTIONS,
} from "@/consts";
import { MarkdownEditor, SettingInput, SettingSelect } from "@/components";
import { useFormikContext } from "formik";
import { ProblemAnswer } from "@/features";
import { useEditorInitialized } from "@/hooks";
import { useTopics } from "@/hooks";

export interface ProblemCreateEditorFormProps {
  stateMode?: StateType<ContentViewType>;
  stateAnswer: StateType<unknown>;
  stateLoading: StateType<boolean>;
  disableEditId?: boolean;
  onLeaveEditor?: () => void;
}

export function ProblemCreateEditorForm({
  stateAnswer,
  stateLoading,
  onLeaveEditor,
}: ProblemCreateEditorFormProps) {
  const [answer, setAnswer] = stateAnswer;
  const [loading, setLoading] = stateLoading;

  const { initialized } = useEditorInitialized();
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
  const { description, subTopicId, topicId, type } = values;
  const atLeastOneError = useMemo(
    () => Object.entries(errors).length > 0,
    [errors]
  );

  const renderProblemSettings = useMemo(
    () => (
      <section className="flex-grow flex flex-col gap-6">
        <h2>Problem Settings</h2>
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
              setAnswer(defaultAnswer);
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

  const renderProblemAnswer = useMemo(
    () =>
      type && (
        <section>
          <ProblemAnswer
            label="Problem Answer"
            type={type}
            stateAnswer={stateAnswer}
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
    [errors, initialized, setFieldTouched, stateAnswer, touched, type]
  );

  const renderProblemEditor = useMemo(
    () => (
      <section className="border-transparent" data-color-mode="light">
        <div className="flex flex-col gap-6">
          <h2>Problem Details</h2>
          <SettingInput name="Problem Title" formName="title" />
          <MarkdownEditor
            label="Problem Description"
            value={description}
            onChange={(newValue) => {
              setFieldValue("description", newValue);
            }}
            onBlur={() => {
              setFieldTouched("description", true);
            }}
            caption={
              errors["description"] &&
              touched["description"] && (
                <Paragraph color="danger-6" className="mt-2">
                  {errors["description"]}
                </Paragraph>
              )
            }
          />
          {renderProblemAnswer}
        </div>
      </section>
    ),
    [
      description,
      errors,
      touched,
      renderProblemAnswer,
      setFieldValue,
      setFieldTouched,
    ]
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
      <div className="flex flex-auto gap-4">
        <Button
          className="flex-1"
          loading={loading}
          disabled={!initialized || atLeastOneError}
          type="submit"
          onClick={submitForm}
          label="Save"
        />
        {onLeaveEditor && (
          <Button
            className="flex-1"
            variant="outline-2"
            onClick={onLeaveEditor}
            label="Cancel"
          />
        )}
      </div>
    </>
  );
}
