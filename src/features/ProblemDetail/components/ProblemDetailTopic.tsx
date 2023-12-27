import { useMemo } from "react";
import { Tag } from "@/components";
import { ProblemSubtopicNameType, ProblemTopicNameType } from "@/types";
import { parseTopicId } from "@/utils";
import clsx from "clsx";

export interface ProblemDetailTopics {
  topic: ProblemTopicNameType;
  subTopic: ProblemSubtopicNameType;
  className?: string;
}

export function ProblemDetailTopics({
  className,
  topic,
  subTopic,
}: ProblemDetailTopics) {
  const topicText = useMemo(() => parseTopicId(topic).name, [topic]);
  const subtopicText = useMemo(() => parseTopicId(subTopic).name, [subTopic]);

  return (
    <div className={clsx("flex flex-wrap justfiy-center gap-4", className)}>
      {topic && <Tag>{topicText}</Tag>}
      {subTopic && <Tag>{subtopicText}</Tag>}
    </div>
  );
}
