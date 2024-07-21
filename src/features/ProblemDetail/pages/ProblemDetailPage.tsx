"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo, useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { West } from "@mui/icons-material";
import { API } from "@/api";
import { Empty } from "@/assets";
import { ButtonIcon, Illustration } from "@/components";
import { useAppSelector } from "@/libs/redux";
import { PageTemplate } from "@/templates";
import { addToast } from "@/utils";
import { PROBLEM_BLANK } from "@/consts";
import { ProblemType, ContentViewType, UserType } from "@/types";
import { ProblemEditPage } from "../../ProblemCreate";
import { ProblemDetailMain, ProblemDetailMainSkeleton } from "../components";
import { ProblemDetailData } from "../components";
import { useAnswer } from "../hooks";
import { CommentType } from "@/types/comment";

interface ProblemProps {
  id: string;
  user?: UserType | null;
}

export function ProblemDetailPage({ id, user }: ProblemProps) {
  const stateProblem = useState<ProblemType>(PROBLEM_BLANK);
  const [problem, setProblem] = stateProblem;
  const stateComments = useState<CommentType[]>([]);

  const stateAccept = useState<unknown>({
    content: "",
  });

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
  const [commentStatus, setCommentStatus] = useState<
    "unloaded" | "loading" | "loaded" | "error"
  >("unloaded");

  const title = useMemo(() => {
    if (status === "error") return "Unknown Problem";
    if (status === "loaded") return problem.title;
    return "";
  }, [problem.title, status]);

  const setUserAnswer = stateUserAnswer[1];
  const setUserSolved = stateUserSolved[1];
  const setSubmitted = stateSubmitted[1];
  const setAnswerLoading = stateAnswerLoading[1];
  const setSolvable = stateSolvable[1];

  const router = useRouter();
  const allUserSolved = useAppSelector("solveds");

  const solveCache = useMemo(
    () => allUserSolved && allUserSolved[id],
    [allUserSolved, id]
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
        stateComments={stateComments}
        handleCheckAnswer={handleCheckAnswer}
        stateLoading={stateAnswerLoading}
        user={user}
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
    stateComments,
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

  const renderViewProblem = useMemo(
    () => (
      <PageTemplate
        title={title}
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
