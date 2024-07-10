import { CommentType } from "@/types/comment";
import { Paragraph } from "../Paragraph";
import { getDateString } from "@/utils";
import { MarkdownBase } from "../Markdown";
import clsx from "clsx";
import { CSSProperties, Fragment, ReactNode, useState } from "react";

export function Comment({
  className,
  comment: selfComment,
  focus,
  style,
  depth,
  renderEditor,
  onReply,
  onViewReply,
}: {
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
          <Paragraph color="secondary-7" onClick={() => onReply(selfComment)}>
            Reply
          </Paragraph>
        </div>
        {replyCount && !replyFetched ? (
          <div
            className="bg-blue-100 rounded-lg p-2 px-4 w-fit"
            onClick={() => {
              if (replyFetched) return;

              onViewReply().then(() => {
                setReplyFetched(true);
              });
            }}
          >
            <Paragraph>View {replyCount} reply</Paragraph>
          </div>
        ) : (
          <></>
        )}

        {focus && focus.id === id && renderEditor(id, `@${focus.author.id}`)}
        {replies &&
          replies.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onReply={() => onReply(comment)}
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
