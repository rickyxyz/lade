import { ReactNode } from "react";
import { Button, Card, Paragraph } from "@/components";
import { ContestDatabaseType } from "@/types";

export interface ContestProblemsDataProps {
  contest: ContestDatabaseType;
  className?: string;
  onEdit?: () => void;
  onDelete?: () => void;
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

export function ContestProblemsData({
  className,
  contest,
  onEdit,
  onDelete,
}: ContestProblemsDataProps) {
  const { title, authorId, createdAt, startDate, endDate } = contest;

  return (
    <Card className={className}>
      <Paragraph className="mb-2" as="h1" size="l">
        {title}
      </Paragraph>
      <table className="table-fixed w-full">
        <tbody>
          <DataRow name="TIME LEFT" value={authorId} />
          <DataRow name="SCORE" value={authorId} />
        </tbody>
      </table>
    </Card>
  );
}
