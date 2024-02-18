import { useMemo, useEffect, useState, useCallback } from "react";
import {
  Input,
  Markdown,
  Button,
  Icon,
  Paragraph,
  ButtonIcon,
} from "@/components";
import {
  ContentViewType,
  ContestDatabaseType,
  DateTimeType,
  ProblemType,
  StateType,
} from "@/types";
import { PROBLEM_SUBTOPIC_OPTIONS, PROBLEM_TOPIC_OPTIONS } from "@/consts";
import { FormulaToolbar, MarkdownEditor } from "@/components/Markdown";
import { useFormikContext, Field } from "formik";
import { useDebounce, useProblemEditInitialized } from "@/hooks";
import { crudData } from "@/libs/firebase";
import { BsArrowDown, BsArrowUp, BsX } from "react-icons/bs";
import { Setting, SettingDate, SettingSelect } from "@/components/Setting";
import { useTopics } from "@/utils";
import { API } from "@/api";

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

  const stateStart = useState<DateTimeType>();
  const stateEnd = useState<DateTimeType>();
  const [start, setStart] = stateStart;
  const [end, setEnd] = stateEnd;
  const [problems, setProblems] = useState<ProblemType[]>([]);
  const [problem, setProblem] = useState<ProblemType | null>();
  const [query, setQuery] = useState("");
  const [fetching, setFetching] = useState(false);
  const { subTopicOptions, topicOptions } = useTopics();
  const debounce = useDebounce();

  const {
    setFieldValue,
    submitForm,
    values,
    errors,
    touched,
    setFieldTouched,
    validateForm,
  } = useFormikContext<ContestDatabaseType>();

  const { description, subTopicId, topicId } = values;

  const loading = stateLoading[0];

  const handleUpdateFormDate = useCallback(
    (field: "startDate" | "endDate", dateTime?: DateTimeType) => {
      if (!dateTime) return;

      const { date, time } = dateTime;

      if (date && time) {
        const { date: day, month, year } = date;
        const { hour, minute } = time;
        const object = new Date(year, month, day, hour, minute);
        setFieldValue(field, object.getTime());
      }
    },
    [setFieldValue]
  );

  const renderContestSettings = useMemo(
    () => (
      <section className="mb-8">
        <h2 className="mb-4">Contest Settings</h2>
        <div className="flex flex-col gap-4">
          <SettingSelect
            name="Topic"
            formName="topic"
            options={topicOptions}
            selectedOption={topicId}
            onSelectOption={(option) => {
              setFieldValue("topicId", option ? option.id : undefined);
              setFieldValue("subTopicId", "");
            }}
            allowClearSelection
            disabled={!initialized}
          />
          <SettingSelect
            name="Subtopic"
            formName="subtopic"
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
            allowClearSelection
            disabled={!initialized || !topicId}
          />
          <SettingDate name="Start Date" stateDate={stateStart} />
          {start && <SettingDate name="End Date" stateDate={stateEnd} />}
        </div>
      </section>
    ),
    [
      topicOptions,
      topicId,
      initialized,
      subTopicOptions,
      subTopicId,
      stateStart,
      start,
      stateEnd,
      setFieldValue,
    ]
  );

  const renderContestEditor = useMemo(
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
            <Paragraph color="danger-6" className="mt-2">
              {errors["description"]}
            </Paragraph>
          )}
        </div>
      </section>
    ),
    [description, errors, touched, initialized, setFieldValue, setFieldTouched]
  );

  const handleGetProblem = useCallback(async () => {
    // const problem = await crudData("get_problem", {
    //   id: query,
    // });
    await API("get_problem", {
      params: {
        id: query,
      },
    })
      .then(({ data }) => {
        if (!data) throw Error("");

        const { id } = data;
        setProblem(data);

        if (Object.keys(data).length > 0)
          setProblem(data as unknown as ProblemType);
        else setProblem(undefined);

        return id;
      })
      .catch(() => null)
      .finally(() => {
        setFetching(false);
      });
  }, [query]);

  const handleAddProblem = useCallback(() => {
    if (problem) setProblems((prev) => [...prev, problem]);
    setProblem(null);
  }, [problem]);

  const handleReorderProblem = useCallback((idx: number, change: 1 | -1) => {
    setProblems((prev) => {
      const tempProblems = [...prev];

      const temp = tempProblems[idx + change];
      tempProblems[idx + change] = tempProblems[idx];
      tempProblems[idx] = temp;

      return tempProblems;
    });
  }, []);

  const handleRemoveProblem = useCallback((idx: number) => {
    setProblems((prev) => {
      const tempProblems = [...prev];

      return tempProblems.filter((_, index) => index !== idx);
    });
  }, []);

  useEffect(() => {
    if (query.length > 0) setFetching(true);
  }, [query]);

  useEffect(() => {
    handleGetProblem();
  }, [handleGetProblem]);

  const renderContestProblems = useMemo(
    () =>
      problems.map((p, idx) => (
        <tr key={p.id}>
          <td>{p.title}</td>
          <td>
            <Input />
          </td>
          <td>
            <div className="flex gap-2">
              <ButtonIcon
                icon={BsArrowUp}
                size="s"
                variant="ghost"
                disabled={idx === 0}
                onClick={() => handleReorderProblem(idx, -1)}
              />
              <ButtonIcon
                icon={BsArrowDown}
                size="s"
                variant="ghost"
                disabled={problems.length - 1 === idx}
                onClick={() => handleReorderProblem(idx, 1)}
              />
              <ButtonIcon
                icon={BsX}
                size="s"
                variant="ghost-danger"
                onClick={() => handleRemoveProblem(idx)}
              />
            </div>
          </td>
        </tr>
      )),
    [handleRemoveProblem, handleReorderProblem, problems]
  );

  const renderContestProblemTable = useMemo(
    () => (
      <section className="border-transparent mb-8" data-color-mode="light">
        <h2 className="mb-4">Contest Problems</h2>
        <Setting name="Problem ID">
          <div className="flex gap-4 col-span-2">
            <Input
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
            <Button
              variant="ghost"
              className="!w-fit"
              onClick={handleAddProblem}
            >
              Add
            </Button>
          </div>
        </Setting>
        <Setting className="mt-2">
          <span className="pl-4">
            {fetching ? (
              "Loading..."
            ) : problem ? (
              <b>{problem.title}</b>
            ) : (
              "No problem found."
            )}
          </span>
        </Setting>
        <table className="mt-8">
          <thead>
            <tr>
              <th className="w-full">Problem</th>
              <th>Points</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.length > 0 ? (
              renderContestProblems
            ) : (
              <tr>
                <td className="text-center" colSpan={3}>
                  This contest has no problems.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    ),
    [
      fetching,
      handleAddProblem,
      problem,
      problems.length,
      renderContestProblems,
    ]
  );

  useEffect(() => {
    handleUpdateFormDate("startDate", start);
  }, [handleUpdateFormDate, start]);

  useEffect(() => {
    handleUpdateFormDate("endDate", end);
  }, [handleUpdateFormDate, end]);

  useEffect(() => {
    console.log("Form Values ");
    console.log(values);
    validateForm();
  }, [validateForm, values]);

  return (
    <>
      {renderContestSettings}
      {renderContestEditor}
      {renderContestProblemTable}
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
