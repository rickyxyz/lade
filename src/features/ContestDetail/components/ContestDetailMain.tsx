import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, Crumb, Paragraph } from "@/components";
import { useAppDispatch, useAppSelector } from "@/libs/redux";
import { md } from "@/utils";
import {
  ContestType,
  ContentViewType,
  StateType,
  ContestMainTabType,
  ProblemType,
  ContestDatabaseType,
} from "@/types";
import { PROBLEM_ANSWER_DEFAULT_VALUES } from "@/consts";
import { API } from "@/api";
import { CardTab, CardTabType } from "@/components/Card/CardTab";
import { ProblemCard, ProblemCardSkeleton } from "@/features/ProblemList";

export interface ContestMainProps {
  className?: string;
  contest: ContestDatabaseType;
  stateAccept: StateType<unknown>;
  stateMode: StateType<ContentViewType>;
  stateLoading: StateType<boolean>;
}

export function ContestDetailMain({
  className,
  contest,
  stateMode,
  stateLoading,
}: ContestMainProps) {
  const loading = stateLoading[0];
  const {
    id,
    description,
    title,
    topicId,
    subTopicId,
    startDate,
    endDate,
    problemsData,
  } = contest;

  console.log(contest);

  const descriptionRef = useRef<HTMLDivElement>(null);
  const stateTab = useState<ContestMainTabType>("contest");
  const [tab, setTab] = stateTab;

  const tabs = useMemo<CardTabType<ContestMainTabType>[]>(
    () => [
      {
        id: "contest",
        label: "Contest",
        onClick: () => {
          setTab("contest");
        },
      },
      {
        id: "discussion",
        label: "Discussion",
        onClick: () => {
          setTab("discussion");
        },
      },
    ],
    [setTab]
  );

  const renderMain = useMemo(
    () => (
      <Card className={className}>
        <article className="mb-8" ref={descriptionRef}></article>
      </Card>
    ),
    [className]
  );

  const handleRenderMarkdown = useCallback(() => {
    if (descriptionRef.current)
      descriptionRef.current.innerHTML = md.render(description);
  }, [description]);

  const renderProblems = useMemo(() => {
    return (
      <div className="grid grid-cols-1 gap-8">
        {loading ? (
          <>
            <ProblemCardSkeleton />
            <ProblemCardSkeleton />
            <ProblemCardSkeleton />
            <ProblemCardSkeleton />
          </>
        ) : (
          problemsData.map(({ problem }) => (
            <ProblemCard key={problem.id} problem={problem as any} isLink />
          ))
        )}
      </div>
    );
  }, [loading, problemsData]);

  useEffect(() => {
    handleRenderMarkdown();
  }, [tab, handleRenderMarkdown]);

  return (
    <div className="flex flex-col flex-1 gap-8">
      {renderMain}
      {renderProblems}
    </div>
  );
}
