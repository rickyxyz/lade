import { API } from "@/api";
import { Card, MarkdownEditor } from "@/components";
import { Comment } from "@/components/Comment";
import { CommentEditor } from "@/components/Comment/CommentEditor";
import { CommentType } from "@/types/comment";
import { useCallback, useEffect, useMemo, useState } from "react";

export function ProblemDetailComments({ problemId }: { problemId: string }) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [focus, setFocus] = useState<string>();
  const stateComment = useState<string>("");
  const [comment, setComment] = stateComment;
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<
    "unloaded" | "loading" | "loaded" | "error"
  >("unloaded");

  const handleGetComments = useCallback(() => {
    if (status !== "unloaded") return;

    setStatus("loading");

    API(
      "get_problem_comment",
      {
        params: {
          problemId,
        },
      },
      {
        onSuccess: ({ data: { data } }) => {
          setComments(data);
        },
        onFail: () => {
          setStatus("error");
        },
      }
    );
  }, [problemId, status]);

  useEffect(() => {
    handleGetComments();
  }, [handleGetComments]);

  const handlePostComment = useCallback(() => {
    setLoading(true);
    API(
      "post_problem_comment",
      {
        body: {
          problemId,
          comment,
        },
      },
      {
        onSuccess({ data: { data } }) {
          setLoading(false);
          setComments((prev) => [data, ...prev]);
        },
        onFail() {
          setLoading(false);
        },
      }
    );
  }, [comment, problemId]);

  const renderEditor = useMemo(
    () => (
      <CommentEditor
        stateComment={stateComment}
        onSubmit={handlePostComment}
        submitDisabled={loading || comment.length === 0}
      />
    ),
    [comment.length, handlePostComment, loading, stateComment]
  );

  return (
    <Card className="flex flex-col gap-4" data-color-mode="light">
      {renderEditor}
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} onViewReply={() => {}} />
      ))}
    </Card>
  );
}
