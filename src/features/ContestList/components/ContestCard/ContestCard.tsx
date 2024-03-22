import { useCallback, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { Button, Card, More } from "@/components";
import { getPermissionForContent, md } from "@/utils";
import { ContestDatabaseType } from "@/types";
import { useAppSelector } from "@/libs/redux";
import { ProblemDetailStats, ProblemDetailTopics } from "@/features";
import { Person } from "@mui/icons-material";

export interface ContestCardProps {
  contest: ContestDatabaseType;
}

export function ContestCard({ contest }: ContestCardProps) {
  const {
    id,
    title,
    topic,
    subTopic,
    authorId,
    description: statement,
  } = contest;

  const user = useAppSelector("user");

  const permission = useMemo(
    () =>
      getPermissionForContent({
        content: contest,
        user,
      }),
    [contest, user]
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
        <div className="relative flex justify-between mb-4">
          <Link href={`/contest/${id}`}>
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
      <div className="flex items-center justify-between">
        <Button>Participate</Button>
        <div className="flex items-center text-sm text-gray-600 gap-6">
          <ProblemDetailStats text={String(authorId)} icon={Person} />
        </div>
      </div>
    ),
    [authorId]
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
