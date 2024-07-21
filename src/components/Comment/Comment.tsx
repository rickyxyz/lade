import { CommentType } from "@/types/comment";
import { Paragraph } from "../Paragraph";
import { getDateString, timeAgo } from "@/utils";
import { MarkdownBase } from "../Markdown";
import clsx from "clsx";
import { CSSProperties, ReactNode, useMemo, useState } from "react";
import { CommentAction } from "./CommentAction";
import {
  ChatBubble,
  ModeEditOutlineOutlined,
  ReplyOutlined,
} from "@mui/icons-material";

export function Comment({
  ancestor,
  className,
  comment: selfComment,
  focus,
  focusEditId,
  depth,
  userId,
  renderPostEditor,
  renderEditEditor,
  onReply,
  onEdit,
  onCancelEdit,
  onViewReply,
  onHideReply,
}: {
  ancestor?: CommentType;
  className?: string;
  comment: CommentType;
  focus?: CommentType;
  focusEditId?: string;
  depth: number;
  userId?: string;
  renderPostEditor: (
    parentComment?: string,
    defaultValue?: string
  ) => ReactNode;
  renderEditEditor: (
    comment: CommentType,
    onCancel: () => void,
    parentId?: string
  ) => ReactNode;
  onReply: (comment: CommentType) => void;
  onEdit: (commentId: string) => void;
  onCancelEdit: () => void;
  onViewReply?: () => Promise<any>;
  onHideReply?: () => void;
}) {
  const { id, author, createdAt, description, replies, replyCount } =
    selfComment;

  const [replyFetched, setReplyFetched] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [edit, setEdit] = useState(false);

  const renderCommentAuthor = useMemo(
    () => (
      <div className="flex gap-4">
        <Paragraph weight="semibold" color="secondary-8">
          {author && (author.name ?? author.id)}
        </Paragraph>
        <Paragraph color="secondary-5">
          {timeAgo(new Date(createdAt))}
        </Paragraph>
      </div>
    ),
    [author, createdAt]
  );

  const renderCommentActions = useMemo(
    () => (
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
        {userId === author.id && (
          <CommentAction
            icon={ModeEditOutlineOutlined}
            onClick={() => {
              onEdit(id);
            }}
            label="Edit"
          />
        )}
      </div>
    ),
    [
      ancestor,
      author.id,
      id,
      onEdit,
      onHideReply,
      onReply,
      onViewReply,
      replyCount,
      replyFetched,
      replyLoading,
      userId,
    ]
  );

  const renderCommentReplyEditor = useMemo(
    () =>
      focus && focus.id === id && ancestor && ancestor.id ? (
        renderPostEditor(ancestor?.id, `@${focus.author.id}`)
      ) : (
        <></>
      ),
    [ancestor, focus, id, renderPostEditor]
  );

  const renderCommentReplies = useMemo(
    () =>
      replies ? (
        replies.map((comment) => (
          <Comment
            ancestor={ancestor}
            key={comment.id}
            comment={comment}
            userId={userId}
            onReply={() => onReply(comment)}
            onEdit={onEdit}
            onCancelEdit={onCancelEdit}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            depth={depth + 1}
            renderPostEditor={renderPostEditor}
            renderEditEditor={renderEditEditor}
            focus={focus}
          />
        ))
      ) : (
        <></>
      ),
    [
      ancestor,
      depth,
      focus,
      onCancelEdit,
      onEdit,
      onReply,
      renderEditEditor,
      renderPostEditor,
      replies,
      userId,
    ]
  );

  const renderCommentChildren = useMemo(
    () => (
      <div
        className={clsx(
          "flex flex-col flex-1 gap-4",
          ((focus && focus.id === id) || replyFetched) && "mt-4"
        )}
      >
        {renderCommentReplyEditor}
        {renderCommentReplies}
      </div>
    ),
    [focus, id, renderCommentReplies, renderCommentReplyEditor, replyFetched]
  );

  // const renderMainElement = useMemo(() => (

  // ), []);

  return (
    <div className={clsx("flex gap-4 w-full", className)}>
      {focusEditId === id ? (
        renderEditEditor(
          selfComment,
          () => {
            onCancelEdit();
          },
          ancestor && ancestor.id === id ? undefined : ancestor?.id
        )
      ) : (
        <>
          <>
            <div className="w-8 h-8 rounded-full bg-red-700" />
            <div className="mt-1 flex flex-1 flex-col gap-2">
              {renderCommentAuthor}
              <MarkdownBase markdown={description} />
              {renderCommentActions}
              {renderCommentChildren}
            </div>
          </>
        </>
      )}
    </div>
  );
}
