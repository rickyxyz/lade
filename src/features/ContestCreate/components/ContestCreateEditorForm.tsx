import { useMemo, useEffect, useState, useCallback, useRef } from "react";
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
  ContestType,
  DateTimeType,
  ProblemContestType,
  ProblemType,
  StateType,
} from "@/types";
import { PROBLEM_SUBTOPIC_OPTIONS, PROBLEM_TOPIC_OPTIONS } from "@/consts";
import { FormulaToolbar, MarkdownEditor } from "@/components/Markdown";
import { useFormikContext, Field } from "formik";
import { useDebounce, useProblemEditInitialized, useTopics } from "@/hooks";
import { crudData } from "@/libs/firebase";
import { Setting, SettingDate, SettingSelect } from "@/components/Setting";
import { API } from "@/api";
import clsx from "clsx";
import { North, South, X } from "@mui/icons-material";

export interface ContestEditFormProps {
  contest?: ContestType;
  stateMode?: StateType<ContentViewType>;
  stateProblems: StateType<ProblemContestType[]>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stateLoading: StateType<boolean>;
  onLeaveEditor?: () => void;
}

export function ContestCreateEditorForm({
  stateLoading,
  stateProblems,
  stateMode,
  onLeaveEditor,
}: ContestEditFormProps) {
  const { initialized } = useProblemEditInitialized();

  const inputRef = useRef<HTMLInputElement>(null);
  const [problems, setProblems] = stateProblems;
  const [problem, setProblem] = useState<ProblemType | null>();

  const [query, setQuery] = useState("");
  const [fetching, setFetching] = useState(false);
  const [status, setStatus] = useState<
    "loading" | "loaded" | "invalid" | "added" | "duplicate" | undefined
  >();
  console.log(status);
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

  const { description, subTopicId, topicId, startDate, endDate } = values;

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
          <SettingDate
            name="Start Date"
            dateNum={startDate}
            onChange={(newDate) => {
              setFieldValue("startDate", newDate);
            }}
          />
          <SettingDate
            name="End Date"
            dateNum={endDate}
            onChange={(newDate) => {
              setFieldValue("endDate", newDate);
            }}
          />
        </div>
      </section>
    ),
    [
      topicOptions,
      topicId,
      initialized,
      subTopicOptions,
      subTopicId,
      startDate,
      endDate,
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
    if (query.length === 0) return;

    setStatus("loading");
    await API("get_problem", {
      params: {
        id: query,
      },
    })
      .then(({ data }) => {
        if (!data || Object.keys(data).length === 0) throw Error("");

        setStatus("loaded");

        setProblem(data as unknown as ProblemType);
      })
      .catch(() => {
        setProblem(null);
        setStatus("invalid");
        return null;
      })
      .finally(() => {
        setFetching(false);
      });
  }, [query]);

  const handleAddProblem = useCallback(() => {
    const input = inputRef.current;

    if (
      problem &&
      problems.filter(({ problem: { id } }) => id === problem.id).length > 0
    ) {
      setStatus("duplicate");
      return;
    }

    if (problem) {
      if (input) {
        input.value = "";
      }
      setQuery("");
      setStatus("added");
      setProblems((prev) => [
        ...prev,
        {
          problem,
          score: 10,
          order: prev.length,
        },
      ]);
      return;
    }

    setProblem(null);
  }, [problem, problems, setProblems]);

  const handleReorderProblem = useCallback(
    (idx: number, change: 1 | -1) => {
      setProblems((prev) => {
        const tempProblems = [...prev];

        const temp = tempProblems[idx + change];
        tempProblems[idx + change] = tempProblems[idx];
        tempProblems[idx] = temp;

        return tempProblems;
      });
    },
    [setProblems]
  );

  const handleRemoveProblem = useCallback(
    (idx: number) => {
      setProblems((prev) => {
        const tempProblems = [...prev];

        return tempProblems.filter((_, index) => index !== idx);
      });
    },
    [setProblems]
  );

  // useEffect(() => {
  //   if (query.length > 0) setFetching(true);
  // }, [query]);

  useEffect(() => {
    debounce(() => {
      handleGetProblem();
    }, 500);
  }, [debounce, handleGetProblem]);

  const renderContestProblems = useMemo(
    () =>
      problems.map(({ problem: { id, title }, score }, idx) => (
        <tr key={id}>
          <td>{title}</td>
          <td>
            <Input
              value={score}
              onChange={(e) => {
                let value = Number(e.target.value);

                if (isNaN(value)) value = 10;
                else if (value < 1) value = 10;
                else if (value > 1000) value = 1000;

                setProblems((prev) => {
                  const previous = [...prev];
                  return previous.map((entry) =>
                    entry.problem.id === id
                      ? {
                          ...entry,
                          score: value,
                        }
                      : entry
                  );
                });
              }}
            />
          </td>
          <td>
            <div className="flex gap-2">
              <ButtonIcon
                icon={North}
                size="s"
                variant="ghost"
                disabled={idx === 0}
                onClick={() => handleReorderProblem(idx, -1)}
              />
              <ButtonIcon
                icon={South}
                size="s"
                variant="ghost"
                disabled={problems.length - 1 === idx}
                onClick={() => handleReorderProblem(idx, 1)}
              />
              <ButtonIcon
                icon={X}
                size="s"
                variant="ghost-danger"
                onClick={() => handleRemoveProblem(idx)}
              />
            </div>
          </td>
        </tr>
      )),
    [handleRemoveProblem, handleReorderProblem, problems, setProblems]
  );

  const renderStatus = useMemo(() => {
    const text = (() => {
      switch (status) {
        case "added":
          return "Problem added.";
        case "duplicate":
          return "Problem already added.";
        case "invalid":
          return "Problem does not exist.";
        case "loaded":
          return problem?.title;
        case "loading":
          return "Loading...";
      }
    })();

    return (
      <Paragraph
        className={clsx(status === "loaded" && "font-bold")}
        color={status === "invalid" ? "danger-5" : undefined}
      >
        {text}
      </Paragraph>
    );
  }, [problem?.title, status]);

  const renderContestProblemTable = useMemo(
    () => (
      <section className="border-transparent mb-8" data-color-mode="light">
        <h2 className="mb-4">Contest Problems</h2>
        <Setting name="Problem ID">
          <div className="flex gap-4 col-span-2">
            <Input
              ref={inputRef}
              onChange={(e) => {
                setQuery(e.target.value);
                setStatus(undefined);
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter" || e.keyCode === 13) {
                  handleAddProblem();
                }
              }}
            />
            <Button
              variant="outline"
              disabled={status !== "loaded"}
              className="!w-fit"
              onClick={handleAddProblem}
            >
              Add
            </Button>
          </div>
        </Setting>
        <Setting className="mt-2">{renderStatus}</Setting>
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
      handleAddProblem,
      problems.length,
      renderContestProblems,
      renderStatus,
      status,
    ]
  );

  useEffect(() => {
    console.log("Form Values ");
    console.log(values);
    validateForm();
  }, [validateForm, values]);

  useEffect(() => {
    setFieldValue("problems", JSON.stringify(problems));
  }, [problems, setFieldValue]);

  return (
    <>
      {renderContestSettings}
      {renderContestEditor}
      {renderContestProblemTable}

      <div className="flex gap-4 mt-4">
        <Button
          loading={loading}
          disabled={!initialized}
          type="submit"
          onClick={() => {
            setFieldValue("problems", JSON.stringify(problems));
            submitForm();
          }}
          label="Submit"
        />
        {onLeaveEditor && (
          <Button variant="ghost" onClick={onLeaveEditor} label="Cancel" />
        )}
      </div>
    </>
  );
}
