import clsx from "clsx";
import { MarkdownEditor } from "../Markdown";
import { StateType } from "@/types";
import { CSSProperties, useState } from "react";

export function CommentEditor({
  className,
  parentComment,
  stateComment,
  submitDisabled,
  style,
  defaultValue = "",
  onSubmit,
}: {
  className?: string;
  parentComment?: string;
  stateComment?: StateType<string>;
  defaultValue?: string;
  onSubmit: (comment: string, parentCommentId?: string) => Promise<any>;
  submitDisabled?: boolean;
  style?: CSSProperties;
}) {
  const selfState = useState(defaultValue);
  const [comment, setComment] = stateComment ?? selfState;

  return (
    <div className={clsx("flex gap-4", className)} style={style}>
      <div
        className="rounded-full bg-red-700"
        style={{
          minWidth: "32px",
          maxWidth: "32px",
          minHeight: "32px",
          maxHeight: "32px",
        }}
      />
      <MarkdownEditor
        onSubmit={() => {
          onSubmit(comment, parentComment).then(() => {
            setComment("");
          });
        }}
        placeholder="Comment here..."
        value={comment}
        onChange={(newValue) => {
          setComment(newValue);
        }}
        submitDisabled={submitDisabled || comment.length === 0}
      />
    </div>
  );
}
