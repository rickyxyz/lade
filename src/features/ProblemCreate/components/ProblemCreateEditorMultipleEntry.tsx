import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ProblemDetailStats, ProblemDetailTopics } from "@/features";
import { ButtonIcon, Card, More, Paragraph } from "@/components";
import { getPermissionForContent, md } from "@/utils";
import { ProblemDatabaseType, ProblemType } from "@/types";
import { useAppSelector } from "@/libs/redux";
import { CheckCircle, Close, Delete, Person } from "@mui/icons-material";
import { on } from "events";
import clsx from "clsx";

export interface ProblemCreateEditorMultipleEntryProps {
  problem: ProblemType;
  isDeletable?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProblemCreateEditorMultipleEntry({
  problem,
  onEdit,
  onDelete,
}: ProblemCreateEditorMultipleEntryProps) {
  const { statement, title, topicId, subTopicId } = problem;

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
        <div className="relative flex justify-between">
          <Paragraph as="h2" size="l">
            {title}
          </Paragraph>
          <div>
            <ButtonIcon
              variant="ghost"
              icon={Delete}
              color="danger"
              onClick={(e) => {
                onDelete();
                e.stopPropagation();
              }}
            />
          </div>
        </div>
        {renderTags}
        <div className="relative overflow-hidden h-[6rem]">
          <article className="absolute top-0" ref={statementRef}></article>
          <div
            className={clsx(
              "PreviewStatement",
              "absolute top-0 w-full h-[6rem] bg-gradient-to-b",
              "from-transparent via-transparent"
            )}
          ></div>
        </div>
      </>
    ),
    [onDelete, renderTags, title]
  );

  const handleRenderMarkdown = useCallback(() => {
    if (statementRef.current)
      statementRef.current.innerHTML = md.render(statement);
  }, [statement]);

  useEffect(() => {
    handleRenderMarkdown();
  }, [handleRenderMarkdown]);

  return (
    <Card
      className={clsx("Preview cursor-pointer !h-fit", "hover:bg-secondary-50")}
      onClick={(e) => {
        onEdit();
        e.stopPropagation();
      }}
    >
      {renderMain}
    </Card>
  );
}
