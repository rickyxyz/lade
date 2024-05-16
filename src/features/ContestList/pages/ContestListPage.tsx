"use client";
import { useMemo, useEffect, useCallback, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FilterAlt, Search } from "@mui/icons-material";
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
  ContestDatabaseType,
  ProblemQuery,
  ProblemSortByType,
  ProblemSubtopicNameType,
  ProblemTopicNameType,
  ProblemType,
} from "@/types";
import { ContestCard, ContestCardSkeleton, ProblemFilter } from "@/features";

interface ProblemListPageProps {
  query: ProblemQuery;
}

export function ContestListPage({ query }: ProblemListPageProps) {
  const pathname = usePathname();
  const {
    topic: userTopic,
    subTopic: userSubTopic,
    search: userSearch,
    sort: userSort = "newest",
    page: userPage = 1,
  } = query;
  const [problems, setProblems] = useState<ContestDatabaseType[]>([]);
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
  const router = useRouter();
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

    await API("get_contests", {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
          <>
            <ContestCardSkeleton />
            <ContestCardSkeleton />
            <ContestCardSkeleton />
            <ContestCardSkeleton />
          </>
        ) : (
          problems.map((problem) => (
            <ContestCard key={problem.id} contest={problem} isLink />
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
                  handleUpdateQuery();
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
              wrapperClassName="bg-primary-50 flex-col"
              buttonElement={
                <Button
                  className="mt-4 w-fit"
                  onClick={() => handleUpdateQuery()}
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
        <div className="flex flex-col">
          <div className="flex gap-4 mb-8">
            <div className="flex-1 relative">
              <Input
                placeholder="Search..."
                externalWrapperClassName="flex-1"
                wrapperClassName="flex"
                value={search}
                onChange={(e) => {
                  setSearch(e.currentTarget.value);
                }}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    handleUpdateQuery(1);
                  }
                }}
              />
              <ButtonIcon
                className="absolute right-0 top-0 !bg-transparent"
                onClick={() => {
                  handleUpdateQuery(1);
                }}
                disabled={loading}
                icon={Search}
                variant="ghost"
              />
            </div>
            <ButtonIcon
              className="!px-4 !w-10 bg-white"
              onClick={() => {
                setAdvanced((prev) => !prev);
              }}
              disabled={loading}
              icon={FilterAlt}
              variant="outline"
            />
          </div>
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

  return (
    <PageTemplate title="Contests" head={renderHead}>
      {renderProblems}
    </PageTemplate>
  );
}
