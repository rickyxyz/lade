import { useMemo, useEffect, useCallback, useRef } from "react";
import { Input, Markdown, Quote, Button } from "@/components";
import {
  ContentViewType,
  ProblemTopicNameType,
  ProblemType,
  SelectOptionType,
  StateType,
} from "@/types";
import {
  PROBLEM_ANSWER_DEFAULT_VALUES,
  PROBLEM_ANSWER_TYPE_OPTIONS,
  PROBLEM_SUBTOPIC_OPTIONS,
  PROBLEM_TOPIC_OPTIONS,
} from "@/consts";
import { FormulaToolbar, MarkdownEditor } from "@/components/Markdown";
import { useFormikContext, Field } from "formik";
import { useProblemEditInitialized } from "@/hooks";
import { SettingSelect } from "@/components/Setting";
import { BsInfoCircleFill } from "react-icons/bs";
import { ProblemAnswer } from "@/features/ProblemDetail";
import { useTopics, validateId } from "@/utils";
import { SettingInput } from "@/components/Setting/SettingInput";
import { api } from "@/utils/api";

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
  disableEditId,
  onLeaveEditor,
}: ProblemCreateEditorFormProps) {
  const [answer, setAnswer] = stateAnswer;
  const [loading, setLoading] = stateLoading;
  const queries = useRef<Record<string, boolean>>({});

  const { initialized } = useProblemEditInitialized();
  const {
    setFieldValue,
    submitForm,
    values,
    errors,
    touched,
    setFieldTouched,
    validateForm,
    setFieldError,
  } = useFormikContext<ProblemType>();
  const {
    allTopics: { topics },
    getSubTopicsFromTopic,
    getTopicOptions,
  } = useTopics();
  const { statement, subTopicId, topicId, type, id } = values;

  const topicOptions = useMemo(
    () => getTopicOptions(topics),
    [getTopicOptions, topics]
  );

  const handleGetProblemWithId = useCallback(
    (newId: string) =>
      api
        .get("/problem", {
          params: {
            id: newId,
          },
        })
        .then(({ data }) => {
          const verdict = !!data;
          queries.current[newId] = verdict;
          return verdict;
        })
        .catch(() => true),
    []
  );

  const handleVerifyId = useCallback(
    async (newId: string) => {
      const validId = validateId(newId);
      if (validId) return false;

      setLoading(true);
      let existing = false;

      if (!queries.current[newId])
        existing = await handleGetProblemWithId(newId);

      if (existing) {
        setFieldError("id", "ID is already in use.");
        setLoading(false);
        return false;
      }

      return true;
    },
    [handleGetProblemWithId, setFieldError, setLoading]
  );

  const handleSubmit = useCallback(async () => {
    const valid = await handleVerifyId(id);

    console.log("valid");
    console.log(valid);

    if (valid) submitForm();
  }, [handleVerifyId, id, submitForm]);

  const renderProblemSettings = useMemo(
    () => (
      <section className="mb-8">
        <h2 className="mb-4">Problem Details</h2>
        <div className="flex flex-col gap-4">
          <SettingInput name="Problem Title" formName="title" />
          <SettingInput
            name="Problem ID"
            formName="id"
            disabled={disableEditId}
          />
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
                ? (getTopicOptions(getSubTopicsFromTopic(topicId)) as any)
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
      disableEditId,
      topicOptions,
      topicId,
      getTopicOptions,
      getSubTopicsFromTopic,
      subTopicId,
      setFieldValue,
      setAnswer,
    ]
  );

  const renderProblemEditor = useMemo(
    () => (
      <section className="border-transparent mb-8" data-color-mode="light">
        <h2 className="mb-4">Problem Statement</h2>
        {/* <Field name="title">
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
        </Field> */}
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
            <span className="text-red-600 mt-2">{errors["statement"]}</span>
          )}
        </div>
      </section>
    ),
    [statement, errors, touched, setFieldValue, setFieldTouched]
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
      <div className="flex gap-4">
        <Button
          loading={loading}
          disabled={!initialized}
          type="submit"
          onClick={handleSubmit}
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
