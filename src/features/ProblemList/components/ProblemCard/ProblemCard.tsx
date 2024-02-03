import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Card, More } from "@/components";
import { getPermissionForContent, md } from "@/utils";
import { ProblemType, UserType } from "@/types";
import { useAppSelector } from "@/libs/redux";
import {
  ProblemDetailStats,
  ProblemDetailTopics,
} from "@/features/ProblemDetail";
import { BsCheck, BsCheckCircleFill, BsPersonFill } from "react-icons/bs";

export interface ProblemCardProps {
  problem: ProblemType;
}

export function ProblemCard({ problem }: ProblemCardProps) {
  const {
    id,
    statement,
    title,
    topicId,
    subTopicId,
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
        topic={topicId}
        subTopic={subTopicId}
      />
    ),
    [subTopicId, topicId]
  );

  const renderMain = useMemo(
    () => (
      <>
        <div className="flex justify-between mb-4">
          <Link href={`/problem/${id}`}>
            <h2 className="text-teal-600 hover:text-teal-700">{title}</h2>
          </Link>
          <More
            className="absolute right-0"
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
      <div className="flex items-center justify-end text-sm text-gray-600 gap-6">
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
