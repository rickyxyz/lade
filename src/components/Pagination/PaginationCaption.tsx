import { PaginationCalculatedData } from "@/types";
import { Paragraph } from "../Paragraph";

interface PaginationCaptionProps {
  className?: string;
  pagination: PaginationCalculatedData;
}

export function PaginationCaption({ pagination }: PaginationCaptionProps) {
  const { contentFrom, contentTo, count } = pagination;

  return (
    <div className="flex flex-1">
      <Paragraph className="my-auto" color="secondary-6">
        Showing {contentFrom} - {contentTo} of {count} contents
      </Paragraph>
    </div>
  );
}
