import { PaginationCalculatedData } from "@/types";
import { Paragraph } from "../Paragraph";

interface PaginationProps {
  className?: string;
  pagination: PaginationCalculatedData;
}

export function PaginationCaption({ pagination }: PaginationProps) {
  const { contentFrom, contentTo, count } = pagination;

  return (
    <Paragraph className="my-auto" color="secondary-6">
      Showing {contentFrom} - {contentTo} of {count} contents
    </Paragraph>
  );
}
