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
import { Card, MarkdownPreview, Paragraph } from "@/components";
import { getPermissionForContent, md } from "@/utils";
import { ProblemDatabaseType } from "@/types";
import { useAppSelector } from "@/libs/redux";
import { CheckCircle, Person } from "@mui/icons-material";
import clsx from "clsx";

interface ProblemCardProps {
  problem: ProblemDatabaseType;
  className?: string;
  isLink?: boolean;
  isHoverable?: boolean;
  onClick?: () => void;
}

export function ProblemCard({
  problem,
  className,
  isLink,
  isHoverable,
  onClick,
}: ProblemCardProps) {
  const {
    id,
    description,
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

  const descriptionRef = useRef<HTMLDivElement>(null);

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
              <Paragraph className="mr-16" tag="h2" color="primary-6">
                {title}
              </Paragraph>
            </Link>
          ) : (
            <Paragraph className="mr-16" tag="h2" color="primary-6">
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
          ref={descriptionRef}
        ></article> */}
        <MarkdownPreview
          className="mb-2"
          classNameOverlay={clsx(isHoverable && "Previewdescription")}
          markdown={description}
          isTruncated
        />
      </>
    ),
    [id, isHoverable, isLink, renderTags, description, title]
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

  return (
    <Card
      className={clsx(
        className,
        "h-fit",
        isHoverable && "hover:bg-secondary-50"
      )}
      onClick={onClick}
    >
      {renderMain}
      {renderStats}
    </Card>
  );
}
