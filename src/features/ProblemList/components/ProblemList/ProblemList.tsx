"use client";
import {
  useMemo,
  useEffect,
  useCallback,
  useState,
  useRef,
  ReactNode,
} from "react";
import { API } from "@/api";
import {
  Button,
  ButtonIcon,
  Input,
  Modal,
  Paragraph,
  Pagination,
  IconText,
  Illustration,
} from "@/components";
import { useDebounce, useDevice, usePagination } from "@/hooks";
import {
  ProblemDatabaseType,
  ProblemQuery,
  ProblemSortByType,
  ProblemSubtopicNameType,
  ProblemTopicNameType,
  ProblemType,
} from "@/types";
import { ProblemFilter } from "..";
import { Filter, FilterAlt, Search } from "@mui/icons-material";
import { PROBLEM_PAGINATION_COUNT } from "@/consts";
import { validateProblemQuery } from "@/utils";
import { NumberParam, StringParam, useQueryParams } from "use-query-params";
import { useToast } from "@/hooks/useToast";
import Image from "next/image";
import { EmptySearch } from "@/assets";

interface ProblemListProps {
  query?: ProblemQuery;
  renderProblems: (problems: ProblemType[], loading?: boolean) => ReactNode;
}

export function ProblemList({
  renderProblems: handleRenderProblems,
}: ProblemListProps) {
  const [query, setQuery] = useQueryParams({
    page: NumberParam,
    sort: StringParam,
    search: StringParam,
    topic: StringParam,
    subTopic: StringParam,
  });

  const {
    topic: userTopic = undefined,
    subTopic: userSubTopic = undefined,
    search: userSearch = "",
    sort: userSort = "newest",
    page: userPage = 1,
  } = useMemo(() => validateProblemQuery(query), [query]);

  const [lastUpdated, setLastUpdated] = useState(0);
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

  const [paginationBase, setPagination] = useState({
    page: userPage,
    maxPages: 1,
    count: 1,
    initialized: false,
  });

  const pagination = usePagination({
    pagination: paginationBase,
  });

  const { page } = paginationBase;
  const { device } = useDevice();
  const debounce = useDebounce();
  const lastQuery = useRef<ProblemQuery>();

  const handleUpdateQuery = useCallback(
    (newPage: number) => {
      setLastUpdated(new Date().getTime());

      const queryObject: any = {
        search: search === "" ? undefined : search,
        topic,
        subTopic: subtopic,
        sort: sortBy ?? "newest",
        page: String(newPage),
      };

      setPagination((prev) => ({
        ...prev,
        page: newPage,
      }));

      setQuery(queryObject);
    },
    [search, setQuery, sortBy, subtopic, topic]
  );

  const handleGetProblem = useCallback(async () => {
    if (JSON.stringify(query) === JSON.stringify(lastQuery.current)) return;

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

    API(
      "get_problems",
      {
        params: {
          ...(topic ? { topic: topic } : {}),
          ...(subtopic ? { subTopic: subtopic } : {}),
          ...queryParams[sortBy],
          ...(search !== ""
            ? {
                search,
              }
            : {}),
          page: isNaN(page) ? 1 : page,
          count: PROBLEM_PAGINATION_COUNT,
        },
      },
      {
        onSuccess({
          data: {
            data,
            pagination: { total_records, current_page, total_pages },
          },
        }) {
          setProblems(data);

          setPagination({
            page: current_page,
            maxPages: total_pages,
            count: total_records,
            initialized: true,
          });
          setLoading(false);
        },
      }
    );
  }, [page, query, search, sortBy, subtopic, topic]);

  const handleUpdateDataOnQueryUpdate = useCallback(() => {
    debounce(() => {
      handleGetProblem();
    }, 200);
  }, [debounce, handleGetProblem]);

  useEffect(() => {
    handleUpdateDataOnQueryUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastUpdated]);

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

  const renderAdvanced = useMemo(
    () =>
      device === "mobile" ? (
        <Modal stateVisible={stateAdvanced}>
          <ProblemFilter
            className="flex-col"
            stateSortBy={stateSortBy}
            stateSubTopic={stateSubtopic}
            stateTopic={stateTopic}
            wrapperClassName="flex-col w-80"
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
              wrapperClassName="flex-col"
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
        {paginationBase.initialized && renderPagination}
      </>
    ),
    [
      search,
      loading,
      renderAdvanced,
      paginationBase.initialized,
      renderPagination,
      handleUpdateQuery,
      setAdvanced,
    ]
  );

  const renderProblems = useMemo(
    () =>
      loading || problems.length > 0 ? (
        handleRenderProblems(problems as unknown as ProblemType[], loading)
      ) : (
        <Illustration source={EmptySearch} caption="No matching results." />
      ),
    [handleRenderProblems, loading, problems]
  );

  return (
    <>
      {renderHead}
      {renderProblems}
    </>
  );
}
