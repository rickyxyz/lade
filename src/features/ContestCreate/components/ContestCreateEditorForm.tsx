import { useMemo, useEffect, useState, useCallback, useRef } from "react";
import {
  Input,
  Markdown,
  Button,
  Icon,
  Paragraph,
  ButtonIcon,
  Card,
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
import { Delete, North, South, X } from "@mui/icons-material";
import { CardTab, CardTabType } from "@/components/Card/CardTab";
import {
  ProblemCard,
  ProblemCardSkeleton,
  ProblemList,
} from "@/features/ProblemList";
import { useSearchParams } from "next/navigation";

export interface ContestEditFormProps {
  contest?: ContestType;
  stateMode?: StateType<ContentViewType>;
  stateProblems: StateType<ProblemContestType[]>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stateLoading: StateType<boolean>;
  onLeaveEditor?: () => void;
}

type ContestCreateEditorTabType = "main" | "problems";

export function ContestCreateEditorForm({
  stateLoading,
  stateProblems,
  onLeaveEditor,
}: ContestEditFormProps) {
  const { initialized } = useProblemEditInitialized();
  const [tab, setTab] = useState<"main" | "problems">("main");
  const [problems, setProblems] = stateProblems;

  const inputRef = useRef<HTMLInputElement>(null);
  const [problem, setProblem] = useState<ProblemType | null>();

  const [query, setQuery] = useState("");
  const [fetching, setFetching] = useState(false);
  const [status, setStatus] = useState<
    "loading" | "loaded" | "invalid" | "added" | "duplicate" | undefined
  >();
  console.log(status);
  const { subTopicOptions, topicOptions } = useTopics();
  const debounce = useDebounce();

  const searchParams = useSearchParams();

  const queryObject: any = useMemo(
    () => ({
      page: searchParams?.get("page") ?? 1,
      search: searchParams?.get("search") ?? "",
      sort: searchParams?.get("sort") ?? "newest",
      subTopic: searchParams?.get("subTopic") ?? undefined,
      topic: searchParams?.get("topic") ?? undefined,
    }),
    [searchParams]
  );

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
      <section className="mb-8" data-color-mode="light">
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
            placeholder="Enter the contest description here..."
            value={description}
            onChange={(newValue) => {
              setFieldValue("description", newValue);
            }}
            onBlur={() => {
              setFieldTouched("description", true);
            }}
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

  /*
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
                variant="ghost"
                onClick={() => handleRemoveProblem(idx)}
              />
            </div>
          </td>
	*/

  const renderContestProblems = useMemo(
    () =>
      problems.map(({ problem: { id, title }, score }, idx) => (
        <tr key={id} className={clsx("border-b border-b-secondary-300")}>
          <td>
            <Paragraph>{title}</Paragraph>
          </td>
          <td>
            <Input
              style={{
                minWidth: "50px",
              }}
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
                icon={Delete}
                size="s"
                variant="ghost"
                color="danger"
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
        {/* <Setting className="mt-2">{renderStatus}</Setting> */}
        {/* {renderContestProblems} */}
        {/* <Button
          variant="outline"
          label="Edit Problems"
          onClick={() => {
            setTab("problems");
          }}
        /> */}
        <div className="mt-4 border border-secondary-300 rounded-md overflow-hidden">
          <table className="table">
            <thead className="border-b border-secondary-300">
              <tr>
                <th className="w-full">
                  <Paragraph>Problem</Paragraph>
                </th>
                <th>
                  <Paragraph>Points</Paragraph>
                </th>
                <th>
                  <Paragraph>Actions</Paragraph>
                </th>
              </tr>
            </thead>
            <tbody>
              {renderContestProblems}
              <tr className="hover:bg-primary-50">
                <td
                  className="text-center cursor-pointer"
                  onClick={() => {
                    setTab("problems");
                  }}
                  colSpan={3}
                >
                  <Paragraph color="primary-6">Import problems</Paragraph>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    ),
    [handleAddProblem, renderContestProblems, status]
  );

  useEffect(() => {
    console.log("Form Values ");
    console.log(values);
    validateForm();
  }, [validateForm, values]);

  useEffect(() => {
    setFieldValue("problems", JSON.stringify(problems));
  }, [problems, setFieldValue]);

  const handleImportProblem = useCallback(
    (problem: ProblemType) => {
      const existingIndex = problems.filter(
        ({ problem: { id } }) => id === problem.id
      ).length;

      if (existingIndex > 0) {
        console.log("Remove ", problem.id);
        setProblems((prev) => {
          const tempProblems = [...prev];
          return tempProblems.filter(
            ({ problem: { id } }) => id !== problem.id
          );
        });
      } else {
        console.log("Add ", problem.id);
        setProblems((prev) => [
          ...prev,
          {
            problem,
            score: 10,
            order: prev.length,
          },
        ]);
      }
    },
    [problems, setProblems]
  );

  const renderListProblem = useCallback(
    (p: ProblemType) => {
      const isAdded =
        problems.filter(({ problem: { id } }) => id === p.id).length > 0;

      return (
        <ProblemCard
          className={clsx(
            "cursor-pointer transition-colors bg-secondary-50 rounded-md",
            isAdded
              ? "border-primary-300 outline outline-4 outline-primary-100"
              : "bg-white hover:bg-secondary-50"
          )}
          key={p.id}
          problem={p as any}
          onClick={() => {
            handleImportProblem(p);
          }}
        />
      );
    },
    [handleImportProblem, problems]
  );

  const renderListProblems = useCallback(
    (listProblems: ProblemType[], loading?: boolean) => {
      console.log("Rerender");
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
            <>
              <ProblemCardSkeleton />
              <ProblemCardSkeleton />
              <ProblemCardSkeleton />
              <ProblemCardSkeleton />
            </>
          ) : (
            listProblems.map((p) => renderListProblem(p))
          )}
        </div>
      );
    },
    [renderListProblem]
  );

  const renderContent = useMemo(() => {
    if (tab === "main") {
      return (
        <Card>
          <>
            {renderContestSettings}
            {renderContestEditor}
            {renderContestProblemTable}
            <div className="flex gap-4 mt-4">
              <Button
                loading={loading}
                disabled={!initialized}
                onClick={() => {
                  setFieldValue("problems", JSON.stringify(problems));
                  submitForm();
                }}
                label="Create"
              />
            </div>
            <div className="flex gap-4 mt-4"></div>
          </>
        </Card>
      );
    } else {
      return (
        <>
          <ProblemList
            query={queryObject}
            renderProblems={renderListProblems}
          />
          <div className="flex gap-4 mt-4">
            <Button
              loading={loading}
              disabled={!initialized}
              onClick={() => {
                setTab("main");
              }}
              label="Back"
              variant="outline"
            />
          </div>
        </>
      );
    }
  }, [
    initialized,
    loading,
    problems,
    queryObject,
    renderContestEditor,
    renderContestProblemTable,
    renderContestSettings,
    renderListProblems,
    setFieldValue,
    submitForm,
    tab,
  ]);

  return renderContent;
}
