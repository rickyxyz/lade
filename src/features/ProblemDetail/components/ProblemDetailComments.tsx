import { API } from "@/api";
import { Card, MarkdownEditor, Pagination, Paragraph } from "@/components";
import { Comment } from "@/components/Comment";
import { CommentEditor } from "@/components/Comment/CommentEditor";
import { PaginationButtonSet } from "@/components/Pagination/PaginationButtonSet";
import { usePagination } from "@/hooks";
import { PaginationData } from "@/types";
import { CommentType } from "@/types/comment";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { ProblemDetailCommentsSkeleton } from "./ProblemDetailCommentsSkeleton";

export function ProblemDetailComments({
  problemId,
  userId,
}: {
  problemId: string;
  userId?: string;
}) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [paginationBase, setPagination] = useState({
    page: 1,
    maxPages: 1,
    count: 1,
    initialized: false,
  });

  const pagination = usePagination({
    pagination: paginationBase,
  });

  const [focus, setFocus] = useState<CommentType>();
  const [edit, setEdit] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<
    "unloaded" | "loading" | "loaded" | "error"
  >("unloaded");

  const handleGetComments = useCallback(
    (newPage?: number) => {
      console.log("Get Comment (1): ", newPage);
      if (
        (newPage === undefined && status !== "unloaded") ||
        (newPage !== undefined && status === "loading")
      )
        return;

      console.log("Get Comment (2): ", newPage);

      setStatus("loading");
      setFocus(undefined);

      API(
        "get_problem_comment",
        {
          params: {
            problemId,
            page: newPage,
            count: 5,
          },
        },
        {
          onSuccess: ({
            data: {
              data,
              pagination: { current_page, total_pages, total_records },
            },
          }) => {
            setComments(data);
            setPagination({
              page: current_page,
              maxPages: total_pages,
              count: total_records,
              initialized: true,
            });
            setStatus("loaded");
          },
          onFail: () => {
            setStatus("error");
          },
        }
      );
    },
    [problemId, status]
  );

  useEffect(() => {
    handleGetComments();
  }, [handleGetComments]);

  const handleHideReplies = useCallback((commentId?: string) => {
    setComments((prev) => {
      const temp = [...prev];
      return temp.map((comment) => {
        if (comment.id !== commentId) return comment;

        return {
          ...comment,
          replies: [],
        };
      });
    });
  }, []);

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
        }
      ),
    [problemId]
  );

  const handlePostComment = useCallback(
    (comment: string, parentId?: string) => {
      setLoading(true);
      console.log("Comment: ", parentId);
      return API(
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
            if (parentId) {
              setComments((prev) => {
                const temp = [...prev];

                return temp.map((comment) =>
                  comment.id === parentId
                    ? {
                        ...comment,
                        replies: [data, ...(comment.replies ?? [])],
                      }
                    : comment
                );
              });
            } else {
              setComments((prev) => [data, ...prev]);
            }
          },
          onFail() {
            setLoading(false);
          },
        }
      );
    },
    [problemId]
  );

  const handleEditComment = useCallback(
    (comment: string, commentId: string, parentId?: string) => {
      setLoading(true);
      return API(
        "patch_problem_comment",
        {
          body: {
            commentId,
            comment,
          },
        },
        {
          onSuccess() {
            setLoading(false);
            setEdit(undefined);
            setComments((prev) => {
              const temp = [...prev];

              if (temp.some((cmt) => cmt.id === commentId)) {
                return temp.map((cmt) =>
                  cmt.id === commentId
                    ? {
                        ...cmt,
                        description: comment,
                      }
                    : cmt
                );
              }

              return temp.map((cmt) =>
                cmt.id === parentId
                  ? {
                      ...cmt,
                      replies: (cmt.replies ?? []).map((reply) =>
                        reply.id === commentId
                          ? {
                              ...reply,
                              description: comment,
                            }
                          : reply
                      ),
                    }
                  : cmt
              );
            });
          },
          onFail() {
            setLoading(false);
          },
        }
      );
    },
    []
  );

  const renderPostEditor = useCallback(
    (parentComment?: string, defaultValue?: string) => (
      <CommentEditor
        defaultValue={defaultValue}
        onSubmit={(comment) => handlePostComment(comment, parentComment)}
        submitDisabled={loading}
      />
    ),
    [handlePostComment, loading]
  );

  const renderEditEditor = useCallback(
    (comment: CommentType, onCancel: () => void, parentId?: string) => (
      <CommentEditor
        defaultValue={comment.description}
        onSubmit={(cmt) => handleEditComment(cmt, comment.id, parentId)}
        onCancel={onCancel}
        submitDisabled={loading}
      />
    ),
    [handleEditComment, loading]
  );

  return (
    <Card className="flex flex-col gap-8" data-color-mode="light">
      <Paragraph tag="h2" weight="semibold">
        Comments ({pagination.count})
      </Paragraph>
      {status === "loaded" ? (
        <>
          {renderPostEditor(undefined, "")}
          {comments.map((comment) => (
            <Fragment key={comment.id}>
              <Comment
                focus={focus}
                ancestor={comment}
                comment={comment}
                focusEditId={edit}
                onEdit={(id) => {
                  setEdit(id);
                }}
                onCancelEdit={() => {
                  setEdit(undefined);
                }}
                onReply={(toBeReplied) => {
                  setFocus((prev) => {
                    if (prev && toBeReplied.id === prev.id) return undefined;
                    return toBeReplied;
                  });
                }}
                onViewReply={async () => handleGetReplies(comment.id)}
                onHideReply={() => handleHideReplies(comment.id)}
                renderPostEditor={renderPostEditor}
                renderEditEditor={renderEditEditor}
                depth={0}
                userId={userId}
              />
            </Fragment>
          ))}
          <PaginationButtonSet
            className="mx-auto"
            pagination={pagination}
            onClick={(newPage) => {
              handleGetComments(newPage);
            }}
          />
        </>
      ) : (
        <ProblemDetailCommentsSkeleton />
      )}
    </Card>
  );
}
