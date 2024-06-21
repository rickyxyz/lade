"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo, useEffect, useCallback, useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { API } from "@/api";
import {
  ButtonIcon,
  Modal,
  ButtonList,
  ButtonListEntry,
  Paragraph,
  Tooltip,
  Illustration,
} from "@/components";
import { useAppSelector } from "@/libs/redux";
import { PageTemplate } from "@/templates";
import { checkPermission, addToast } from "@/utils";
import { useDevice } from "@/hooks";
import { PROBLEM_BLANK } from "@/consts";
import {
  ProblemType,
  ContentViewType,
  UserType,
  ContentAccessType,
} from "@/types";
import { ProblemEditPage } from "../../ProblemCreate";
import {
  ProblemDetailMain,
  ProblemDetailMainSkeleton,
  ProblemDetailTopics,
} from "../components";
import { MoreVert, West } from "@mui/icons-material";
import { ProblemDetailData } from "../components";
import { useAnswer } from "../hooks";
import { Empty } from "@/assets/Empty";

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
  // const stateLoading = useState(true);
  const [mode, setMode] = useState<ContentViewType>("view");
  const {
    stateLoading: stateAnswerLoading,
    stateSolvable,
    stateSubmitted,
    stateUserAnswer,
    stateUserSolved,
    stateCooldown,
    handleCheckAnswer,
  } = useAnswer({
    problem,
    user,
  });
  const [status, setStatus] = useState<
    "unloaded" | "loading" | "loaded" | "error"
  >("unloaded");
  // const stateUserAnswer = useState<any>();
  const setUserAnswer = stateUserAnswer[1];
  // const stateUserSolved = useState(false);
  const setUserSolved = stateUserSolved[1];
  // const stateSubmitted = useState<number>();
  const setSubmitted = stateSubmitted[1];
  // const stateSolvable = useState(false);
  const setAnswerLoading = stateAnswerLoading[1];
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

  const handleDeleteProblem = useCallback(() => {
    API(
      "delete_problem",
      {
        params: { id },
      },
      {
        onSuccess() {
          router.push("/");
          addToast({
            text: "Problem deleted.",
          });
        },
        onFail() {
          addToast({
            text: "Could not delete the problem.",
          });
        },
      }
    );
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

    if (status !== "loaded" || !problem)
      return <ProblemDetailMainSkeleton className={className} />;

    return (
      <ProblemDetailMain
        className={className}
        stateProblem={stateProblem}
        stateAccept={stateAccept}
        stateSubmited={stateSubmitted}
        stateSolvable={stateSolvable}
        stateUserAnswer={stateUserAnswer}
        stateUserSolved={stateUserSolved}
        stateCooldown={stateCooldown}
        handleCheckAnswer={handleCheckAnswer}
        stateLoading={stateAnswerLoading}
      />
    );
  }, [
    status,
    problem,
    stateProblem,
    stateAccept,
    stateSubmitted,
    stateSolvable,
    stateUserAnswer,
    stateUserSolved,
    stateCooldown,
    handleCheckAnswer,
    stateAnswerLoading,
  ]);

  const renderQuestionMetadata = useMemo(() => {
    const className = "flex-grow md:max-w-[320px] h-fit";

    if (status !== "loaded" || !problem)
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
  }, [handleDeleteProblem, problem, status, user]);

  const handleGoBack = useCallback(() => {
    if (window.history?.length) {
      router.back();
    } else {
      router.replace("/");
    }
  }, [router]);

  const handleGetProblems = useCallback(async () => {
    if (status !== "unloaded") return;

    setStatus("loading");

    const result = await API("get_problem", {
      params: {
        id,
      },
    })
      .then(({ data }) => {
        if (!data) throw Error();

        const { id } = data;
        setProblem(data);
        setStatus("loaded");

        return id;
      })
      .catch(() => {
        setStatus("error");
      });

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

      setAnswerLoading(false);
      if (existing) {
        setUserAnswer(existing);
        setUserSolved(true);
        setSolvable(false);
        setSubmitted(new Date().getTime());
      } else {
        setSolvable(true);
      }
    } else {
      setAnswerLoading(false);
      setSolvable(false);
    }
  }, [
    id,
    setAnswerLoading,
    setProblem,
    setSolvable,
    setSubmitted,
    setUserAnswer,
    setUserSolved,
    solveCache,
    status,
    user,
  ]);

  useEffect(() => {
    handleGetProblems();
  }, [handleGetProblems]);

  const renderNavigation = useMemo(
    () =>
      status === "loaded" && (
        <ButtonIcon
          icon={West}
          size="xs"
          variant="ghost"
          onClick={handleGoBack}
        />
      ),
    [handleGoBack, status]
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
        title={status === "error" ? title : "Unknown Problem"}
        leftTitle={renderNavigation}
        className="w-full"
      >
        {status === "error" ? (
          <Illustration
            source={Empty}
            caption="This problem does not exist."
            showGoBackButton
          />
        ) : (
          <div className="flex flex-row flex-wrap gap-8">
            {renderQuestion}
            {renderQuestionMetadata}
          </div>
        )}
      </PageTemplate>
    ),
    [renderNavigation, renderQuestion, renderQuestionMetadata, status, title]
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
