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
import { BsCheck, BsPersonFill } from "react-icons/bs";
import { useIdentity } from "@/features/Auth";

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
  const [author, setAuthor] = useState<UserType>();
  const { identify } = useIdentity();

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
          <Link href={`/problem/${id}`}>
            <h2 className="text-teal-600 hover:text-teal-700">{title}</h2>
          </Link>
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
        {renderTags}
        <article className="mb-5" ref={statementRef}></article>
      </>
    ),
    [id, permission, renderTags, title]
  );

  const renderStats = useMemo(
    () => (
      <div className="flex items-center justify-end text-sm text-gray-600 gap-6">
        <ProblemDetailStats
          text={String(author?.username ?? "")}
          icon={BsPersonFill}
        />
        <ProblemDetailStats text={String(solved)} icon={BsCheck} />
      </div>
    ),
    [author?.username, solved]
  );

  const handleRenderMarkdown = useCallback(() => {
    if (statementRef.current)
      statementRef.current.innerHTML = md.render(statement);
  }, [statement]);

  useEffect(() => {
    handleRenderMarkdown();
  }, [handleRenderMarkdown]);

  const handleGetUsername = useCallback(async () => {
    if (authorId) {
      const creator = await identify(authorId);
      creator && setAuthor(creator);
    }
  }, [authorId, identify]);

  useEffect(() => {
    handleGetUsername();
  }, [handleGetUsername]);

  return (
    <Card>
      {renderMain}
      {renderStats}
    </Card>
  );
}
