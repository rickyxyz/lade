import { ReactNode, useCallback } from "react";
import { Button, Card, Paragraph } from "@/components";
import { ContestDatabaseType, ContestTabType } from "@/types";
import { usePathname } from "next/navigation";
import Link from "next/link";

export interface ContestDetailDataProps {
  contest: ContestDatabaseType;
  className?: string;
  showAuthorMenu?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onNavigate?: (tab?: ContestTabType) => void;
}

export function ContestDetailData({
  className,
  contest,
  showAuthorMenu,
  onEdit,
  onDelete,
  onNavigate,
}: ContestDetailDataProps) {
  const { title, authorId, createdAt, startDate, endDate, id } = contest;

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
      <div className="grid grid-cols-1 gap-4 mt-4">
        <Button
          color="secondary"
          variant="outline-2"
          label="Description"
          onClick={() => onNavigate && onNavigate("description")}
        />
        <Button
          color="secondary"
          variant="outline-2"
          label="Problems"
          onClick={() => onNavigate && onNavigate("problems")}
        />
        <Button
          color="secondary"
          variant="outline-2"
          label="Leaderboard"
          onClick={() => onNavigate && onNavigate("leaderboard")}
        />
      </div>
      {showAuthorMenu && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Button
            color="secondary"
            variant="outline-2"
            label="Edit"
            onClick={onEdit}
          />
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
