import React, {
  Ref,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import clsx from "clsx";
import { md } from "@/utils";
import { MarkdownTag } from "./types";

export interface MarkdownBase<T extends MarkdownTag> {
  className?: string;
  markdown: string;
  tag?: T;
  ref?: Ref<HTMLElement>;
  onRender?: () => void;
}

const MarkdownBaseInner = <T extends MarkdownTag>(
  props: MarkdownBase<T>,
  ref: Ref<HTMLDivElement>
) => {
  const { markdown, className, tag: Tag = "div", onRender } = props;

  const statementRef = useRef<HTMLDivElement>(null);

  const handleRenderMarkdown = useCallback(() => {
    if (statementRef.current) {
      statementRef.current.innerHTML = md.render(markdown);
      onRender && onRender();
    }
  }, [markdown, onRender]);

  useImperativeHandle(ref, () => statementRef.current as any);

  useEffect(() => {
    handleRenderMarkdown();
  }, [handleRenderMarkdown]);

  return <Tag className={clsx("markdown", className)} ref={statementRef} />;
};

export const MarkdownBase = forwardRef(MarkdownBaseInner);
