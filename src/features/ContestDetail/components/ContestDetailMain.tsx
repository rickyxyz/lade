import { useCallback, useEffect, useMemo, useRef } from "react";
import { Card, MarkdownPreview } from "@/components";
import { md } from "@/utils";
import { ContestDatabaseType } from "@/types";

export interface ContestMainProps {
  className?: string;
  contest: ContestDatabaseType;
}

export function ContestDetailMain({ className, contest }: ContestMainProps) {
  const renderMain = useMemo(
    () => (
      <Card className={className}>
        <MarkdownPreview markdown={contest.description} />
      </Card>
    ),
    [className, contest.description]
  );

  return <div className="flex flex-col flex-1 gap-8">{renderMain}</div>;
}
