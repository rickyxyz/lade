import { useMemo, useEffect, useCallback, useRef } from "react";
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
import { ProblemAnswer } from "@/features/ProblemDetail";
import { useProblemEditInitialized } from "@/hooks";
import { useTopics, validateProblemId } from "@/utils";
import { API } from "@/api";

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
  const atLeastOneError = useMemo(
    () => Object.entries(errors).length > 0,
    [errors]
  );

  const topicOptions = useMemo(
    () => getTopicOptions(topics),
    [getTopicOptions, topics]
  );

  const handleGetProblemWithId = useCallback(
    (newId: string) =>
      API("get_problem", {
        params: {
          id: newId,
        },
      })
        .then(({ data }) => {
          const verdict = !!data;
          queries.current[newId] = verdict;
          return verdict;
        })
        .catch((e) => {
          console.error(e);
          return true;
        }),
    []
  );

  const handleVerifyId = useCallback(
    async (newId: string) => {
      const validId = validateProblemId(newId);
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
    const valid = disableEditId ? true : await handleVerifyId(id);

    console.log("valid");
    console.log(valid);

    if (valid) submitForm();
  }, [disableEditId, handleVerifyId, id, submitForm]);

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
                ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (getTopicOptions(getSubTopicsFromTopic(topicId)) as any)
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
