import { CommentType } from "@/types/comment";
import { Paragraph } from "../Paragraph";
import { getDateString, timeAgo } from "@/utils";
import { MarkdownBase } from "../Markdown";
import clsx from "clsx";
import { CSSProperties, ReactNode, useState } from "react";
import { CommentAction } from "./CommentAction";
import { ChatBubble, ReplyOutlined } from "@mui/icons-material";

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
  onHideReply,
}: {
  ancestor?: CommentType;
  className?: string;
  comment: CommentType;
  focus?: CommentType;
  style?: CSSProperties;
  depth: number;
  renderEditor: (parentComment?: string, defaultValue?: string) => ReactNode;
  onReply: (comment: CommentType) => void;
  onViewReply?: () => Promise<any>;
  onHideReply?: () => void;
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
            {timeAgo(new Date(createdAt))}
          </Paragraph>
        </div>
        <MarkdownBase markdown={description} />
        <div className="flex gap-8">
          {replyCount > 0 &&
            (!replyFetched ? (
              <CommentAction
                icon={ChatBubble}
                onClick={() => {
                  if (replyLoading) return;

                  setReplyLoading(true);
                  onViewReply &&
                    onViewReply().then(() => {
                      setReplyFetched(true);
                      setReplyLoading(false);
                    });
                }}
                label={`View ${replyCount} reply`}
                disabled={replyLoading}
              />
            ) : (
              <CommentAction
                icon={ChatBubble}
                onClick={() => {
                  onHideReply && onHideReply();
                  setReplyFetched(false);
                }}
                label="Hide replies"
              />
            ))}
          <CommentAction
            icon={ReplyOutlined}
            onClick={() => ancestor && onReply(ancestor)}
            label="Reply"
          />
        </div>
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
              depth={depth + 1}
              renderEditor={renderEditor}
              focus={focus}
            />
          ))}
      </div>
    </div>
  );
}
