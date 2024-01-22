import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { ButtonIcon } from "../Button";
import { PaginationData } from "@/types/pagination";
import { Paragraph } from "../Paragraph";
import { PROBLEM_PAGINATION_COUNT } from "@/consts";
import { useMemo } from "react";
import { useDevice } from "@/hooks";
import clsx from "clsx";
import { PaginationButton } from "./PaginationButton";

interface PaginationProps {
  pagination: PaginationData;
  onClick: (page?: number) => void;
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
    <div className={clsx("flex mb-8 justify-center md:items-between", "")}>
      {device !== "mobile" && (
        <div className="flex flex-1">
          <Paragraph className="my-auto" color="secondary-6">
            Showing {contentFrom} - {contentTo} of {count} contents
          </Paragraph>
        </div>
      )}
      <div className="flex">
        <ButtonIcon
          variant="outline"
          order="first"
          orderDirection="row"
          icon={BsChevronLeft}
          disabled={page === 1}
          size={device === "mobile" ? "s" : "m"}
          iconSize={device === "mobile" ? "s" : "m"}
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
          icon={BsChevronRight}
          disabled={page === maxPages}
          size={device === "mobile" ? "s" : "m"}
          iconSize={device === "mobile" ? "s" : "m"}
        />
      </div>
    </div>
  );
}
