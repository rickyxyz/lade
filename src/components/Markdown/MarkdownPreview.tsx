import clsx from "clsx";
import {
  RefObject,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Paragraph } from "../Paragraph";

interface MarkdownPreviewProps {
  className?: string;
  classNameOverlay?: string;
  maxLines?: number;
}

export const MarkdownPreview = forwardRef<HTMLElement, MarkdownPreviewProps>(
  function Component({ className, classNameOverlay, maxLines = 3 }, ref) {
    const contentRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    const heightStyle = useMemo(
      () => ({
        height: `${(maxLines * 1.5).toFixed(1)}rem`,
      }),
      [maxLines]
    );

    useImperativeHandle(ref, () => contentRef.current as HTMLElement);

    return (
      <>
        <div
          className={clsx("relative overflow-hidden", className)}
          style={heightStyle}
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
);
