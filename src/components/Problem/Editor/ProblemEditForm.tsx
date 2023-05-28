import { useMemo, useEffect } from "react";
import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import {
  Input,
  Markdown,
  ProblemAnswer,
  ProblemSettingSelect,
  Quote,
  Button,
} from "@/components";
import { ProblemWithoutIdType, StateType } from "@/types";
import {
  PROBLEM_ANSWER_DEFAULT_VALUES,
  PROBLEM_ANSWER_TYPE_OPTIONS,
  PROBLEM_SUBTOPIC_OPTIONS,
  PROBLEM_TOPIC_OPTIONS,
} from "@/consts";
import { FormulaToolbar, MarkdownEditor } from "@/components/Markdown";
import { useFormikContext, Field } from "formik";
import { useProblemEditInitialized } from "@/hooks";

export interface ProblemEditFormProps {
  defaultProblem?: ProblemWithoutIdType;
  stateAnswer: StateType<any>;
  stateLoading: StateType<boolean>;
}

export function ProblemEditForm({
  stateAnswer,
  stateLoading,
}: ProblemEditFormProps) {
  const { initialized } = useProblemEditInitialized();

  const {
    setFieldValue,
    submitForm,
    values,
    errors,
    touched,
    setFieldError,
    setFieldTouched,
  } = useFormikContext<ProblemWithoutIdType>();

  const { statement, subtopic, title, topic, type } = values;

  const [answer, setAnswer] = stateAnswer;
  const [loading, setLoading] = stateLoading;

  const renderProblemSettings = useMemo(
    () => (
      <section className="mb-8">
        <h2 className="mb-4">Problem Settings</h2>
        <div className="flex flex-col gap-4">
          <ProblemSettingSelect
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
            onBlur={() => {
              setFieldTouched("type", true);
            }}
            optional
            allowClearSelection={false}
            disabled={!initialized}
          />
          <ProblemSettingSelect
            name="Problem Topic"
            formName="topic"
            options={PROBLEM_TOPIC_OPTIONS}
            selectedOption={topic}
            onSelectOption={(option) => {
              setFieldValue("topic", option ? option.id : undefined);
              setFieldValue("subtopic", "");
            }}
            onBlur={() => {
              setFieldTouched("topic", true);
            }}
            optional
            allowClearSelection={false}
            disabled={!initialized}
          />
          <ProblemSettingSelect
            name="Problem Subtopic"
            formName="subtopic"
            options={topic ? PROBLEM_SUBTOPIC_OPTIONS[topic] : []}
            selectedOption={subtopic}
            onSelectOption={(option) => {
              setFieldValue("subtopic", option ? option.id : undefined);
            }}
            disabled={!initialized || !topic}
            onBlur={() => {
              setFieldTouched("subtopic", true);
            }}
            optional
            allowClearSelection={false}
          />
        </div>
      </section>
    ),
    [
      type,
      initialized,
      topic,
      subtopic,
      setFieldValue,
      setAnswer,
      setFieldTouched,
    ]
  );

  const renderProblemEditor = useMemo(
    () => (
      <section className="border-transparent mb-8" data-color-mode="light">
        <h2 className="mb-4">Problem Statement</h2>
        <Field name="title">
          {({ field, form: { touched, errors }, meta }: any) => (
            <Input
              {...field}
              externalWrapperClassName="mb-4"
              wrapperClassName="w-full"
              placeholder="Enter problem title here..."
              defaultValue={title}
              errorText={touched["title"] ? errors["title"] : undefined}
              disabled={!initialized}
            />
          )}
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
    [statement, errors, touched, title, initialized, setFieldValue]
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
          <Quote icon="infoCircleFill">
            If the answer is a non-integer number, you should indicate the user
            to which place the answer should be accurate to.
          </Quote>
        </section>
      ),
    [errors, initialized, setFieldTouched, stateAnswer, touched, type]
  );

  useEffect(() => {
    setFieldValue("answer", JSON.stringify(answer));
  }, [answer, setFieldValue]);

  useEffect(() => {
    console.log(touched);
  }, [touched]);

  return (
    <>
      {renderProblemSettings}
      {renderProblemEditor}
      {renderProblemAnswer}
      <Button
        loading={loading}
        disabled={!initialized}
        type="submit"
        onClick={submitForm}
      >
        Submit
      </Button>
    </>
  );
}
