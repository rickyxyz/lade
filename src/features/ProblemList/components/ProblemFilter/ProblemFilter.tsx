import clsx from "clsx";
import { Button, ButtonIcon, Paragraph, Select } from "@/components";
import { PROBLEM_SORT_BY_OPTIONS } from "@/consts";
import {
  ProblemSortByType,
  ProblemSubtopicNameType,
  ProblemTopicNameType,
  StateType,
} from "@/types";
import { ReactNode } from "react";
import { useTopics } from "@/hooks";
import { Close } from "@mui/icons-material";

interface ProblemFilterProps {
  wrapperClassName?: string;
  className?: string;
  stateTopic: StateType<ProblemTopicNameType | undefined>;
  stateSubTopic: StateType<ProblemSubtopicNameType | undefined>;
  stateSortBy: StateType<ProblemSortByType>;
  buttonElement?: ReactNode;
  onClose?: () => void;
}

export function ProblemFilter({
  wrapperClassName,
  className,
  stateSubTopic,
  stateTopic,
  stateSortBy,
  buttonElement,
  onClose,
}: ProblemFilterProps) {
  const [topic, setTopic] = stateTopic;
  const [subtopic, setSubtopic] = stateSubTopic;
  const [sortBy, setSortBy] = stateSortBy;
  const { topicOptions, subTopicOptions, loading } = useTopics();

  return (
    <div
      className={clsx(
        "flex flex-col w-64 rounded-lg p-8 gap-4 bg-white border border-secondary-200",
        wrapperClassName
      )}
    >
      <div className="flex justify-between">
        <Paragraph size="m" weight="semibold">
          Filters
        </Paragraph>
        <ButtonIcon
          variant="ghost"
          size="xs"
          icon={Close}
          color="secondary"
          onClick={onClose}
        />
      </div>
      <div className={clsx("flex flex-col gap-4", className)}>
        <Select
          label="Topic"
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
          loading={loading}
        />
        <Select
          label="Subtopic"
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
          loading={loading}
        />
        <Select
          label="Sort by"
          className="w-full"
          inputClassName="w-full"
          options={PROBLEM_SORT_BY_OPTIONS}
          selectedOption={sortBy}
          onSelectOption={(option) => {
            option && setSortBy(option.id);
          }}
        />
      </div>
      {buttonElement}
    </div>
  );
}
