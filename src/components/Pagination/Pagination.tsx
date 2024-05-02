import { useMemo } from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useDevice } from "@/hooks";
import { PROBLEM_PAGINATION_COUNT } from "@/consts";
import { PaginationData } from "@/types";
import { ButtonIcon } from "../Button";
import { Paragraph } from "../Paragraph";
import { PaginationButton } from "./PaginationButton";

interface PaginationProps {
  pagination: PaginationData;
  onClick: (page: number) => void;
}

export function Pagination({ pagination, onClick }: PaginationProps) {
  const { device } = useDevice();
  const {
    visiblePages,
    half,
    contentFrom,
    contentTo,
    style,
    page,
    maxPages,
    count,
  } = useMemo(() => {
    const { page, maxPages, count } = pagination;
    const visiblePages = Math.min(5, maxPages);
    const half = Math.floor(visiblePages / 2);

    let newStyle = "first";
    if (page + half >= maxPages) {
      newStyle = "last";
    } else if (page - half <= 1) {
      newStyle = "first";
    } else {
      newStyle = "middle";
    }

    const from = (page - 1) * PROBLEM_PAGINATION_COUNT + 1;
    const to = Math.min(page * PROBLEM_PAGINATION_COUNT, count);

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
  }, [pagination]);

  const renderPaginationFirst = useMemo(() => {
    return (
      <>
        {Array.from({ length: visiblePages }, (_, i) => i + 1).map((i) => {
          const chosen = page === i;
          return (
            <PaginationButton
              size={device === "mobile" ? "s" : "m"}
              key={i}
              page={i}
              onClick={() => {
                if (!chosen) onClick(i);
              }}
              isActive={chosen}
            />
          );
        })}
      </>
    );
  }, [device, onClick, page, visiblePages]);

  const renderPaginationMiddle = useMemo(() => {
    return (
      <>
        {Array.from({ length: visiblePages }, (_, i) => i - half).map((i) => {
          const chosen = i === 0;
          return (
            <PaginationButton
              size={device === "mobile" ? "s" : "m"}
              key={i}
              page={i}
              onClick={() => {
                if (!chosen) onClick(page + i);
              }}
              isActive={chosen}
            />
          );
        })}
      </>
    );
  }, [device, half, onClick, page, visiblePages]);

  const renderPaginationLast = useMemo(() => {
    return (
      <>
        {Array.from(
          { length: visiblePages },
          (_, i) => maxPages - visiblePages + i + 1
        ).map((i) => {
          const chosen = page === i;
          return (
            <PaginationButton
              size={device === "mobile" ? "s" : "m"}
              key={i}
              page={i}
              onClick={() => {
                if (!chosen) onClick(i);
              }}
              isActive={chosen}
            />
          );
        })}
      </>
    );
  }, [device, maxPages, onClick, page, visiblePages]);

  return (
    <div
      className={clsx(
        "flex justify-center",
        "items-center md:items-between",
        "flex-col md:flex-row",
        "mb-8 gap-4"
      )}
    >
      <div className="flex flex-1">
        <Paragraph className="my-auto" color="secondary-6">
          Showing {contentFrom} - {contentTo} of {count} contents
        </Paragraph>
      </div>
      <div className="flex">
        <ButtonIcon
          variant="outline"
          order="first"
          orderDirection="row"
          icon={ChevronLeft}
          disabled={page === 1}
          size={device === "mobile" ? "s" : "m"}
          iconSize={device === "mobile" ? "s" : "m"}
          onClick={() => {
            onClick(Math.max(0, page - 1));
          }}
          style={{
            background: page === 1 ? undefined : "white",
          }}
        />
        {(() => {
          switch (style) {
            case "middle":
              return renderPaginationMiddle;
            case "last":
              return renderPaginationLast;
            default:
              return renderPaginationFirst;
          }
        })()}
        <ButtonIcon
          variant="outline"
          order="last"
          orderDirection="row"
          icon={ChevronRight}
          disabled={page === maxPages}
          size={device === "mobile" ? "s" : "m"}
          iconSize={device === "mobile" ? "s" : "m"}
          onClick={() => {
            onClick(Math.min(maxPages, page + 1));
          }}
          style={{
            background: page === maxPages ? undefined : "white",
          }}
        />
      </div>
    </div>
  );
}
