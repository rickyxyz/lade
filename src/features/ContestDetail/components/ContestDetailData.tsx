import { ReactNode } from "react";
import { Button, Card, Paragraph } from "@/components";
import { ContestDatabaseType } from "@/types";

export interface ContestDetailDataProps {
  contest: ContestDatabaseType;
  className?: string;
  showAuthorMenu?: boolean;
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

export function ContestDetailData({
  className,
  contest,
  showAuthorMenu,
  onEdit,
  onDelete,
}: ContestDetailDataProps) {
  const { title, authorId, createdAt, startDate, endDate } = contest;

  return (
    <Card className={className}>
      <Paragraph className="mb-2" as="h1" size="l">
        {title}
      </Paragraph>
      <table className="table-fixed w-full">
        <tbody>
          <DataRow name="CREATED BY" value={authorId} />
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
          <DataRow
            name="STARTS AT"
            value={new Date(startDate as unknown as string).toLocaleString(
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
          <DataRow
            name="ENDS AT"
            value={new Date(endDate as unknown as string).toLocaleString(
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
          <Button variant="outline-2" label="Edit" onClick={onEdit} />
          <Button
            color="danger"
            variant="outline-2"
            label="Delete"
            onClick={onDelete}
          />
        </div>
      )}
    </Card>
  );
}
