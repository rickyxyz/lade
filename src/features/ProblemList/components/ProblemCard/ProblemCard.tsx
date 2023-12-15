import { useCallback, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { Card, More, User } from "@/components";
import { getPermissionForContent, md } from "@/utils";
import { ProblemType } from "@/types";
import { useAppSelector } from "@/libs/redux";
import {
  ProblemDetailStats,
  ProblemDetailTopics,
} from "@/features/ProblemDetail";

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

  const user = useAppSelector("user");

  const permission = useMemo(
    () =>
      getPermissionForContent({
        content: problem,
        user,
      }),
    [problem, user]
  );

  const statementRef = useRef<HTMLDivElement>(null);

  const renderTags = useMemo(
    () => (
      <ProblemDetailTopics className="mb-4" topic={topic} subtopic={subtopic} />
    ),
    [subtopic, topic]
  );

  const renderMain = useMemo(
    () => (
      <>
        <div className="flex justify-between mb-4">
          <User id={authorId} caption="3h" />
          <More
            options={
              permission === "author"
                ? [
                    {
                      id: "edit",
                      element: "Edit",
                      onClick: () => {
                        console.log("Edit");
                      },
                    },
                  ]
                : []
            }
          />
        </div>
        <Link href={`/problem/${id}`}>
          <h2 className="text-teal-600 hover:text-teal-700 mb-2">{title}</h2>
        </Link>
        {renderTags}
        <article className="mb-5" ref={statementRef}></article>
      </>
    ),
    [authorId, id, permission, renderTags, title]
  );

  const renderStats = useMemo(
    () => (
      <div className="flex items-center text-sm text-gray-600 gap-6">
        <ProblemDetailStats type="view" value={views} />
        <ProblemDetailStats type="solved" value={solved} />
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
      {renderStats}
    </Card>
  );
}
