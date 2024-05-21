import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { ProblemDetailStats, ProblemDetailTopics } from "@/features";
import { Card, MarkdownPreview, More, Paragraph } from "@/components";
import { getPermissionForContent, md } from "@/utils";
import { ProblemDatabaseType } from "@/types";
import { useAppSelector } from "@/libs/redux";
import { CheckCircle, Person } from "@mui/icons-material";
import clsx from "clsx";

export interface ProblemCardProps {
  problem: ProblemDatabaseType;
  className?: string;
  isLink?: boolean;
  onClick?: () => void;
}

export function ProblemCard({
  problem,
  className,
  isLink,
  onClick,
}: ProblemCardProps) {
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
            <Link href={`/problem/${id}`}>
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
        {/* <article
          className="mb-5 overflow-hidden max-h-[4.4rem]"
          ref={statementRef}
        ></article> */}
        <MarkdownPreview className="mb-2" ref={statementRef} />
      </>
    ),
    [id, isLink, renderTags, title]
  );

  const renderStats = useMemo(
    () => (
      <div className="flex items-center text-sm gap-6">
        <ProblemDetailStats text={String(authorId)} icon={Person} />
        <ProblemDetailStats text={String(solveds.length)} icon={CheckCircle} />
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
    <Card className={clsx(className, "h-fit")} onClick={onClick}>
      {renderMain}
      {renderStats}
    </Card>
  );
}
