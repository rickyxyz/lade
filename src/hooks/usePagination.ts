import { useMemo } from "react";
import { PaginationCalculatedData, PaginationData } from "@/types";
import { PROBLEM_PAGINATION_COUNT } from "@/consts";

export function usePagination({
  pagination,
  countPerPage = PROBLEM_PAGINATION_COUNT,
}: {
  pagination: PaginationData;
  countPerPage?: number;
}) {
  return useMemo<PaginationCalculatedData>(() => {
    const { page, maxPages, count } = pagination;
    const visiblePages = Math.min(5, maxPages);
    const half = Math.floor(visiblePages / 2);

    let newStyle: "first" | "last" | "middle" = "first";
    if (page + half >= maxPages) {
      newStyle = "last";
    } else if (page - half <= 1) {
      newStyle = "first";
    } else {
      newStyle = "middle";
    }

    const from = (page - 1) * countPerPage + 1;
    const to = Math.min(page * countPerPage, count);

    return {
      page,
      maxPages,
      count,
      visiblePages,
      half,
      style: newStyle,
      contentFrom: from,
      contentTo: to,
    };
  }, [countPerPage, pagination]);
}
