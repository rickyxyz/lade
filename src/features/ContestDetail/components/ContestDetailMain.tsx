import { useCallback, useEffect, useMemo, useRef } from "react";
import { Card } from "@/components";
import { md } from "@/utils";
import { ContestDatabaseType } from "@/types";

export interface ContestMainProps {
  className?: string;
  contest: ContestDatabaseType;
}

export function ContestDetailMain({ className, contest }: ContestMainProps) {
  const { description } = contest;

  const descriptionRef = useRef<HTMLDivElement>(null);

  const renderMain = useMemo(
    () => (
      <Card className={className}>
        <article className="mb-8" ref={descriptionRef}></article>
      </Card>
    ),
    [className]
  );

  const handleRenderMarkdown = useCallback(() => {
    if (descriptionRef.current)
      descriptionRef.current.innerHTML = md.render(description);
  }, [description]);

  useEffect(() => {
    handleRenderMarkdown();
  }, [handleRenderMarkdown]);

  return <div className="flex flex-col flex-1 gap-8">{renderMain}</div>;
}
