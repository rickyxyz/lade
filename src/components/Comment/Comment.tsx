import { CommentType } from "@/types/comment";
import { Paragraph } from "../Paragraph";
import { getDateString } from "@/utils";
import { MarkdownBase } from "../Markdown";
import clsx from "clsx";
import { CSSProperties, Fragment } from "react";

export function Comment({
  className,
  comment: { author, createdAt, description, replies, replyCount },
  focused,
  style,
  onReply,
  onViewReply,
}: {
  className?: string;
  comment: CommentType;
  focused?: boolean;
  style?: CSSProperties;
  onReply: () => void;
  onViewReply: () => void;
}) {
  return (
    <div className={clsx("flex gap-4", className)}>
      <div className="w-8 h-8 rounded-full bg-red-700" />
      <div className="mt-1 flex flex-col gap-4">
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
          <Paragraph color="secondary-7" onClick={onReply}>
            Reply
          </Paragraph>
        </div>
        {replyCount ? (
          <div className="bg-blue-100 rounded-lg p-2" onClick={onViewReply}>
            <Paragraph>View {replyCount} reply</Paragraph>
          </div>
        ) : (
          <></>
        )}
        {replies &&
          replies.map((comment) => (
            <Fragment key={comment.id}>
              <Comment
                comment={comment}
                onReply={() => {}}
                onViewReply={() => {}}
              />
            </Fragment>
          ))}
      </div>
    </div>
  );
}
