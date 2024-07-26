import { COMMENT_LENGTH_MAX, COMMENT_LENGTH_MIN } from "@/consts";

export function validateComment(comment?: string) {
  const valid =
    comment &&
    comment.length >= COMMENT_LENGTH_MIN &&
    COMMENT_LENGTH_MAX >= comment.length;

  return valid
    ? null
    : `Comment length must be ${COMMENT_LENGTH_MIN} - ${COMMENT_LENGTH_MAX}.`;
}
