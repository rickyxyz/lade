import { ReactNode, useMemo } from "react";
import { Button, Card, Paragraph, Tag } from "@/components";
import {
  ProblemSubtopicNameType,
  ProblemTopicNameType,
  ProblemType,
} from "@/types";
import clsx from "clsx";
import { ProblemDetailTopics } from "./ProblemDetailTopic";

export interface ProblemDetailDataProps {
  problem: ProblemType;
  className?: string;
  showAuthorMenu?: boolean;
}

function DataRow({ name, value }: { name: string; value: ReactNode }) {
  return (
    <tr>
      <th className="text-left align-text-top p-0">
        <Paragraph color="secondary-4" size="s">
          {name}
        </Paragraph>
      </th>
      <td className="p-0">
        <Paragraph>{value}</Paragraph>
      </td>
    </tr>
  );
}

export function ProblemDetailData({
  className,
  problem,
  showAuthorMenu,
}: ProblemDetailDataProps) {
  const { title, topic, subTopic, authorId, createdAt } = problem;

  return (
    <Card className={className}>
      <Paragraph className="mb-2" as="h1" size="l">
        {title}
      </Paragraph>
      {topic && subTopic && (
        <ProblemDetailTopics
          className="mb-4"
          topic={topic.name}
          subTopic={subTopic.name}
        />
      )}
      <table className="table-fixed w-full">
        <tbody>
          <DataRow name="CREATED BY" value={authorId} />
          <DataRow name="SOLVED BY" value={authorId} />
          <DataRow
            name="POSTED AT"
            value={new Date(createdAt as unknown as string).toLocaleString(
              "en-GB",
              {
                day: "numeric",
                month: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
              }
            )}
          />
        </tbody>
      </table>
      {showAuthorMenu && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Button variant="outline-2" label="Edit" />
          <Button color="danger" variant="outline-2" label="Delete" />
        </div>
      )}
    </Card>
  );
}
