import { useCallback, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { Button, Card, More, Paragraph } from "@/components";
import { getPermissionForContent, md } from "@/utils";
import { ContestDatabaseType } from "@/types";
import { useAppSelector } from "@/libs/redux";
import { ProblemDetailStats, ProblemDetailTopics } from "@/features";
import { Person } from "@mui/icons-material";

export interface ContestCardProps {
  contest: ContestDatabaseType;
  isLink?: boolean;
}

export function ContestCard({ contest, isLink }: ContestCardProps) {
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
    () =>
      topic &&
      subTopic && (
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
        <div className="relative flex justify-between mb-2">
          {isLink ? (
            <Link href={`/contest/${id}`}>
              <Paragraph className="mr-16" as="h2" color="primary-6">
                {title}
              </Paragraph>
            </Link>
          ) : (
            <Paragraph className="mr-16" as="h2" color="primary-6">
              {title}
            </Paragraph>
          )}
          {/* <More
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
          /> */}
        </div>
        {renderTags}
        <article
          className="mb-5 overflow-hidden max-h-[4.4rem]"
          ref={statementRef}
        ></article>
      </>
    ),
    [id, isLink, renderTags, title]
  );

  const renderStats = useMemo(
    () => (
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-secondary-600 gap-6">
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
    <Card className="h-fit">
      {renderMain}
      {renderStats}
    </Card>
  );
}
