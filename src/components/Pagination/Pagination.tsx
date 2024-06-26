import { useMemo } from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useDevice } from "@/hooks";
import { PROBLEM_PAGINATION_COUNT } from "@/consts";
import { PaginationCalculatedData, PaginationData } from "@/types";
import { ButtonIcon } from "../Button";
import { Paragraph } from "../Paragraph";
import { PaginationButton } from "./PaginationButton";

interface PaginationProps {
  className?: string;
  pagination: PaginationCalculatedData;
  onClick: (page: number) => void;
}

export function Pagination({
  className,
  pagination,
  onClick,
}: PaginationProps) {
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
  } = pagination;

  const renderPaginationFirst = useMemo(() => {
    return (
      <>
        {Array.from({ length: visiblePages }, (_, i) => i + 1).map((i) => {
          const chosen = page === i;
          return (
            <PaginationButton
              size={device === "mobile" ? "s" : "m"}
              key={i}
              label={String(i)}
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
              label={String(i)}
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
              label={String(i)}
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
          disabled={page === 1 || count === 0}
          size={device === "mobile" ? "s" : "m"}
          iconSize={device === "mobile" ? "s" : "m"}
          onClick={() => {
            onClick(Math.max(0, page - 1));
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
          disabled={page === maxPages || count === 0}
          size={device === "mobile" ? "s" : "m"}
          iconSize={device === "mobile" ? "s" : "m"}
          onClick={() => {
            onClick(Math.min(maxPages, page + 1));
          }}
        />
      </div>
    </div>
  );
}
