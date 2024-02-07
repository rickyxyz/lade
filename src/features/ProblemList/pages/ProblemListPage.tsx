import { useMemo, useEffect, useCallback, useState, useRef } from "react";
import { BsSearch } from "react-icons/bs";
import { API } from "@/api";
import { PageTemplate } from "@/templates";
import {
  Button,
  ButtonIcon,
  Input,
  Modal,
  Paragraph,
  Pagination,
} from "@/components";
import { useDevice } from "@/hooks";
import {
  ProblemQuery,
  ProblemSortByType,
  ProblemSubtopicNameType,
  ProblemTopicNameType,
  ProblemType,
} from "@/types";
import { ProblemCard, ProblemCardSkeleton, ProblemFilter } from "../components";
import { PROBLEM_PAGINATION_COUNT } from "@/consts";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

interface ProblemListPageProps {
  query: ProblemQuery;
}

export function ProblemListPage({ query }: ProblemListPageProps) {
  const {
    topic: userTopic,
    subTopic: userSubTopic,
    search: userSearch,
    sort: userSort,
  } = query;
  const [problems, setProblems] = useState<ProblemType[]>([]);
  const [loading, setLoading] = useState(true);
  const stateTopic = useState<ProblemTopicNameType | undefined>(userTopic);
  const topic = stateTopic[0];
  const stateSubtopic = useState<ProblemSubtopicNameType | undefined>(
    userSubTopic
  );
  const subtopic = stateSubtopic[0];
  const stateSortBy = useState<ProblemSortByType>(userSort ?? "newest");
  const sortBy = stateSortBy[0];
  const stateAdvanced = useState(false);
  const router = useRouter();
  const [search, setSearch] = useState(userSearch ?? "");
  const [advanced, setAdvanced] = stateAdvanced;
  const initialized = useRef(false);
  const [pagination, setPagination] = useState({
    page: 1,
    maxPages: 1,
    count: 1,
    initialized: false,
  });
  const { device } = useDevice();
  const { page } = useMemo(() => {
    const { page, maxPages, count } = pagination;

    let visiblePages = device === "mobile" ? 3 : 5;
    visiblePages = Math.min(visiblePages, maxPages);

    const half = Math.floor(visiblePages / 2);

    let newStyle = "first";

    if (page + half >= maxPages) {
      newStyle = "last";
    } else if (page - half <= 1) {
      newStyle = "first";
    } else {
      newStyle = "middle";
    }

    const from = (page - 1) * PROBLEM_PAGINATION_COUNT + 1;
    const to = Math.min(page * PROBLEM_PAGINATION_COUNT, count);

    return {
      page,
      maxPages,
      count,
      visiblePages,
      half,
      style: newStyle,
      contentFrom: from,
      contentTo: to,
    };
  }, [device, pagination]);

  const handleGetProblem = useCallback(
    async (newPage?: number) => {
      setLoading(true);

      const queryObject: ParsedUrlQuery = {
        ...router.query,
        search,
        topic,
        subTopic: subtopic,
        sort: sortBy,
      };
      if (search === "") delete queryObject.search;
      if (!topic) delete queryObject.topic;
      if (!subtopic) delete queryObject.subTopic;

      if (initialized.current) {
        router.replace({
          query: queryObject,
        });
      }

      initialized.current = true;

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
          ...(search !== ""
            ? {
                search,
              }
            : {}),
          page: newPage ?? page,
        },
      })
        .then(
          ({
            data: {
              data,
              pagination: { total_records, current_page, total_pages },
            },
          }) => {
            setProblems(data);

            setPagination({
              page: current_page,
              maxPages: total_pages,
              count: total_records,
              initialized: true,
            });
            setLoading(false);
          }
        )
        .catch((e) => {
          console.log("Result:");
          console.log(e);
        });
    },
    [page, router, search, sortBy, subtopic, topic]
  );

  useEffect(() => {
    handleGetProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderPagination = useMemo(
    () => (
      <Pagination
        pagination={pagination}
        onClick={(newPage) => {
          if (!loading) handleGetProblem(newPage);
        }}
      />
    ),
    [handleGetProblem, loading, pagination]
  );

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
                disabled={loading}
                label="Apply"
              />
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
                <Button
                  className="mt-4 w-fit"
                  onClick={() => handleGetProblem()}
                  disabled={loading}
                  label="Apply"
                />
              }
            />
          )}
        </>
      ),
    [
      advanced,
      device,
      handleGetProblem,
      loading,
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
            defaultValue={search}
            onChange={(e) => {
              const newSearch = e.currentTarget.value;
              setSearch(newSearch);
            }}
            rightElement={
              <ButtonIcon
                className="!px-4"
                variant="outline"
                order="last"
                orderDirection="row"
                onClick={() => {
                  handleGetProblem();
                }}
                disabled={loading}
                icon={BsSearch}
              />
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
        {pagination.initialized && renderPagination}
      </>
    ),
    [
      search,
      loading,
      renderAdvanced,
      pagination.initialized,
      renderPagination,
      handleGetProblem,
      setAdvanced,
    ]
  );

  return <PageTemplate head={renderHead}>{renderProblems}</PageTemplate>;
}
