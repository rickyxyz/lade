import { useCallback, useEffect, useMemo, useRef } from "react";
import { Card, Tag } from "@/components";
import { ProblemStats } from "../Stats";
import { md } from "@/utils";
import { ProblemType } from "@/types";

export interface ProblemCardProps {
  problem: ProblemType;
}

export function ProblemCard({ problem }: ProblemCardProps) {
  const { id, statement, title, topics, solved = 0, views = 0 } = problem;

  const statementRef = useRef<HTMLDivElement>(null);

  const renderMain = useMemo(
    () => (
      <>
        <h2>{title}</h2>
        <article className="mb-2" ref={statementRef}></article>
      </>
    ),
    [title]
  );

  const renderTags = useMemo(
    () => (
      <div className="flex flex-wrap gap-4 mb-2">
        {topics.map((topic) => (
          <Tag key={`${id}-${topic}`}>{topic}</Tag>
        ))}
      </div>
    ),
    [id, topics]
  );

  const renderStats = useMemo(
    () => (
      <div className="flex items-center text-sm text-gray-600 gap-8">
        <ProblemStats type="view" value={views} />
        <ProblemStats type="solved" value={solved} />
      </div>
    ),
    [solved, views]
  );

  const handleRenderMarkdown = useCallback(() => {
    if (statementRef.current)
      statementRef.current.innerHTML = md.render(statement);
  }, [statement]);

  useEffect(() => {
    handleRenderMarkdown();
  }, [handleRenderMarkdown]);

  return (
    <Card>
      {renderTags}
      {renderMain}
      {renderStats}
    </Card>
  );
}
