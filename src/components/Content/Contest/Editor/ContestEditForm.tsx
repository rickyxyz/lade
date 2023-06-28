import { useMemo, useEffect, useState, useCallback } from "react";
import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Input, Markdown, ContentSettingSelect, Button } from "@/components";
import {
  ContentViewType,
  ContestDatabaseType,
  DateTimeType,
  StateType,
} from "@/types";
import { PROBLEM_SUBTOPIC_OPTIONS, PROBLEM_TOPIC_OPTIONS } from "@/consts";
import { FormulaToolbar, MarkdownEditor } from "@/components/Markdown";
import { useFormikContext, Field } from "formik";
import { useProblemEditInitialized } from "@/hooks";
import { ContentSetting } from "../../ContentSetting";

export interface ContestEditFormProps {
  contest?: ContestDatabaseType;
  stateMode?: StateType<ContentViewType>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stateLoading: StateType<boolean>;
}

export function ContestEditForm({
  stateLoading,
  stateMode,
}: ContestEditFormProps) {
  const { initialized } = useProblemEditInitialized();

  const [start, setStart] = useState<DateTimeType>();
  const [end, setEnd] = useState<DateTimeType>();

  const {
    setFieldValue,
    submitForm,
    values,
    errors,
    touched,
    setFieldTouched,
    validateForm,
  } = useFormikContext<ContestDatabaseType>();

  const { description, subtopic, topic } = values;

  const loading = stateLoading[0];

  const handleUpdateDate = useCallback(
    (prev: DateTimeType | undefined, raw: string): DateTimeType => {
      const [year, month, date] = raw.split("-") as unknown as number[];

      return {
        ...(prev ?? {}),
        date: {
          year,
          month,
          date,
        },
      };
    },
    []
  );

  const handleUpdateTime = useCallback(
    (prev: DateTimeType | undefined, raw: string): DateTimeType => {
      const [hour, minute] = raw.split(":") as unknown as number[];

      return {
        ...(prev ?? {}),
        time: {
          hour,
          minute,
        },
      };
    },
    []
  );

  const renderProblemSettings = useMemo(
    () => (
      <section className="mb-8">
        <h2 className="mb-4">Contest Settings</h2>
        <div className="flex flex-col gap-4">
          <ContentSettingSelect
            name="Contest Topic"
            formName="topic"
            options={PROBLEM_TOPIC_OPTIONS}
            selectedOption={topic}
            onSelectOption={(option) => {
              setFieldValue("topic", option ? option.id : undefined);
              setFieldValue("subtopic", "");
            }}
            allowClearSelection
            disabled={!initialized}
          />
          <ContentSettingSelect
            name="Contest Subtopic"
            formName="subtopic"
            options={topic ? PROBLEM_SUBTOPIC_OPTIONS[topic] : []}
            selectedOption={subtopic}
            onSelectOption={(option) => {
              setFieldValue("subtopic", option ? option.id : undefined);
            }}
            allowClearSelection
            disabled={!initialized || !topic}
          />
          <ContentSetting name="Start Date" formName="startDate">
            <Input
              type="date"
              onChange={(e) => {
                const string = e.target.value;
                setStart((prev) => handleUpdateDate(prev, string));
              }}
            />
            <Input
              type="time"
              onChange={(e) => {
                const string = e.target.value;
                setStart((prev) => handleUpdateTime(prev, string));
              }}
            />
          </ContentSetting>
          <ContentSetting name="End Date" formName="endDate">
            <Input
              type="date"
              onChange={(e) => {
                const string = e.target.value;
                setEnd((prev) => handleUpdateDate(prev, string));
              }}
            />
            <Input
              type="time"
              onChange={(e) => {
                const string = e.target.value;
                setEnd((prev) => handleUpdateTime(prev, string));
              }}
            />
          </ContentSetting>
        </div>
      </section>
    ),
    [
      topic,
      initialized,
      subtopic,
      setFieldValue,
      handleUpdateDate,
      handleUpdateTime,
    ]
  );

  useEffect(() => {
    console.log(start);
  }, [start]);

  const renderProblemEditor = useMemo(
    () => (
      <section className="border-transparent mb-8" data-color-mode="light">
        <h2 className="mb-4">Contest Details</h2>
        <Field name="title">
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ({ field, form: { touched, errors } }: any) => (
              <Input
                {...field}
                externalWrapperClassName="mb-4"
                wrapperClassName="w-full"
                placeholder="Enter contest title here..."
                errorText={touched["title"] ? errors["title"] : undefined}
                disabled={!initialized}
              />
            )
          }
        </Field>
        <div className="mb-4">
          <MarkdownEditor
            value={description}
            renderPreview={({ source }) => {
              return <Markdown markdown={source ?? ""} />;
            }}
            onChange={(newValue) => {
              setFieldValue("description", newValue);
            }}
            onBlur={() => {
              setFieldTouched("description", true);
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
          {errors["description"] && touched["description"] && (
            <div className="text-red-600 mt-2">{errors["description"]}</div>
          )}
        </div>
      </section>
    ),
    [description, errors, touched, initialized, setFieldValue, setFieldTouched]
  );

  useEffect(() => {
    validateForm();
  }, [validateForm, values]);

  return (
    <>
      {renderProblemSettings}
      {renderProblemEditor}
      <div className="flex gap-4">
        <Button
          loading={loading}
          disabled={!initialized}
          type="submit"
          onClick={submitForm}
        >
          {stateMode && stateMode[0] === "edit" ? "Update" : "Create"}
        </Button>
        {stateMode && stateMode[0] === "edit" && (
          <Button
            variant="ghost"
            onClick={() => {
              if (!stateMode) return;

              const setMode = stateMode[1];
              setMode("view");
            }}
          >
            Cancel
          </Button>
        )}
      </div>
    </>
  );
}
