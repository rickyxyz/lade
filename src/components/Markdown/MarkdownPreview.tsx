import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { md } from "@/utils";

interface MarkdownPreviewProps {
  className?: string;
  classNameOverlay?: string;
  markdown: string;
  maxLines?: number;
  isTruncated?: boolean;
}

export function MarkdownPreview({
  className,
  classNameOverlay,
  markdown,
  maxLines = 3,
  isTruncated,
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

  const handleRenderMarkdown = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = md.render(markdown);
      setLastRender(new Date().getTime());
    }
  }, [markdown]);

  useEffect(() => {
    handleRenderMarkdown();
  }, [handleRenderMarkdown]);

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
        <article
          className={clsx(isTruncated ? "absolute top-0" : "")}
          ref={contentRef}
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
