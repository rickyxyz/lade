/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect, useCallback, useState, ReactNode } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { API } from "@/api";
import { ButtonIcon, IconText, Modal, Paragraph, Tooltip } from "@/components";
import { useAppSelector } from "@/libs/redux";
import { useDebounce, useDevice } from "@/hooks";
import { checkPermission, api } from "@/utils";
import {
  ContestType,
  UserType,
  ProblemContestType,
  ContentViewType,
  ContentAccessType,
  ContestDatabaseType,
  ContestQuery,
  ContestTabType,
  ContestParticipantType,
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
import { SubmissionData, useListenContestSubmission } from "../hooks";
import { ContestDetailProblemsList } from "../components/ContestDetailProblems";

interface ContestAction extends ButtonListEntry {
  permission?: ContentAccessType;
}

interface ContestProps {
  contestId: string;
  contestQuery: ContestQuery;
  user?: UserType | null;
}

export function ContestDetailPage({
  contestQuery,
  contestId,
  user,
}: ContestProps) {
  const { tab: userPage } = contestQuery;
  const stateContest = useState<ContestType>(
    CONTEST_DEFAULT as unknown as ContestType
  );
  const stateProblems = useState<ProblemContestType[]>([]);
  const [problems, setProblems] = stateProblems;
  const [contest, setContest] = stateContest;
  const { title, authorId, createdAt = 0 } = contest;

  const stateLoading = useState(true);
  const [loading, setLoading] = stateLoading;
  const statePage = useState<ContestTabType>(userPage);
  const [page, setPage] = statePage;
  const debounce = useDebounce();

  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [userSubmissions, setUserSubmissions] = useState<
    ContestParticipantType[]
  >([]);

  const handleDebounceSubmissions = useCallback(
    (data: SubmissionData) => {
      setLeaderboardLoading(true);
      debounce(() => {
        setUserSubmissions(data.userSubmissions);
        setLeaderboardLoading(false);
      }, 2000);
    },
    [debounce]
  );

  useEffect(() => {
    console.log("leaderboard loading ", leaderboardLoading);
  }, [leaderboardLoading]);

  const { problemSubmissions } = useListenContestSubmission(
    contest as unknown as ContestDatabaseType,
    handleDebounceSubmissions
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

  const renderMainLoading = useMemo(
    () => <ContestDetailMainSkeleton className="flex-1" />,
    []
  );

  const renderSideLoading = useMemo(() => <ContestDetailMainSkeleton />, []);

  const renderLoading = useMemo(
    () => (
      <ContestDetailTemplate
        mainElement={<ContestDetailMainSkeleton className="flex-1" />}
        sideElement={<ContestDetailMainSkeleton />}
      />
    ),
    []
  );

  const renderContestMetadata = useCallback(
    (sideElement?: ReactNode) => {
      if (loading) return renderSideLoading;

      return (
        <>
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
              setPage("problems");
            }}
          />
          {sideElement}
        </>
      );
    },
    [contest, handleDeleteContest, loading, renderSideLoading, setPage, user]
  );

  const renderContest = useMemo(() => {
    const className = "flex-1";
    if (loading) return renderMainLoading;

    return <ContestDetailMain className={className} contest={contest as any} />;
  }, [contest, loading, renderMainLoading]);

  const renderViewContest = useMemo(() => {
    const className = "flex-1";
    const mainElement = loading ? (
      renderMainLoading
    ) : (
      <ContestDetailMain className={className} contest={contest as any} />
    );
    const sideElement = renderContestMetadata();

    return (
      <ContestDetailTemplate
        title={title}
        mainElement={mainElement}
        sideElement={sideElement}
      />
    );
  }, [contest, loading, renderContestMetadata, renderMainLoading, title]);

  const renderEditContest = useMemo(() => {
    if (loading) return renderMainLoading;
    return (
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
    );
  }, [loading, renderMainLoading, setPage, stateContest, stateProblems]);

  const renderContestProblems = useMemo(() => {
    const mainElement = loading ? (
      renderMainLoading
    ) : (
      <ContestProblemsPage
        contest={contest as any}
        problemSubmissions={problemSubmissions}
        problems={problems}
        user={user}
      />
    );
    const sideElement = renderContestMetadata(
      <ContestDetailProblemsList
        problems={problems}
        submission={problemSubmissions}
        userId={user?.id}
      />
    );

    return (
      <ContestDetailTemplate
        title={title}
        mainElement={mainElement}
        sideElement={sideElement}
      />
    );
  }, [
    contest,
    loading,
    problemSubmissions,
    problems,
    renderContestMetadata,
    renderMainLoading,
    title,
    user,
  ]);

  const renderContestLeaderboard = useMemo(() => {
    const mainElement = loading ? (
      renderMainLoading
    ) : (
      <ContestLeaderboardPage
        contest={contest as any}
        problems={problems}
        userSubmissions={userSubmissions}
        loading={leaderboardLoading}
      />
    );
    const sideElement = renderContestMetadata();

    return (
      <ContestDetailTemplate
        title={title}
        mainElement={mainElement}
        sideElement={sideElement}
      />
    );
  }, [
    contest,
    leaderboardLoading,
    loading,
    problems,
    renderContestMetadata,
    renderMainLoading,
    title,
    userSubmissions,
  ]);

  const renderContestPage = useMemo(() => {
    switch (page) {
      case "edit":
        return renderEditContest;
      case "leaderboard":
        return renderContestLeaderboard;
      case "problems":
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
