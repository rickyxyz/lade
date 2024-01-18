import { useMemo, useEffect, useCallback, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { Button, Icon, Input, Modal, Paragraph, Select } from "@/components";
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
import { ProblemCard, ProblemCardSkeleton, ProblemFilter } from "../components";
import { API } from "@/api";
import { useDevice } from "@/hooks";

export function ProblemListPage() {
  const [problems, setProblems] = useState<ProblemType[]>([]);
  const [loading, setLoading] = useState(true);
  const stateTopic = useState<ProblemTopicNameType | undefined>();
  const [topic, setTopic] = stateTopic;
  const stateSubtopic = useState<ProblemSubtopicNameType | undefined>();
  const [subtopic, setSubtopic] = stateSubtopic;
  const stateSortBy = useState<ProblemSortByType>("newest");
  const [sortBy, setSortBy] = stateSortBy;
  const stateAdvanced = useState(false);
  const [advanced, setAdvanced] = stateAdvanced;

  const { device } = useDevice();

  const renderProblems = useMemo(
    () => (
      <div className="flex flex-col gap-8">
        {loading ? (
          <ProblemCardSkeleton />
        ) : (
          problems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))
        )}
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
    () =>
      device === "mobile" ? (
        <Modal stateVisible={stateAdvanced}>
          <ProblemFilter
            className="flex-col"
            stateSortBy={stateSortBy}
            stateSubTopic={stateSubtopic}
            stateTopic={stateTopic}
            wrapperClassName="flex-col bg-white w-80"
            buttonElement={
              <Button
                className="mt-4"
                onClick={() => {
                  setAdvanced(false);
                  handleGetProblem();
                }}
              >
                Apply
              </Button>
            }
          />
        </Modal>
      ) : (
        <>
          {advanced && (
            <ProblemFilter
              stateSortBy={stateSortBy}
              stateSubTopic={stateSubtopic}
              stateTopic={stateTopic}
              wrapperClassName="bg-slate-200 flex-col"
              buttonElement={
                <Button className="mt-4 w-fit" onClick={handleGetProblem}>
                  Apply
                </Button>
              }
            />
          )}
        </>
      ),
    [
      advanced,
      device,
      handleGetProblem,
      setAdvanced,
      stateAdvanced,
      stateSortBy,
      stateSubtopic,
      stateTopic,
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
          <Paragraph
            color="primary-6"
            className="leading-8 my-2 self-end cursor-pointer select-none"
            onClick={() => {
              setAdvanced((prev) => !prev);
            }}
          >
            Advanced Search
          </Paragraph>
          {renderAdvanced}
        </div>
      </>
    ),
    [renderAdvanced, setAdvanced]
  );

  return <PageTemplate head={renderHead}>{renderProblems}</PageTemplate>;
}
