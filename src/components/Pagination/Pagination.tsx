import { useMemo } from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useDevice } from "@/hooks";
import { PROBLEM_PAGINATION_COUNT } from "@/consts";
import { PaginationCalculatedData, PaginationData } from "@/types";
import { ButtonIcon } from "../Button";
import { Paragraph } from "../Paragraph";
import { PaginationButton } from "./PaginationButton";
import { PaginationCaption } from "./PaginationCaption";
import { PaginationButtonSet } from "./PaginationButtonSet";

interface PaginationProps {
  className?: string;
  pagination: PaginationCalculatedData;
  onClick: (page: number) => void;
}

export function Pagination({ pagination, onClick }: PaginationProps) {
  return (
    <div
      className={clsx(
        "flex justify-center",
        "items-center md:items-between",
        "flex-col md:flex-row",
        "mb-8 gap-4"
      )}
    >
      <PaginationCaption pagination={pagination} />
      <PaginationButtonSet pagination={pagination} onClick={onClick} />
    </div>
  );
}
