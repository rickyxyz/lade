import { useMemo } from "react";
import { Tag } from "@/components";
import { ProblemSubtopicNameType, ProblemTopicNameType } from "@/types";
import { parseTopicId } from "@/utils";
import clsx from "clsx";

export interface ProblemDetailTopics {
  topic?: string;
  subTopic?: string;
  className?: string;
}

export function ProblemDetailTopics({
  className,
  topic,
  subTopic,
}: ProblemDetailTopics) {
  return (
    <div className={clsx("flex flex-wrap justfiy-center gap-4", className)}>
      {topic && <Tag>{topic}</Tag>}
      {subTopic && <Tag>{subTopic}</Tag>}
    </div>
  );
}
