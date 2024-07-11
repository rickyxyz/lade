import { CommentType } from "@/types/comment";
import { Paragraph } from "../Paragraph";
import { getDateString } from "@/utils";
import { MarkdownBase } from "../Markdown";
import clsx from "clsx";
import { CSSProperties, Fragment, ReactNode, useState } from "react";
import { Button } from "../Button";

export function Comment({
  ancestor,
  className,
  comment: selfComment,
  focus,
  style,
  depth,
  renderEditor,
  onReply,
  onViewReply,
}: {
  ancestor?: CommentType;
  className?: string;
  comment: CommentType;
  focus?: CommentType;
  style?: CSSProperties;
  depth: number;
  renderEditor: (parentComment?: string, defaultValue?: string) => ReactNode;
  onReply: (comment: CommentType) => void;
  onViewReply: () => Promise<any>;
}) {
  const { id, author, createdAt, description, replies, replyCount } =
    selfComment;

  const [replyFetched, setReplyFetched] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);

  return (
    <div className={clsx("flex gap-4", className)}>
      <div className="w-8 h-8 rounded-full bg-red-700" />
      <div className="mt-1 flex flex-1 flex-col gap-4">
        <div className="flex gap-4">
          <Paragraph weight="semibold" color="secondary-7">
            {author && (author.name ?? author.id)}
          </Paragraph>
          <Paragraph color="secondary-5">
            {getDateString(new Date(createdAt))}
          </Paragraph>
        </div>
        <MarkdownBase markdown={description} />
        <div>
          <Paragraph
            color="secondary-7"
            onClick={() => ancestor && onReply(ancestor)}
          >
            Reply
          </Paragraph>
        </div>
        {replyCount && !replyFetched ? (
          <Button
            variant="ghost"
            className="bg-blue-100 rounded-lg p-2 px-4 w-fit"
            onClick={() => {
              if (replyLoading) return;

              setReplyLoading(true);
              onViewReply().then(() => {
                setReplyFetched(true);
              });
            }}
            label={`View ${replyCount} reply`}
            disabled={replyFetched}
            loading={replyLoading}
          />
        ) : (
          <></>
        )}

        {focus &&
          focus.id === id &&
          ancestor &&
          ancestor.id &&
          renderEditor(ancestor?.id, `@${focus.author.id}`)}
        {replies &&
          replies.map((comment) => (
            <Comment
              ancestor={ancestor}
              key={comment.id}
              comment={comment}
              onReply={() => onReply(comment)}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onViewReply={async () => {}}
              depth={depth + 1}
              renderEditor={renderEditor}
              focus={focus}
            />
          ))}
      </div>
    </div>
  );
}
