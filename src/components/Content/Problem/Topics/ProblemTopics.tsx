import { useMemo } from "react";
import { Tag } from "@/components";
import { ProblemSubtopicNameType, ProblemTopicNameType } from "@/types";
import { parseTopicId } from "@/utils";
import clsx from "clsx";

export interface ProblemTopics {
  topic: ProblemTopicNameType;
  subtopic: ProblemSubtopicNameType;
  className?: string;
}

export function ProblemTopics({ className, topic, subtopic }: ProblemTopics) {
  const topicText = useMemo(() => parseTopicId(topic).name, [topic]);
  const subtopicText = useMemo(() => parseTopicId(subtopic).name, [subtopic]);

  return (
    <div className={clsx("flex flex-wrap justfiy-center gap-4", className)}>
      {topic && <Tag>{topicText}</Tag>}
      {subtopic && <Tag>{subtopicText}</Tag>}
    </div>
  );
}
