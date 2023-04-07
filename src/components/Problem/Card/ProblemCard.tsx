import { useCallback, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { Card, ProblemStats, ProblemTopics } from "@/components";
import { md } from "@/utils";
import { ProblemType } from "@/types";

export interface ProblemCardProps {
  problem: ProblemType;
}

export function ProblemCard({ problem }: ProblemCardProps) {
  const {
    id,
    statement,
    title,
    topic,
    subtopic,
    solved = 0,
    views = 0,
  } = problem;

  const statementRef = useRef<HTMLDivElement>(null);

  const renderMain = useMemo(
    () => (
      <>
        <Link href={`/problem/${id}`}>
          <h2 className="text-teal-700 hover:text-teal-800">{title}</h2>
        </Link>
        <article className="mb-2" ref={statementRef}></article>
      </>
    ),
    [id, title]
  );

  const renderTags = useMemo(
    () => <ProblemTopics topic={topic} subtopic={subtopic} className="mb-2" />,
    [subtopic, topic]
  );

  const renderStats = useMemo(
    () => (
      <div className="flex items-center text-sm text-gray-600 gap-6">
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
