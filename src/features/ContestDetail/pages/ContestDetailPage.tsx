/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect, useCallback, useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { API } from "@/api";
import { ButtonIcon, IconText, Modal, Paragraph, Tooltip } from "@/components";
import { useAppSelector } from "@/libs/redux";
import { useDevice } from "@/hooks";
import { checkPermission, api } from "@/utils";
import {
  ContestType,
  UserType,
  ProblemContestType,
  ContentViewType,
  ContentAccessType,
  ContestDatabaseType,
} from "@/types";
import { CONTEST_DEFAULT } from "@/consts";
import { PageTemplate } from "@/templates";
import { ContestDetailMain, ContestDetailMainSkeleton } from "../components";
import { ButtonList, ButtonListEntry } from "@/components/Button/ButtonList";
import { ContestEditPage } from "./ContestEditPage";
import { MoreVert, West } from "@mui/icons-material";
import { ContestDetailData } from "../components/ContestDetailData";
import { ContestLeaderboardPage } from "./ContestLeaderboardPage";
import { ContestProblemsPage } from "./ContestProblemsPage";
import { ContestDetailTemplate } from "../components/ContestDetailTemplate";
import { useListenContestSubmission } from "../hooks";
import { ContestDetailProblemsList } from "../components/ContestDetailProblems";

type ContestTabType = "description" | "edit" | "problem" | "leaderboard";

interface ContestAction extends ButtonListEntry {
  permission?: ContentAccessType;
}

interface ContestProps {
  contestId: string;
  user?: UserType | null;
}

export function ContestDetailPage({ contestId, user }: ContestProps) {
  const stateContest = useState<ContestType>(
    CONTEST_DEFAULT as unknown as ContestType
  );
  const stateProblems = useState<ProblemContestType[]>([]);
  const [problems, setProblems] = stateProblems;
  const [contest, setContest] = stateContest;
  const { title, authorId, createdAt = 0 } = contest;
  const stateAccept = useState<unknown>({
    content: "",
  });
  const stateLoading = useState(true);
  const [loading, setLoading] = stateLoading;
  const statePage = useState<ContestTabType>("description");
  const [page, setPage] = statePage;

  const { problemSubmissions, userSubmissions } = useListenContestSubmission(
    contest as unknown as ContestDatabaseType
  );

  const stateMobileAction = useState(false);
  const setMobileAction = stateMobileAction[1];

  const router = useRouter();
  const allUserSolved = useAppSelector("solveds");
  const { device } = useDevice();

  const solveCache = useMemo(
    () => allUserSolved && allUserSolved[contestId],
    [allUserSolved, contestId]
  );

  const permission = useMemo<ContentAccessType>(() => {
    if (user && contest) {
      if (contest.authorId === user.id) {
        return "author";
      }
    }
    return "viewer";
  }, [contest, user]);

  const handleDeleteContest = useCallback(async () => {
    await api
      .delete("/contest", {
        params: {
          id: contestId,
        },
      })
      .then(() => {
        console.log("contest deleted");
        router.push("/");
      })
      .catch((e) => {
        console.log("Result:");
        console.log(e);
        return null;
      });
  }, [contestId, router]);

  const contestAction = useMemo<ContestAction[]>(
    () => [
      {
        label: "Edit",
        handler: () => {
          setPage("edit");
        },
        permission: "author",
      },
      {
        label: "Delete",
        handler: handleDeleteContest,
        permission: "author",
      },
      {
        label: "Bookmark",
        handler: () => 0,
        permission: "viewer",
      },
    ],
    [handleDeleteContest, setPage]
  );

  const renderContest = useMemo(() => {
    const className = "flex-1";

    if (loading || !contest)
      return <ContestDetailMainSkeleton className={className} />;

    return <ContestDetailMain className={className} contest={contest as any} />;
  }, [loading, contest]);

  const handleGoBack = useCallback(() => {
    if (window.history?.length) {
      router.back();
    } else {
      router.replace("/");
    }
  }, [router]);

  const handleGetContests = useCallback(async () => {
    if (!loading) return;

    setLoading(true);

    await API("get_contest", {
      params: {
        id: contestId,
      },
    })
      .then(({ data }) => {
        if (!data) throw Error("");

        const { id } = data;
        setContest(data as any);
        setProblems(
          data.problemsData.sort((pd1, pd2) => pd1.order - pd2.order)
        );
        setLoading(false);

        return id;
      })
      .catch(() => null);
  }, [loading, setLoading, contestId, setContest, setProblems]);

  useEffect(() => {
    handleGetContests();
  }, [handleGetContests]);

  const renderContestMetadata = useMemo(() => {
    if (loading || !contest) return <ContestDetailMainSkeleton />;

    return (
      <ContestDetailData
        contest={contest as unknown as ContestDatabaseType}
        showAuthorMenu={!!user && contest.authorId === user?.id}
        onEdit={() => {
          setPage("edit");
        }}
        onDelete={() => {
          handleDeleteContest();
        }}
        onNavigateDescription={() => {
          setPage("description");
        }}
        onNavigateLeaderboard={() => {
          setPage("leaderboard");
        }}
        onNavigateProblems={() => {
          setPage("problem");
        }}
      />
    );
  }, [contest, handleDeleteContest, loading, setPage, user]);

  const renderViewContest = useMemo(
    () => (
      <ContestDetailTemplate
        title={title}
        mainElement={renderContest}
        sideElement={renderContestMetadata}
      />
    ),
    [renderContest, renderContestMetadata, title]
  );

  const renderEditContest = useMemo(
    () => (
      <ContestEditPage
        stateContest={stateContest}
        stateProblems={stateProblems}
        onEdit={() => {
          setPage("description");
        }}
        onLeaveEditor={() => {
          setPage("description");
        }}
      />
    ),
    [setPage, stateContest, stateProblems]
  );

  const renderContestProblems = useMemo(
    () => (
      <ContestDetailTemplate
        title={title}
        mainElement={
          <ContestProblemsPage
            contest={contest as any}
            problemSubmissions={problemSubmissions}
            problems={problems}
            user={user}
          />
        }
        sideElement={
          <>
            {renderContestMetadata}
            <ContestDetailProblemsList
              problems={problems}
              submission={problemSubmissions}
              userId={user?.id}
            />
          </>
        }
      />
    ),
    [contest, problemSubmissions, problems, renderContestMetadata, title, user]
  );

  const renderContestLeaderboard = useMemo(
    () => (
      <ContestDetailTemplate
        title={title}
        mainElement={
          <ContestLeaderboardPage
            contest={contest as any}
            problems={problems}
            userSubmissions={userSubmissions}
          />
        }
        sideElement={renderContestMetadata}
      />
    ),
    [contest, problems, renderContestMetadata, userSubmissions]
  );

  const renderContestPage = useMemo(() => {
    switch (page) {
      case "edit":
        return renderEditContest;
      case "leaderboard":
        return renderContestLeaderboard;
      case "problem":
        return renderContestProblems;
      default:
        return renderViewContest;
    }
  }, [
    page,
    renderContestLeaderboard,
    renderContestProblems,
    renderEditContest,
    renderViewContest,
  ]);

  return renderContestPage;
}
