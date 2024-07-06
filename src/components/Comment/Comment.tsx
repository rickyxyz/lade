import { CommentType } from "@/types/comment";
import { Paragraph } from "../Paragraph";
import { getDateString } from "@/utils";
import { MarkdownBase } from "../Markdown";

export function Comment({
  comment: { author, createdAt, description },
  onViewReply,
}: {
  comment: CommentType;
  onViewReply: () => void;
}) {
  return (
    <div className="flex gap-4">
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
          <Paragraph color="secondary-7">Reply</Paragraph>
        </div>
      </div>
    </div>
  );
}
