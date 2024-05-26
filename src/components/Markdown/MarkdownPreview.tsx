import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { md } from "@/utils";
import { MarkdownBase } from "./Markdown";
import { MarkdownTag } from "./types";

interface MarkdownPreviewProps {
  className?: string;
  classNameOverlay?: string;
  markdown: string;
  maxLines?: number;
  isTruncated?: boolean;
  tag?: MarkdownTag;
}

export function MarkdownPreview({
  className,
  classNameOverlay,
  markdown,
  maxLines = 3,
  isTruncated,
  tag = "article",
}: MarkdownPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [lastRender, setLastRender] = useState(0);

  const heightStyle = useMemo(
    () => ({
      height: isTruncated ? `${(maxLines * 1.5).toFixed(1)}rem` : undefined,
    }),
    [isTruncated, maxLines]
  );

  const handleUpdateRender = useCallback(() => {
    setLastRender(new Date().getTime());
  }, []);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    if (isTruncated)
      containerRef.current.style.height = `${Math.min(
        contentRef.current.offsetHeight,
        maxLines * 24
      ).toFixed(1)}px`;
  }, [isTruncated, lastRender, maxLines]);

  return (
    <>
      <div
        className={clsx("relative overflow-hidden", className)}
        style={heightStyle}
        ref={containerRef}
      >
        {/* <article
          className={clsx(isTruncated ? "absolute top-0" : "")}
          ref={contentRef}
        /> */}
        <MarkdownBase
          className={clsx(isTruncated ? "absolute top-0" : "")}
          markdown={markdown}
          ref={contentRef}
          tag={tag}
          onRender={handleUpdateRender}
        />
        {isTruncated && (
          <div
            ref={overlayRef}
            className={clsx(
              classNameOverlay,
              "absolute top-0 w-full bg-gradient-to-b",
              "from-transparent via-transparent to-white"
            )}
            style={heightStyle}
          />
        )}
      </div>
    </>
  );
}
