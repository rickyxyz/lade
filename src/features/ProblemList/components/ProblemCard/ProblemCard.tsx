import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ProblemDetailStats, ProblemDetailTopics } from "@/features";
import { Card, More } from "@/components";
import { getPermissionForContent, md } from "@/utils";
import { ProblemDatabaseType } from "@/types";
import { useAppSelector } from "@/libs/redux";
import { BsCheckCircleFill, BsPersonFill } from "react-icons/bs";

export interface ProblemCardProps {
  problem: ProblemDatabaseType;
}

export function ProblemCard({ problem }: ProblemCardProps) {
  const {
    id,
    statement,
    title,
    topic,
    subTopic,
    solveds = [],
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
      <ProblemDetailTopics
        className="mb-4"
        topic={topic.name}
        subTopic={subTopic.name}
      />
    ),
    [subTopic, topic]
  );

  const renderMain = useMemo(
    () => (
      <>
        <div className="flex justify-between mb-4">
          <Link href={`/problem/${id}`}>
            <h2 className="text-teal-600 hover:text-teal-700">{title}</h2>
          </Link>
          <More
            className="!absolute !right-0"
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
        {renderTags}
        <article className="mb-5" ref={statementRef}></article>
      </>
    ),
    [id, permission, renderTags, title]
  );

  const renderStats = useMemo(
    () => (
      <div className="flex items-center text-sm gap-6">
        <ProblemDetailStats text={String(authorId)} icon={BsPersonFill} />
        <ProblemDetailStats
          text={String(solveds.length)}
          icon={BsCheckCircleFill}
        />
      </div>
    ),
    [authorId, solveds]
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
