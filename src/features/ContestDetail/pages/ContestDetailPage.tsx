/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect, useCallback, useState, ReactNode } from "react";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { API } from "@/api";
import {
  ButtonIcon,
  IconText,
  Illustration,
  Modal,
  Paragraph,
  Tooltip,
} from "@/components";
import { useAppSelector } from "@/libs/redux";
import { useDebounce, useDevice } from "@/hooks";
import { checkPermission, api, addToast } from "@/utils";
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
import { useQueryParam } from "use-query-params";
import { Empty } from "@/assets/Empty";

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
  const pathname = usePathname();
  const router = useRouter();

  const { tab: userPage } = contestQuery;
  const stateContest = useState<ContestType>(
    CONTEST_DEFAULT as unknown as ContestType
  );
  const stateProblems = useState<ProblemContestType[]>([]);
  const [problems, setProblems] = stateProblems;
  const [contest, setContest] = stateContest;
  const { authorId, createdAt = 0 } = contest;

  const [status, setStatus] = useState<
    "unloaded" | "loading" | "loaded" | "error"
  >("unloaded");

  const title = useMemo(
    () => (status === "error" ? "Unknown Contest" : contest.title),
    [status, contest]
  );

  const statePage = useQueryParam<ContestTabType>("tab");
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
        setUserSubmissions(data.userSubmissionsArray);
        setLeaderboardLoading(false);
      }, 2000);
    },
    [debounce]
  );

  useEffect(() => {
    console.log("leaderboard loading ", leaderboardLoading);
  }, [leaderboardLoading]);

  const { problemSubmissions, userSubmissions: userSubmissionsObject } =
    useListenContestSubmission(
      contest as unknown as ContestDatabaseType,
      handleDebounceSubmissions
    );

  const stateMobileAction = useState(false);
  const setMobileAction = stateMobileAction[1];

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

  const handleDeleteContest = useCallback(() => {
    API(
      "delete_contest",
      {
        params: {
          id: contestId,
        },
      },
      {
        onSuccess() {
          router.push("/");
          addToast({ text: "Contest deleted." });
        },
        onFail() {
          addToast({ text: "Could not delete the contest." });
        },
        showFailMessage: false,
      }
    );
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

  const handleGetContest = useCallback(() => {
    if (status !== "unloaded") return;

    setStatus("loading");

    API(
      "get_contest",
      {
        params: {
          id: contestId,
        },
      },
      {
        onSuccess({ data }) {
          if (!data) throw Error("");

          const { problemsData = [] } = data;
          setContest(data);
          setProblems(problemsData.sort((pd1, pd2) => pd1.order - pd2.order));
          setStatus("loaded");
        },
        onFail() {
          setStatus("error");
        },
      }
    );
  }, [contestId, setContest, setProblems, status]);

  useEffect(() => {
    handleGetContest();
  }, [handleGetContest]);

  const renderMainLoading = useMemo(
    () => <ContestDetailMainSkeleton className="flex-1" />,
    []
  );

  const renderSideLoading = useMemo(() => <ContestDetailMainSkeleton />, []);

  const renderContestMetadata = useCallback(
    (sideElement?: ReactNode) => {
      if (status !== "loaded") return renderSideLoading;

      return (
        <>
          <ContestDetailData
            contest={contest}
            showAuthorMenu={!!user && contest.authorId === user?.id}
            onEdit={() => {
              setPage("edit");
            }}
            onDelete={() => {
              handleDeleteContest();
            }}
            onNavigate={(newTab) => {
              newTab && setPage(newTab);
            }}
          />
          {sideElement}
        </>
      );
    },
    [contest, handleDeleteContest, status, renderSideLoading, setPage, user]
  );

  const renderViewContest = useMemo(() => {
    const className = "flex-1";
    const mainElement =
      status !== "loaded" ? (
        renderMainLoading
      ) : (
        <ContestDetailMain className={className} contest={contest} />
      );
    const sideElement = renderContestMetadata();

    return (
      <ContestDetailTemplate
        title={title}
        mainElement={mainElement}
        sideElement={sideElement}
        errorElement={
          <Illustration
            source={Empty}
            caption="This contest does not exist."
            showGoBackButton
          />
        }
        isError={status === "error"}
      />
    );
  }, [contest, status, renderContestMetadata, renderMainLoading, title]);

  const renderEditContest = useMemo(() => {
    const mainElement =
      status !== "loaded" ? (
        renderMainLoading
      ) : (
        <ContestDetailMain className="flex-1" contest={contest} />
      );
    const sideElement = renderContestMetadata();
    if (status !== "loaded")
      return (
        <ContestDetailTemplate
          title={title}
          mainElement={mainElement}
          sideElement={sideElement}
        />
      );
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
  }, [
    contest,
    status,
    renderContestMetadata,
    renderMainLoading,
    setPage,
    stateContest,
    stateProblems,
    title,
  ]);

  const renderContestProblems = useMemo(() => {
    const mainElement =
      status !== "loaded" ? (
        renderMainLoading
      ) : (
        <ContestProblemsPage
          contest={contest}
          userSubmissions={userSubmissionsObject}
          problems={problems}
          user={user}
        />
      );
    const sideElement = renderContestMetadata(
      <ContestDetailProblemsList
        problems={problems}
        participants={userSubmissions}
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
    problems,
    renderContestMetadata,
    renderMainLoading,
    status,
    title,
    user,
    userSubmissions,
    userSubmissionsObject,
  ]);

  const renderContestLeaderboard = useMemo(() => {
    const mainElement =
      status !== "loaded" ? (
        renderMainLoading
      ) : (
        <ContestLeaderboardPage
          contest={contest}
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
    problems,
    renderContestMetadata,
    renderMainLoading,
    status,
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
