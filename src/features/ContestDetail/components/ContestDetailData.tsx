import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, Paragraph } from "@/components";
import { ContestDatabaseType, ContestTabType } from "@/types";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getDateString, getHMS } from "@/utils";

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
  const [count, setCount] = useState<{
    start?: string;
    end?: string;
  }>({});

  const {
    startString,
    endString,
    createdString,
    showCountStart,
    showCountEnd,
  } = useMemo(() => {
    const start = new Date(startDate as unknown as string);
    const end = new Date(endDate as unknown as string);
    const created = new Date(createdAt as unknown as string);

    const showCountStart = count?.start !== undefined;
    const showCountEnd = count?.end !== undefined;

    return {
      startString: count?.start ?? getDateString(start),
      endString: count?.end ?? getDateString(end),
      createdString: getDateString(created),
      showCountStart,
      showCountEnd,
    };
  }, [count?.end, count?.start, createdAt, endDate, startDate]);

  useEffect(() => {
    const start = new Date(startDate as unknown as string).getTime();
    const end = new Date(endDate as unknown as string).getTime();
    let now = new Date().getTime();
    let interval: NodeJS.Timer;

    if (end > now) {
      interval = setInterval(() => {
        now = new Date().getTime();

        setCount({
          start:
            start > now ? getHMS(Math.floor((start - now) / 1000)) : undefined,
          end:
            now >= start ? getHMS(Math.floor((end - now) / 1000)) : undefined,
        });
      }, 100);
    }

    return () => interval && clearInterval(interval);
  }, [endDate, startDate]);

  return (
    <Card className={className}>
      <Paragraph className="mb-2" as="h1" size="l">
        {title}
      </Paragraph>
      <table className="table-fixed w-full">
        <tbody>
          <DataRow name="CREATED BY" value={authorId} />
          <DataRow name="POSTED AT" value={createdString} />
          <DataRow
            name={`STARTS ${showCountStart ? "IN" : "AT"}`}
            value={startString}
          />
          <DataRow
            name={`ENDS ${showCountEnd ? "IN" : "AT"}`}
            value={endString}
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
          disabled={contest.status === "waiting"}
        />
        <Button
          color="secondary"
          variant="outline-2"
          label="Leaderboard"
          onClick={() => onNavigate && onNavigate("leaderboard")}
          disabled={contest.status === "waiting"}
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
