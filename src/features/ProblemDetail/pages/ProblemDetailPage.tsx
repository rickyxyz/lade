/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect, useCallback, useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { Button, ButtonOrderType, Crumb, Paragraph } from "@/components";
import { useAppSelector } from "@/libs/redux";
import { useDebounce } from "@/hooks";
import { checkPermission, api } from "@/utils";
import {
  ProblemType,
  ContentViewType,
  UserType,
  ContentAccessType,
} from "@/types";
import { PROBLEM_BLANK } from "@/consts";
import { PageTemplate } from "@/templates";
import { ProblemEditPage } from "../../ProblemCreate";
import { ProblemDetailMain, ProblemDetailMainSkeleton } from "../components";

interface ProblemData {
  name: string;
  value?: string | number;
}

interface ProblemAction {
  name: string;
  permission?: ContentAccessType;
  handler: () => void;
}

interface ProblemProps {
  id: string;
  user: UserType;
}

export function ProblemDetailPage({ id, user }: ProblemProps) {
  const stateProblem = useState<ProblemType>(
    PROBLEM_BLANK as unknown as ProblemType
  );
  const [problem, setProblem] = stateProblem;
  const { title, topic, subTopic, authorId, solved } = problem;
  const stateAccept = useState<unknown>({
    content: "",
  });
  const stateLoading = useState(true);
  const [loading, setLoading] = stateLoading;
  const stateMode = useState<ContentViewType>("view");
  const [mode, setMode] = stateMode;
  const stateUserAnswer = useState<any>();
  const setUserAnswer = stateUserAnswer[1];
  const stateUserSolved = useState(false);
  const setUserSolved = stateUserSolved[1];
  const stateSubmitted = useState<number>();
  const setSubmitted = stateSubmitted[1];
  const stateSolvable = useState(false);
  const setSolvable = stateSolvable[1];

  const router = useRouter();
  const allUserSolved = useAppSelector("solved");

  const solveCache = useMemo(
    () => allUserSolved && allUserSolved[id],
    [allUserSolved, id]
  );

  const permission = useMemo<ContentAccessType>(() => {
    if (user && problem) {
      if (problem.authorId === user.id) {
        return "author";
      }
    }
    return "viewer";
  }, [problem, user]);

  const problemData = useMemo<ProblemData[]>(
    () => [
      {
        name: "Author",
        value: authorId,
      },
      {
        name: "Solved",
        value: (solved ?? []).length,
      },
    ],
    [authorId, solved]
  );

  const handleDeleteProblem = useCallback(async () => {
    await api
      .delete("/problem", {
        params: {
          id,
        },
      })
      .then(() => {
        console.log("problem deleted");
        router.push("/");
      })
      .catch((e) => {
        console.log("Result:");
        console.log(e);
        return null;
      });
  }, [id, router]);

  const problemAction = useMemo<ProblemAction[]>(
    () => [
      {
        name: "Edit",
        handler: () => {
          setMode("edit");
        },
        permission: "author",
      },
      {
        name: "Delete",
        handler: handleDeleteProblem,
        permission: "author",
      },
      {
        name: "Bookmark",
        handler: () => {
          return 0;
        },
        permission: "viewer",
      },
    ],
    [handleDeleteProblem, setMode]
  );

  const renderQuestion = useMemo(() => {
    if (loading || !problem) return <ProblemDetailMainSkeleton />;

    return (
      <ProblemDetailMain
        stateProblem={stateProblem}
        stateAccept={stateAccept}
        stateMode={stateMode}
        stateSubmited={stateSubmitted}
        stateSolvable={stateSolvable}
        stateUserAnswer={stateUserAnswer}
        stateUserSolved={stateUserSolved}
      />
    );
  }, [
    loading,
    problem,
    stateProblem,
    stateAccept,
    stateMode,
    stateSubmitted,
    stateSolvable,
    stateUserAnswer,
    stateUserSolved,
  ]);

  const handleGetProblems = useCallback(async () => {
    if (!loading) return;

    setLoading(true);

    const result = await api
      .get("/problem", {
        params: {
          id,
        },
      })
      .then(({ data }) => {
        const { id } = data as ProblemType;
        setProblem(data);
        setLoading(false);

        return id;
      })
      .catch(() => null);

    if (result && user) {
      let existing: string | null;

      if (!solveCache) {
        const record = await api.get("/solved", {
          params: {
            userId: user.id,
            problemId: result,
          },
        });

        existing = record.data ? JSON.parse(record.data.answer) : null;
      } else {
        existing = solveCache;
      }

      if (existing) {
        setUserAnswer(existing);
        setUserSolved(true);
        setSolvable(false);
        setSubmitted(new Date().getTime());
      } else {
        setSolvable(true);
      }
    }
  }, [
    id,
    loading,
    setLoading,
    setProblem,
    setSolvable,
    setSubmitted,
    setUserAnswer,
    setUserSolved,
    solveCache,
    user,
  ]);

  useEffect(() => {
    handleGetProblems();
  }, [handleGetProblems]);

  const renderBreadCrumb = useMemo(
    () => (
      <Crumb
        crumbs={[
          {
            text: "Problems",
          },
          {
            text: topic?.name,
          },
          {
            text: subTopic?.name,
          },
          {
            text: title,
            color: "secondary-4",
          },
        ]}
      />
    ),
    [subTopic?.name, title, topic?.name]
  );

  const renderHead = useMemo(
    () => (
      <>
        {renderBreadCrumb}
        <h1 className="mb-8">{title}</h1>
      </>
    ),
    [renderBreadCrumb, title]
  );

  const renderProblemData = useMemo(
    () => (
      <ul className="w-48">
        {problemData.map(({ name, value }, idx) => (
          <li
            className={clsx("flex justify-between", idx > 0 && "mt-1")}
            key={name}
          >
            <Paragraph color="secondary-6">{name}</Paragraph>
            <Paragraph>{value}</Paragraph>
          </li>
        ))}
      </ul>
    ),
    [problemData]
  );

  const renderProblemAction = useMemo(
    () => (
      <ul className="w-48">
        {problemAction
          .filter(({ permission: perm }) => checkPermission(permission, perm))
          .map(({ name, handler }, idx) => {
            let order: ButtonOrderType | undefined = "middle";
            if (idx === 0) order = "first";
            if (idx === problemAction.length - 1) order = "last";
            if (problemAction.length === 1) order = undefined;

            return (
              <li key={name}>
                <Button
                  className="!w-full !pl-8"
                  variant="outline"
                  alignText="left"
                  order={order}
                  orderDirection="column"
                  onClick={handler}
                >
                  {name}
                </Button>
              </li>
            );
          })}
      </ul>
    ),
    [permission, problemAction]
  );

  const renderSide = useMemo(
    () => (
      <div className="flex flex-col gap-8">
        {renderProblemData}
        {renderProblemAction}
      </div>
    ),
    [renderProblemAction, renderProblemData]
  );

  const renderViewProblem = useMemo(
    () => (
      <PageTemplate
        className="w-full"
        head={!loading && renderHead}
        side={!loading && renderSide}
      >
        {renderQuestion}
      </PageTemplate>
    ),
    [loading, renderHead, renderQuestion, renderSide]
  );

  const renderEditProblem = useMemo(
    () => (
      <PageTemplate>
        <ProblemEditPage
          stateProblem={stateProblem}
          onEdit={() => {
            setMode("view");
          }}
          onLeaveEditor={() => {
            setMode("view");
          }}
        />
      </PageTemplate>
    ),
    [setMode, stateProblem]
  );

  return mode === "edit" ? renderEditProblem : renderViewProblem;
}
