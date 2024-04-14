/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect, useCallback, useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { API } from "@/api";
import {
  ButtonIcon,
  Card,
  IconText,
  Modal,
  Paragraph,
  Tooltip,
} from "@/components";
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
  ProblemType,
} from "@/types";
import { CONTEST_DEFAULT } from "@/consts";
import { PageTemplate } from "@/templates";
import { ContestDetailMainSkeleton } from "../components";
import { ButtonList, ButtonListEntry } from "@/components/Button/ButtonList";
import { MoreVert, West } from "@mui/icons-material";
import { ProblemCardSkeleton } from "@/features/ProblemList";
import { ContestProblemsList } from "../components/ContestProblemsList";
import { ContestDetailData } from "@/features/ContestDetail/components/ContestDetailData";
import { ContestDetailProblemCard } from "@/features/ContestDetail/components/ContestDetailProblemCard";
import { ContestProblemsProblemCard } from "../components/ContestProblemsProblemCard";

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
  user?: UserType | null;
}

export function ContestProblemsPage({ id, user }: ContestProps) {
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
  const stateMode = useState<ContentViewType>("view");
  const [mode, setMode] = stateMode;

  const [cooldownIntv, setCooldownIntv] = useState<NodeJS.Timer>();
  const [cooldown, setCooldown] = useState(0);
  const [submitted, setSubmitted] = useState(0);
  const stateAnswerLoading = useState<string | null>();
  const [answerLoading, setAnswerLoading] = stateAnswerLoading;

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

  const handleCheckAnswer = useCallback(
    async (problemId: string, answer: any) => {
      const now = new Date().getTime();

      if (submitted && now - submitted <= 1000 * 5) {
        setCooldown(Math.max(0, submitted + 1000 * 5 - now));
        return null;
      }

      setCooldown(1000 * 5);

      let verdict = false;
      setAnswerLoading(problemId);

      await API("post_contest_answer", {
        body: {
          contestId: id,
          problemId,
          answer,
        },
      })
        .then((res) => {
          console.log("Verdict ", res.data.message);
          if (res.data.message === "correct") {
            verdict = true;
          }
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setAnswerLoading(null);
        });

      if (!verdict) {
        if (cooldownIntv) clearInterval(cooldownIntv);

        setCooldown(10000);
        const interval = setInterval(() => {
          setCooldown((prev) => Math.max(0, prev - 100));
        }, 100);

        setSubmitted(now);

        setCooldownIntv(interval);
      } else {
        setCooldown(0);
      }
      return verdict;
    },
    [submitted, setAnswerLoading, id, cooldownIntv]
  );

  const renderListProblems = useMemo(() => {
    return (
      <div className="flex-1 grid grid-cols-1 gap-8">
        {loading ? (
          <>
            <ProblemCardSkeleton />
            <ProblemCardSkeleton />
            <ProblemCardSkeleton />
            <ProblemCardSkeleton />
          </>
        ) : (
          problems.map((p) => (
            <ContestProblemsProblemCard
              key={p.problem.id}
              problem={p.problem as any}
              onSubmit={handleCheckAnswer}
              cooldown={cooldown}
              isSubmittable={cooldown === 0 || !answerLoading}
              loading={answerLoading === p.problem.id}
            />
          ))
        )}
      </div>
    );
  }, [answerLoading, cooldown, handleCheckAnswer, loading, problems]);

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
        IconComponent={West}
        text="Back"
        className="mb-4 text-primary-600 cursor-pointer"
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
              icon={MoreVert}
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
  const renderQuestionMetadata = useMemo(() => {
    const className =
      "flex flex-col flex-grow md:max-w-[320px] gap-8 h-fit lg:sticky lg:top-0";

    if (loading || !contest)
      return <ContestDetailMainSkeleton className={className} />;

    return (
      <div className={className}>
        <ContestDetailData
          contest={contest as unknown as ContestDatabaseType}
          showAuthorMenu={!!user && contest.authorId === user?.id}
          onEdit={() => {
            setMode("edit");
          }}
          // onDelete={() => {
          //   handleDeleteProblem();
          // }}
        />
        <ContestProblemsList problems={problems} />
      </div>
    );
  }, [contest, loading, problems, setMode, user]);

  return (
    <PageTemplate title={title} className="w-full">
      <div className="relative flex flex-row flex-wrap gap-8">
        {renderListProblems}
        {renderQuestionMetadata}
      </div>
    </PageTemplate>
  );
}
