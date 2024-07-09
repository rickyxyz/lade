import { API } from "@/api";
import { Card, MarkdownEditor, Paragraph } from "@/components";
import { Comment } from "@/components/Comment";
import { CommentEditor } from "@/components/Comment/CommentEditor";
import { CommentType } from "@/types/comment";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";

export function ProblemDetailComments({ problemId }: { problemId: string }) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [focus, setFocus] = useState<string>();
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

  const handleGetReplies = useCallback(
    (commentId?: string) =>
      API(
        "get_problem_comment",
        {
          params: {
            problemId,
            commentId,
          },
        },
        {
          onSuccess: ({ data: { data } }) => {
            setComments((prev) => {
              const temp = [...prev];
              return temp.map((comment) => {
                if (comment.id !== commentId) return comment;

                return {
                  ...comment,
                  replies: data,
                };
              });
            });
          },
          onFail: () => {},
        }
      ),
    [problemId]
  );

  const handlePostComment = useCallback(
    (comment: string, parentId?: string) => {
      setLoading(true);
      API(
        "post_problem_comment",
        {
          body: {
            problemId,
            commentId: parentId,
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
    },
    [problemId]
  );

  const renderEditor = useCallback(
    (depth?: number, parentComment?: string) => (
      <CommentEditor
        parentComment={parentComment}
        onSubmit={handlePostComment}
        submitDisabled={loading}
      />
    ),
    [handlePostComment, loading]
  );

  return (
    <Card className="flex flex-col gap-4" data-color-mode="light">
      <Paragraph tag="h2" weight="semibold">
        Comments
      </Paragraph>
      {renderEditor()}
      {comments.map((comment) => (
        <Fragment key={comment.id}>
          <Comment
            focus={focus}
            comment={comment}
            onReply={(id) => {
              setFocus(id);
            }}
            onViewReply={async () => handleGetReplies(comment.id)}
            renderEditor={renderEditor}
            depth={0}
          />
        </Fragment>
      ))}
    </Card>
  );
}
