import { useMemo, useEffect, useCallback, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { Button, Icon, Input, Paragraph, Select } from "@/components";
import { PageTemplate } from "@/templates";
import {
  PROBLEM_SORT_BY_OPTIONS,
  PROBLEM_SUBTOPIC_OPTIONS,
  PROBLEM_TOPIC_OPTIONS,
} from "@/consts";
import {
  ProblemSortByType,
  ProblemSubtopicNameType,
  ProblemTopicNameType,
  ProblemType,
} from "@/types";
import { ProblemCard, ProblemCardSkeleton } from "../components";
import { API } from "@/api";

export function ProblemListPage() {
  const [problems, setProblems] = useState<ProblemType[]>([]);
  const [loading, setLoading] = useState(true);
  const stateTopic = useState<ProblemTopicNameType | undefined>();
  const [topic, setTopic] = stateTopic;
  const stateSubtopic = useState<ProblemSubtopicNameType | undefined>();
  const [subtopic, setSubtopic] = stateSubtopic;
  const stateSortBy = useState<ProblemSortByType>("newest");
  const [sortBy, setSortBy] = stateSortBy;

  const renderProblems = useMemo(
    () =>
      loading ? (
        <ProblemCardSkeleton />
      ) : (
        <div className="flex flex-col gap-8">
          {problems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      ),
    [loading, problems]
  );

  const handleGetProblem = useCallback(async () => {
    setLoading(true);

    const queryParams: Record<
      ProblemSortByType,
      {
        sort: keyof ProblemType;
        sortBy: "asc" | "desc";
      }
    > = {
      newest: {
        sort: "createdAt",
        sortBy: "desc",
      },
      oldest: {
        sort: "createdAt",
        sortBy: "asc",
      },
      "most-solved": {
        sort: "solveds",
        sortBy: "desc",
      },
      "least-solved": {
        sort: "solveds",
        sortBy: "asc",
      },
    };

    await API("get_problems", {
      params: {
        ...(topic ? { topic } : {}),
        ...(subtopic ? { subTopic: subtopic } : {}),
        ...queryParams[sortBy],
      },
    })
      .then(({ data }) => {
        setProblems(data);
        setLoading(false);
      })
      .catch((e) => {
        console.log("Result:");
        console.log(e);
      });
  }, [sortBy, subtopic, topic]);

  useEffect(() => {
    handleGetProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderAdvanced = useMemo(
    () => (
      <div className="bg-slate-200 rounded-lg !p-4 mb-8">
        <div className="flex gap-4">
          <div className="flex-1">
            <Paragraph weight="semibold">Topics</Paragraph>
            <Select
              className="w-full"
              inputClassName="w-full"
              options={PROBLEM_TOPIC_OPTIONS}
              selectedOption={topic}
              onSelectOption={(option) => {
                option ? setTopic(option.id) : setTopic(undefined);
                setSubtopic(undefined);
              }}
              unselectedText="Any"
              optional
            />
          </div>
          <div className="flex-1">
            <Paragraph weight="semibold">Subtopics</Paragraph>
            <Select
              className="w-full"
              inputClassName="w-full"
              options={topic ? PROBLEM_SUBTOPIC_OPTIONS[topic] : []}
              selectedOption={subtopic}
              onSelectOption={(option) => {
                option ? setSubtopic(option.id) : setTopic(undefined);
              }}
              disabled={!topic}
              unselectedText="Any"
              optional
            />
          </div>
          <div className="flex-1">
            <Paragraph weight="semibold">Sort by</Paragraph>
            <Select
              className="w-full"
              inputClassName="w-full"
              options={PROBLEM_SORT_BY_OPTIONS}
              selectedOption={sortBy}
              onSelectOption={(option) => {
                option && setSortBy(option.id);
              }}
            />
          </div>
        </div>
        <Button className="mt-4" onClick={handleGetProblem}>
          Apply
        </Button>
      </div>
    ),
    [
      handleGetProblem,
      setSortBy,
      setSubtopic,
      setTopic,
      sortBy,
      subtopic,
      topic,
    ]
  );

  const renderHead = useMemo(
    () => (
      <>
        <Paragraph as="h1" className="mb-8">
          Problems
        </Paragraph>
        <div className="flex flex-col">
          <Input
            externalWrapperClassName="flex-1"
            wrapperClassName="flex"
            className="!rounded-none !rounded-l-md"
            rightElement={
              <Button variant="outline" order="last" orderDirection="row">
                <Icon IconComponent={BsSearch} />
              </Button>
            }
          />
          <Paragraph color="primary-6" className="leading-8 my-2 self-end">
            Advanced Search
          </Paragraph>
          {renderAdvanced}
        </div>
      </>
    ),
    [renderAdvanced]
  );

  return <PageTemplate head={renderHead}>{renderProblems}</PageTemplate>;
}
