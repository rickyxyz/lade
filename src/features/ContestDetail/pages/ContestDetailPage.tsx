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

interface ContestData {
  label: string;
  value?: string | number;
  tooltip?: string;
}

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
  const setProblems = stateProblems[1];
  const [contest, setContest] = stateContest;
  const { title, authorId, createdAt = 0 } = contest;
  const stateAccept = useState<unknown>({
    content: "",
  });
  const stateLoading = useState(true);
  const [loading, setLoading] = stateLoading;
  const stateMode = useState<ContentViewType>("view");
  const [mode, setMode] = stateMode;

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
          setMode("edit");
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
    [handleDeleteContest, setMode]
  );

  const renderQuestion = useMemo(() => {
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

  const renderQuestionMetadata = useMemo(() => {
    const className = "flex-grow md:max-w-[320px] h-fit lg:sticky lg:top-0";

    if (loading || !contest)
      return <ContestDetailMainSkeleton className={className} />;

    return (
      <ContestDetailData
        className={className}
        contest={contest as unknown as ContestDatabaseType}
        showAuthorMenu={!!user && contest.authorId === user?.id}
        onEdit={() => {
          setMode("edit");
        }}
        onDelete={() => {
          handleDeleteContest();
        }}
      />
    );
  }, [contest, handleDeleteContest, loading, setMode, user]);

  const renderViewContest = useMemo(
    () => (
      <PageTemplate title={title} className="w-full">
        <div className="relative flex flex-row flex-wrap gap-8">
          {renderQuestion}
          {renderQuestionMetadata}
        </div>
      </PageTemplate>
    ),
    [renderQuestion, renderQuestionMetadata, title]
  );

  const renderEditContest = useMemo(
    () => (
      <ContestEditPage
        stateContest={stateContest}
        stateProblems={stateProblems}
        onEdit={() => {
          setMode("view");
        }}
        onLeaveEditor={() => {
          setMode("view");
        }}
      />
    ),
    [setMode, stateContest, stateProblems]
  );

  return mode === "edit" ? renderEditContest : renderViewContest;
}
