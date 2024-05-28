"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo, useEffect, useCallback, useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { API } from "@/api";
import {
  ButtonIcon,
  Card,
  IconText,
  Spinner,
  Modal,
  Paragraph,
  Tooltip,
} from "@/components";
import { useAppSelector } from "@/libs/redux";
import { useDevice } from "@/hooks";
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
import {
  ProblemDetailMain,
  ProblemDetailMainSkeleton,
  ProblemDetailTopics,
} from "../components";
import { ButtonList, ButtonListEntry } from "@/components/Button/ButtonList";
import { MoreVert, West } from "@mui/icons-material";
import { ProblemDetailData } from "../components/ProblemDetailData";

interface ProblemData {
  label: string;
  value?: string | number;
  tooltip?: string;
}

interface ProblemAction extends ButtonListEntry {
  permission?: ContentAccessType;
}

interface ProblemProps {
  id: string;
  user?: UserType | null;
}

export function ProblemDetailPage({ id, user }: ProblemProps) {
  const stateProblem = useState<ProblemType>(PROBLEM_BLANK);
  const [problem, setProblem] = stateProblem;
  const {
    title,
    topicId,
    subTopicId,
    authorId,
    solveds,
    createdAt = 0,
    topic,
    subTopic,
  } = problem;
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
  const stateMobileAction = useState(false);
  const setMobileAction = stateMobileAction[1];

  const router = useRouter();
  const allUserSolved = useAppSelector("solveds");
  const { device } = useDevice();

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
        label: "Author",
        value: authorId,
      },
      {
        label: "Date",
        value: new Date(createdAt).toLocaleDateString("en-GB"),
        tooltip: `${new Date(createdAt).toLocaleString("en-GB")}`,
      },
      {
        label: "Solved",
        value: (solveds ?? []).length,
      },
    ],
    [authorId, createdAt, solveds]
  );

  const handleDeleteProblem = useCallback(async () => {
    await API("delete_problem", {
      params: { id },
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
        label: "Edit",
        handler: () => {
          setMode("edit");
        },
        permission: "author",
      },
      {
        label: "Delete",
        handler: handleDeleteProblem,
        permission: "author",
      },
      {
        label: "Bookmark",
        handler: () => 0,
        permission: "viewer",
      },
    ],
    [handleDeleteProblem, setMode]
  );

  const renderQuestion = useMemo(() => {
    const className = "flex-1";

    if (loading || !problem)
      return <ProblemDetailMainSkeleton className={className} />;

    return (
      <ProblemDetailMain
        className={className}
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

  const renderQuestionMetadata = useMemo(() => {
    const className = "flex-grow md:max-w-[320px] h-fit";

    if (loading || !problem)
      return <ProblemDetailMainSkeleton className={className} />;

    return (
      <ProblemDetailData
        className={className}
        problem={problem}
        showAuthorMenu={!!user && problem.authorId === user?.id}
        onEdit={() => {
          setMode("edit");
        }}
        onDelete={() => {
          handleDeleteProblem();
        }}
      />
    );
  }, [handleDeleteProblem, loading, problem, setMode, user]);

  const handleGoBack = useCallback(() => {
    if (window.history?.length) {
      router.back();
    } else {
      router.replace("/");
    }
  }, [router]);

  const handleGetProblems = useCallback(async () => {
    if (!loading) return;

    setLoading(true);

    const result = await API("get_problem", {
      params: {
        id,
      },
    })
      .then(({ data }) => {
        if (!data) throw Error("");

        const { id } = data;
        setProblem(data);
        setLoading(false);

        return id;
      })
      .catch(() => null);

    if (result && user) {
      let existing: string | null;

      if (!solveCache) {
        const record = await API("get_solved", {
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

  const renderNavigation = useMemo(
    () => (
      <ButtonIcon
        icon={West}
        size="xs"
        variant="ghost"
        onClick={handleGoBack}
      />
    ),
    [handleGoBack]
  );

  const renderHead = useMemo(
    () => (
      <>
        {renderNavigation}
        <div className="flex justify-between mb-4">
          <div className="flex-1">
            <h1 className="mt-2 mb-4">{title}</h1>
            {topic && subTopic && (
              <ProblemDetailTopics
                className="mb-8"
                topic={topic.name}
                subTopic={subTopic.name}
              />
            )}
          </div>
          {device === "mobile" && (
            <ButtonIcon
              variant="outline"
              onClick={() => {
                setMobileAction((prev) => !prev);
              }}
              icon={MoreVert}
            />
          )}
        </div>
      </>
    ),
    [device, renderNavigation, setMobileAction, subTopic, title, topic]
  );

  const renderProblemData = useMemo(
    () => (
      <ul className="md:w-48">
        {problemData.map(({ label, value, tooltip }, idx) => (
          <li
            className={clsx("flex justify-between", idx > 0 && "mt-1")}
            key={label}
          >
            <Paragraph color="secondary-5">{label}</Paragraph>
            {tooltip ? (
              <Tooltip
                optionWidth={0}
                triggerElement={<Paragraph>{value}</Paragraph>}
                hiddenElement={
                  <Paragraph className="whitespace-nowrap">{tooltip}</Paragraph>
                }
                classNameInner="w-fit px-4 py-2"
                topOffset={32}
                direction="left"
                showOnHover
              />
            ) : (
              <Paragraph>{value}</Paragraph>
            )}
          </li>
        ))}
      </ul>
    ),
    [problemData]
  );

  const renderProblemAction = useMemo(() => {
    const actions = problemAction.filter(({ permission: perm }) =>
      checkPermission(permission, perm)
    );
    return <ButtonList list={actions} className="w-48" />;
  }, [permission, problemAction]);

  const renderMobileAction = useMemo(
    () => <Modal stateVisible={stateMobileAction}>{renderProblemAction}</Modal>,
    [renderProblemAction, stateMobileAction]
  );

  const renderSide = useMemo(
    () => (
      <div className="flex flex-col gap-8">
        {renderProblemData}
        {device === "mobile" ? renderMobileAction : renderProblemAction}
      </div>
    ),
    [device, renderMobileAction, renderProblemAction, renderProblemData]
  );

  const renderViewProblem = useMemo(
    () => (
      <PageTemplate
        title={title}
        leftTitle={renderNavigation}
        className="w-full"
      >
        <div className="flex flex-row flex-wrap gap-8">
          {renderQuestion}
          {renderQuestionMetadata}
        </div>
      </PageTemplate>
    ),
    [renderNavigation, renderQuestion, renderQuestionMetadata, title]
  );

  const renderEditProblem = useMemo(
    () => (
      <ProblemEditPage
        stateProblem={stateProblem}
        onEdit={() => {
          setMode("view");
        }}
        onLeaveEditor={() => {
          setMode("view");
        }}
      />
    ),
    [setMode, stateProblem]
  );

  return mode === "edit" ? renderEditProblem : renderViewProblem;
}
