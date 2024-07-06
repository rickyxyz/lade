import { MarkdownEditor } from "../Markdown";
import { StateType } from "@/types";

export function CommentEditor({
  stateComment,
  onSubmit,
  submitDisabled,
}: {
  stateComment: StateType<string>;
  onSubmit: () => void;
  submitDisabled?: boolean;
}) {
  const [comment, setComment] = stateComment;

  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-full bg-red-700" />
      <MarkdownEditor
        onSubmit={onSubmit}
        placeholder="Enter the contest description here..."
        value={comment}
        onChange={(newValue) => {
          setComment(newValue);
        }}
        submitDisabled={submitDisabled}
      />
    </div>
  );
}
