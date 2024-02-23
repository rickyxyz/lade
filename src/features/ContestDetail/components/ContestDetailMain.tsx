import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Card, Crumb, Paragraph } from "@/components";
import { useAppDispatch, useAppSelector } from "@/libs/redux";
import { md } from "@/utils";
import {
  ContestType,
  ContentViewType,
  StateType,
  ContestMainTabType,
} from "@/types";
import { PROBLEM_ANSWER_DEFAULT_VALUES } from "@/consts";
import { API } from "@/api";
import { CardTab, CardTabType } from "@/components/Card/CardTab";

export interface ContestMainProps {
  stateContest: StateType<ContestType>;
  stateAccept: StateType<unknown>;
  stateMode: StateType<ContentViewType>;
}

export function ContestDetailMain({
  stateContest,
  stateMode,
}: ContestMainProps) {
  const [contest, setContest] = stateContest;
  const { id, description, title, topicId, subTopicId } = contest;

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
    () => <article className="mb-8" ref={descriptionRef}></article>,
    []
  );

  const handleRenderMarkdown = useCallback(() => {
    if (descriptionRef.current)
      descriptionRef.current.innerHTML = md.render(description);
  }, [description]);

  useEffect(() => {
    handleRenderMarkdown();
  }, [tab, handleRenderMarkdown]);

  const renderContent = useMemo(() => {
    switch (tab) {
      case "contest":
        return <>{renderMain}</>;
      case "discussion":
        return <div>Discussion</div>;
    }
  }, [renderMain, tab]);

  return (
    <CardTab tabs={tabs} activeTab={tab}>
      {renderContent}
    </CardTab>
  );
}
