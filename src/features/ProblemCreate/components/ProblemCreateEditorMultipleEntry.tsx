import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ProblemDetailStats, ProblemDetailTopics } from "@/features";
import {
  ButtonIcon,
  Card,
  MarkdownPreview,
  More,
  Paragraph,
} from "@/components";
import { getPermissionForContent, md, parseAnswer } from "@/utils";
import { ProblemDatabaseType, ProblemType } from "@/types";
import { useAppSelector } from "@/libs/redux";
import { CheckCircle, Close, Delete, Edit, Person } from "@mui/icons-material";
import { on } from "events";
import clsx from "clsx";
import { ProblemCreateEditorAnswer } from "./ProblemCreateEditorAnswer";

export interface ProblemCreateEditorMultipleEntryProps {
  problem: ProblemType;
  isDeletable?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProblemCreateEditorMultipleEntry({
  problem,
  isDeletable,
  onEdit,
  onDelete,
}: ProblemCreateEditorMultipleEntryProps) {
  const { description, title, topic, subTopic, answer, type } = problem;

  const parsedAnswer = useMemo(() => parseAnswer(type, answer), [answer, type]);

  const descriptionRef = useRef<HTMLDivElement>(null);

  const renderTags = useMemo(
    () =>
      topic && subTopic ? (
        <ProblemDetailTopics
          className="mb-4"
          topic={topic.name}
          subTopic={subTopic.name}
        />
      ) : (
        <></>
      ),
    [subTopic, topic]
  );

  const renderMain = useMemo(
    () => (
      <>
        <div className="relative flex justify-between">
          <Paragraph tag="h2" size="l">
            {title}
          </Paragraph>
          <div className="flex gap-2">
            <ButtonIcon
              variant="ghost"
              icon={Edit}
              onClick={(e) => {
                onEdit();
                e.stopPropagation();
              }}
            />
            <ButtonIcon
              variant="ghost"
              icon={Delete}
              color="danger"
              onClick={(e) => {
                onDelete();
                e.stopPropagation();
              }}
              disabled={isDeletable}
            />
          </div>
        </div>
        {renderTags}
        <MarkdownPreview className="mb-4" markdown={description} />
        <div className="flex items-center gap-4">
          <Paragraph size="s" color="secondary-4">
            ANSWER
          </Paragraph>
          <div
            className={clsx(
              "relative flex items-center justify-center overflow-y-visible",
              "bg-secondary-200 border border-secondary-300 py-2 px-4",
              "rounded-sm"
            )}
          >
            <ProblemCreateEditorAnswer answer={parsedAnswer} type={type} />
          </div>
        </div>
      </>
    ),
    [
      isDeletable,
      onDelete,
      onEdit,
      parsedAnswer,
      renderTags,
      description,
      title,
      type,
    ]
  );

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
