/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect, useCallback, useState } from "react";
import { BsArrowLeft, BsThreeDotsVertical } from "react-icons/bs";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { API } from "@/api";
import { ButtonIcon, IconText, Modal, Paragraph, Tooltip } from "@/components";
import { useAppSelector } from "@/libs/redux";
import { useDevice } from "@/hooks";
import { checkPermission, api } from "@/utils";
import {
  ContestType,
  ContentViewType,
  UserType,
  ContentAccessType,
  ProblemContestType,
} from "@/types";
import { CONTEST_DEFAULT, PROBLEM_BLANK } from "@/consts";
import { PageTemplate } from "@/templates";
import {
  ContestDetailMain,
  ContestDetailMainSkeleton,
  ContestDetailTopics,
} from "../components";
import { ButtonList, ButtonListEntry } from "@/components/Button/ButtonList";
import { ContestEditPage } from "./ContestEditPage";

interface ContestData {
  label: string;
  value?: string | number;
  tooltip?: string;
}

interface ContestAction extends ButtonListEntry {
  permission?: ContentAccessType;
}

interface ContestProps {
  id: string;
  user: UserType;
}

export function ContestDetailPage({ id, user }: ContestProps) {
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
    () => allUserSolved && allUserSolved[id],
    [allUserSolved, id]
  );

  const permission = useMemo<ContentAccessType>(() => {
    if (user && contest) {
      if (contest.authorId === user.id) {
        return "author";
      }
    }
    return "viewer";
  }, [contest, user]);

  const contestData = useMemo<ContestData[]>(
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
    ],
    [authorId, createdAt]
  );

  const handleDeleteContest = useCallback(async () => {
    await api
      .delete("/contest", {
        params: {
          id,
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
  }, [id, router]);

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
    if (loading || !contest) return <ContestDetailMainSkeleton />;

    return (
      <ContestDetailMain
        stateContest={stateContest}
        stateAccept={stateAccept}
        stateMode={stateMode}
      />
    );
  }, [loading, contest, stateContest, stateAccept, stateMode]);

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

    const result = await API("get_contest", {
      params: {
        id,
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
  }, [loading, setLoading, id, setContest, setProblems]);

  useEffect(() => {
    handleGetContests();
  }, [handleGetContests]);

  const renderNavigation = useMemo(
    () => (
      <IconText
        IconComponent={BsArrowLeft}
        text="Back"
        className="mb-4 text-teal-600 cursor-pointer"
        onClick={handleGoBack}
      />
    ),
    [handleGoBack]
  );

  const renderHead = useMemo(
    () => (
      <>
        {renderNavigation}
        <div className="flex  justify-between mb-4">
          <div className="flex-1">
            <h1 className="mt-2 mb-4">{title}</h1>
            {/* {topic && subTopic && (
              <ContestDetailTopics
                className="mb-8"
                topic={topic.name}
                subTopic={subTopic.name}
              />
            )} */}
          </div>
          {device === "mobile" && (
            <ButtonIcon
              variant="outline"
              onClick={() => {
                setMobileAction((prev) => !prev);
              }}
              icon={BsThreeDotsVertical}
            />
          )}
        </div>
      </>
    ),
    [device, renderNavigation, setMobileAction, title]
  );

  const renderContestData = useMemo(
    () => (
      <ul className="md:w-48">
        {contestData.map(({ label, value, tooltip }, idx) => (
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
    [contestData]
  );

  const renderContestAction = useMemo(() => {
    const actions = contestAction.filter(({ permission: perm }) =>
      checkPermission(permission, perm)
    );
    return <ButtonList list={actions} className="w-48" />;
  }, [permission, contestAction]);

  const renderMobileAction = useMemo(
    () => <Modal stateVisible={stateMobileAction}>{renderContestAction}</Modal>,
    [renderContestAction, stateMobileAction]
  );

  const renderSide = useMemo(
    () => (
      <div className="flex flex-col gap-8">
        {renderContestData}
        {device === "mobile" ? renderMobileAction : renderContestAction}
      </div>
    ),
    [device, renderMobileAction, renderContestAction, renderContestData]
  );

  const renderViewContest = useMemo(
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
