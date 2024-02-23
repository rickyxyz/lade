import clsx from "clsx";
import { Tag } from "@/components";

export interface ContestDetailTopics {
  topic?: string;
  subTopic?: string;
  className?: string;
}

export function ContestDetailTopics({
  className,
  topic,
  subTopic,
}: ContestDetailTopics) {
  return (
    <div className={clsx("flex flex-wrap justfiy-center gap-4", className)}>
      {topic && <Tag>{topic}</Tag>}
      {subTopic && <Tag>{subTopic}</Tag>}
    </div>
  );
}
