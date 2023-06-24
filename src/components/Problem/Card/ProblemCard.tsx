import { useCallback, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { Card, ProblemStats, ProblemTopics, User } from "@/components";
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
    authorId,
  } = problem;

  const statementRef = useRef<HTMLDivElement>(null);

  const renderMain = useMemo(
    () => (
      <>
        <User id={authorId} caption="3h" className="mb-4" />
        <Link href={`/problem/${id}`}>
          <h2 className="text-teal-600 hover:text-teal-700 mb-4">{title}</h2>
        </Link>
        <article className="mb-5" ref={statementRef}></article>
      </>
    ),
    [authorId, id, title]
  );

  const renderTags = useMemo(
    () => <ProblemTopics className="mb-2" topic={topic} subtopic={subtopic} />,
    [subtopic, topic]
  );

  const renderStats = useMemo(
    () => (
      <div className="flex items-center text-sm text-gray-600 gap-4">
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
      {renderMain}
      {renderTags}
      {renderStats}
    </Card>
  );
}
