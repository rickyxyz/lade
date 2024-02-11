import clsx from "clsx";
import { Button, Paragraph, Select } from "@/components";
import {
  PROBLEM_SORT_BY_OPTIONS,
  PROBLEM_SUBTOPIC_OPTIONS,
  PROBLEM_TOPIC_OPTIONS,
} from "@/consts";
import {
  ProblemSortByType,
  ProblemSubtopicNameType,
  ProblemTopicNameType,
  StateType,
} from "@/types";
import { ReactNode, useMemo } from "react";
import { useTopics } from "@/utils";

interface ProblemFilterProps {
  wrapperClassName?: string;
  className?: string;
  stateTopic: StateType<ProblemTopicNameType | undefined>;
  stateSubTopic: StateType<ProblemSubtopicNameType | undefined>;
  stateSortBy: StateType<ProblemSortByType>;
  buttonElement?: ReactNode;
}

export function ProblemFilter({
  wrapperClassName,
  className,
  stateSubTopic,
  stateTopic,
  stateSortBy,
  buttonElement,
}: ProblemFilterProps) {
  const [topic, setTopic] = stateTopic;
  const [subtopic, setSubtopic] = stateSubTopic;
  const [sortBy, setSortBy] = stateSortBy;
  const { topicOptions, subTopicOptions } = useTopics();

  return (
    <div className={clsx("flex rounded-lg !p-4 mb-8", wrapperClassName)}>
      <div className={clsx("flex gap-4", className)}>
        <div className="flex-1">
          <Paragraph weight="semibold">Topics</Paragraph>
          <Select
            className="w-full"
            inputClassName="w-full"
            options={topicOptions}
            selectedOption={topic}
            onSelectOption={(option) => {
              option ? setTopic(option.id) : setTopic(undefined);
              setSubtopic(undefined);
            }}
            unselectedText="Any"
            optional
          />
        </div>
        <div className="flex-1">
          <Paragraph weight="semibold">Subtopics</Paragraph>
          <Select
            className="w-full"
            inputClassName="w-full"
            options={topic ? (subTopicOptions[topic] as any) : []}
            selectedOption={subtopic}
            onSelectOption={(option) => {
              option ? setSubtopic(option.id) : setSubtopic(undefined);
            }}
            disabled={!topic}
            unselectedText="Any"
            optional
          />
        </div>
        <div className="flex-1">
          <Paragraph weight="semibold">Sort by</Paragraph>
          <Select
            className="w-full"
            inputClassName="w-full"
            options={PROBLEM_SORT_BY_OPTIONS}
            selectedOption={sortBy}
            onSelectOption={(option) => {
              option && setSortBy(option.id);
            }}
          />
        </div>
      </div>
      {buttonElement}
    </div>
  );
}
