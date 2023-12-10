import { useMemo, useEffect } from "react";
import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Input, Markdown, Quote, Button } from "@/components";
import { ContentViewType, ProblemWithoutIdType, StateType } from "@/types";
import {
  PROBLEM_ANSWER_DEFAULT_VALUES,
  PROBLEM_ANSWER_TYPE_OPTIONS,
  PROBLEM_SUBTOPIC_OPTIONS,
  PROBLEM_TOPIC_OPTIONS,
} from "@/consts";
import { FormulaToolbar, MarkdownEditor } from "@/components/Markdown";
import { useFormikContext, Field } from "formik";
import { useProblemEditInitialized } from "@/hooks";
import { constructAnswerString } from "@/utils";
import { SettingSelect } from "@/components/Setting";
import { BsInfoCircleFill } from "react-icons/bs";
import { ProblemAnswer } from "@/features/ProblemDetail";

export interface ProblemCreateEditorFormProps {
  problem?: ProblemWithoutIdType;
  stateMode?: StateType<ContentViewType>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stateAnswer: StateType<any>;
  stateLoading: StateType<boolean>;
  onLeaveEditor?: () => void;
}

export function ProblemCreateEditorForm({
  stateAnswer,
  stateLoading,
  stateMode,
  onLeaveEditor,
}: ProblemCreateEditorFormProps) {
  const { initialized } = useProblemEditInitialized();

  const {
    setFieldValue,
    submitForm,
    values,
    errors,
    touched,
    setFieldTouched,
    validateForm,
  } = useFormikContext<ProblemWithoutIdType>();

  const { statement, subtopic, topic, type } = values;

  const [answer, setAnswer] = stateAnswer;
  const loading = stateLoading[0];

  const renderProblemSettings = useMemo(
    () => (
      <section className="mb-8">
        <h2 className="mb-4">Problem Settings</h2>
        <div className="flex flex-col gap-4">
          <SettingSelect
            name="Problem Type"
            formName="type"
            options={PROBLEM_ANSWER_TYPE_OPTIONS}
            selectedOption={type}
            onSelectOption={(option) => {
              setFieldValue("type", option ? option.id : undefined);
              if (option) {
                const defaultAnswer = PROBLEM_ANSWER_DEFAULT_VALUES[option.id];
                setFieldValue(
                  "answer",
                  constructAnswerString(type, defaultAnswer)
                );
                setAnswer(defaultAnswer);
              }
            }}
            disabled={!initialized}
          />
          <SettingSelect
            name="Problem Topic"
            formName="topic"
            options={PROBLEM_TOPIC_OPTIONS}
            selectedOption={topic}
            onSelectOption={(option) => {
              setFieldValue("topic", option ? option.id : undefined);
              setFieldValue("subtopic", "");
            }}
            disabled={!initialized}
          />
          <SettingSelect
            name="Problem Subtopic"
            formName="subtopic"
            options={topic ? PROBLEM_SUBTOPIC_OPTIONS[topic] : []}
            selectedOption={subtopic}
            onSelectOption={(option) => {
              setFieldValue("subtopic", option ? option.id : undefined);
            }}
            disabled={!initialized || !topic}
          />
        </div>
      </section>
    ),
    [type, initialized, topic, subtopic, setFieldValue, setAnswer]
  );

  const renderProblemEditor = useMemo(
    () => (
      <section className="border-transparent mb-8" data-color-mode="light">
        <h2 className="mb-4">Problem Statement</h2>
        <Field name="title">
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ({ field, form: { touched, errors } }: any) => (
              <Input
                {...field}
                externalWrapperClassName="mb-4"
                wrapperClassName="w-full"
                placeholder="Enter problem title here..."
                errorText={touched["title"] ? errors["title"] : undefined}
                disabled={!initialized}
              />
            )
          }
        </Field>
        <div className="mb-4">
          <MarkdownEditor
            value={statement}
            renderPreview={({ source }) => {
              return <Markdown markdown={source ?? ""} />;
            }}
            onChange={(newValue) => {
              setFieldValue("statement", newValue);
            }}
            onBlur={() => {
              setFieldTouched("statement", true);
            }}
            toolbars={[
              "bold",
              "italic",
              "strike",
              "ulist",
              "olist",
              FormulaToolbar,
            ]}
          />
          {errors["statement"] && touched["statement"] && (
            <div className="text-red-600 mt-2">{errors["statement"]}</div>
          )}
        </div>
      </section>
    ),
    [statement, errors, touched, initialized, setFieldValue, setFieldTouched]
  );

  const renderProblemAnswer = useMemo(
    () =>
      type && (
        <section className="mb-4">
          <h2 className="mb-4">Problem Answer</h2>
          <ProblemAnswer
            type={type}
            stateAnswer={stateAnswer}
            caption={
              touched["answer"] &&
              errors["answer"] && (
                <div className="text-red-600 mt-2">{errors["answer"]}</div>
              )
            }
            onBlur={() => setFieldTouched("answer", true)}
            disabled={!initialized}
          />
          <Quote icon={BsInfoCircleFill}>
            If the answer is a non-integer number, you should indicate the user
            to which place the answer should be accurate to.
          </Quote>
        </section>
      ),
    [errors, initialized, setFieldTouched, stateAnswer, touched, type]
  );

  useEffect(() => {
    setFieldValue("answer", constructAnswerString(type, answer));
  }, [answer, setFieldValue, type]);

  useEffect(() => {
    validateForm();
  }, [validateForm, values]);

  return (
    <>
      {renderProblemSettings}
      {renderProblemEditor}
      {renderProblemAnswer}
      <div className="flex gap-4">
        <Button
          loading={loading}
          disabled={!initialized}
          type="submit"
          onClick={submitForm}
        >
          Submit
        </Button>
        {onLeaveEditor && (
          <Button variant="ghost" onClick={onLeaveEditor}>
            Cancel
          </Button>
        )}
      </div>
    </>
  );
}
