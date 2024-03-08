"use client";
import { useMemo, useEffect, useCallback, useState, useRef } from "react";
import { BsSearch } from "react-icons/bs/index";
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
import { useDebounce, useDevice } from "@/hooks";
import {
  ProblemDatabaseType,
  ProblemQuery,
  ProblemSortByType,
  ProblemSubtopicNameType,
  ProblemTopicNameType,
  ProblemType,
} from "@/types";
import { ProblemCard, ProblemCardSkeleton, ProblemFilter } from "../components";
import { ParsedUrlQuery } from "querystring";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

interface ProblemListPageProps {
  query: ProblemQuery;
}

export function ProblemListPageNew({ query }) {
  const pathname = usePathname();
  const {
    topic: userTopic,
    subTopic: userSubTopic,
    search: userSearch,
    sort: userSort = "newest",
    page: userPage = 1,
  } = query;
  const router = useRouter();

  const [problems, setProblems] = useState<ProblemDatabaseType[]>([]);
  const [loading, setLoading] = useState(true);
  const stateTopic = useState<ProblemTopicNameType | undefined>(userTopic);
  const [topic, setTopic] = stateTopic;
  const stateSubtopic = useState<ProblemSubtopicNameType | undefined>(
    userSubTopic
  );
  const [subtopic, setSubTopic] = stateSubtopic;
  const stateSortBy = useState<ProblemSortByType>(userSort ?? "newest");
  const [sortBy, setSortBy] = stateSortBy;
  const stateAdvanced = useState(false);
  const [search, setSearch] = useState(userSearch ?? "");
  const [advanced, setAdvanced] = stateAdvanced;
  const initialized = useRef(false);
  const [pagination, setPagination] = useState({
    page: userPage,
    maxPages: 1,
    count: 1,
    initialized: false,
  });
  const { device } = useDevice();
  const debounce = useDebounce();
  const lastQuery = useRef<ProblemQuery>();

  const handleUpdateStateOnQueryUpdate = useCallback(
    (newPage = userPage) => {
      setTopic(userTopic);
      setSubTopic(userSubTopic);
      setSortBy(userSort);
      setSearch(userSearch ?? "");
      setPagination((prev) => {
        const currentMax = prev.maxPages;
        let newValue = isNaN(newPage) ? 1 : Number(newPage);
        if (newValue > currentMax) newValue = currentMax;
        if (newValue <= 0) newValue = 1;

        return {
          ...prev,
          page: newValue,
        };
      });
    },
    [
      setSortBy,
      setSubTopic,
      setTopic,
      userPage,
      userSearch,
      userSort,
      userSubTopic,
      userTopic,
    ]
  );

  const handleUpdateQuery = useCallback(
    (newPage = userPage) => {
      const queryObject: any = {
        // ...(searchParams ? searchParams.),
        search,
        topic,
        subTopic: subtopic,
        sort: sortBy ?? "newest",
        page: String(newPage),
      };
      if (search === "") delete queryObject.search;
      if (!topic) delete queryObject.topic;
      if (!subtopic) delete queryObject.subTopic;

      const newParams = new URLSearchParams(queryObject);

      if (initialized.current) {
        console.log("Test123");
        // console.log(`${pathname}/${newParams}`);
        router.push(`${pathname}?${newParams}`);
      }

      initialized.current = true;
    },
    [pathname, router, search, sortBy, subtopic, topic, userPage]
  );

  const handleGetProblem = useCallback(async () => {
    if (JSON.stringify(query) === JSON.stringify(lastQuery.current)) {
      return;
    }

    handleUpdateStateOnQueryUpdate();

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
        ...(userTopic ? { topic: userTopic } : {}),
        ...(userSubTopic ? { subTopic: userSubTopic } : {}),
        ...queryParams[userSort],
        ...(userSearch !== ""
          ? {
              search: userSearch,
            }
          : {}),
        page: isNaN(userPage) ? 1 : userPage,
      },
    })
      .then(
        ({
          data: {
            data,
            pagination: { total_records, current_page, total_pages },
          },
        }) => {
          lastQuery.current = query;

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
  }, [
    handleUpdateStateOnQueryUpdate,
    query,
    userPage,
    userSearch,
    userSort,
    userSubTopic,
    userTopic,
  ]);

  const handleUpdateDataOnQueryUpdate = useCallback(() => {
    debounce(() => {
      handleGetProblem();
    }, 200);
  }, [debounce, handleGetProblem]);

  useEffect(() => {
    handleUpdateDataOnQueryUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const renderPagination = useMemo(
    () => (
      <Pagination
        pagination={pagination}
        onClick={(newPage) => {
          if (!loading) {
            handleUpdateQuery(newPage);
          }
        }}
      />
    ),
    [handleUpdateQuery, loading, pagination]
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
                  handleUpdateQuery(1);
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
                  onClick={() => handleUpdateQuery(1)}
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
      handleUpdateQuery,
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
            value={search}
            onChange={(e) => {
              setSearch(e.currentTarget.value);
            }}
            rightElement={
              <ButtonIcon
                className="!px-4"
                variant="outline"
                order="last"
                orderDirection="row"
                onClick={() => {
                  handleUpdateQuery(1);
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
      handleUpdateQuery,
      setAdvanced,
    ]
  );

  return <PageTemplate head={renderHead}>{renderProblems}</PageTemplate>;
}
