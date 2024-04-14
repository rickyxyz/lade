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
import { ContestDetailProblemCard } from "../../ContestProblems/components/ContestProblemsProblemCard";

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
        <Button>Participate</Button>
      </Card>
    ),
    [className]
  );

  const handleRenderMarkdown = useCallback(() => {
    if (descriptionRef.current)
      descriptionRef.current.innerHTML = md.render(description);
  }, [description]);

  useEffect(() => {
    handleRenderMarkdown();
  }, [tab, handleRenderMarkdown]);

  return <div className="flex flex-col flex-1 gap-8">{renderMain}</div>;
}
