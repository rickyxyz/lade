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
  onSubmit,
}: {
  className?: string;
  parentComment?: string;
  stateComment?: StateType<string>;
  onSubmit: (comment: string, parentCommentId?: string) => void;
  submitDisabled?: boolean;
  style?: CSSProperties;
}) {
  const selfState = useState("");
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
          onSubmit(comment, parentComment);
        }}
        placeholder="Enter the contest description here..."
        value={comment}
        onChange={(newValue) => {
          setComment(newValue);
        }}
        submitDisabled={submitDisabled || comment.length === 0}
      />
    </div>
  );
}
