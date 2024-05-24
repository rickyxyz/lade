import clsx from "clsx";
import {
  RefObject,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Paragraph } from "../Paragraph";
import { md } from "@/utils";

interface MarkdownPreviewProps {
  className?: string;
  classNameOverlay?: string;
  markdown: string;
  maxLines?: number;
}

type CustomHTMLElement = HTMLElement & {
  adjustHeight?: () => void;
};

export function MarkdownPreview({
  className,
  classNameOverlay,
  markdown,
  maxLines = 3,
}: MarkdownPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [lastRender, setLastRender] = useState(0);

  const heightStyle = useMemo(
    () => ({
      height: `${(maxLines * 1.5).toFixed(1)}rem`,
    }),
    [maxLines]
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

    containerRef.current.style.height = `${Math.min(
      contentRef.current.offsetHeight,
      maxLines * 24
    ).toFixed(1)}px`;
  }, [lastRender, maxLines]);

  return (
    <>
      <div
        className={clsx("relative overflow-hidden", className)}
        style={heightStyle}
        ref={containerRef}
      >
        <article className="absolute top-0" ref={contentRef} />
        <div
          ref={overlayRef}
          className={clsx(
            classNameOverlay,
            "absolute top-0 w-full bg-gradient-to-b",
            "from-transparent via-transparent to-white"
          )}
          style={heightStyle}
        />
      </div>
    </>
  );
}
