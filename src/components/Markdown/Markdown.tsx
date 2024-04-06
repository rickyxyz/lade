import { md } from "@/utils";
import clsx from "clsx";
import { useCallback, useEffect, useRef } from "react";

export interface MarkdownProps {
  className?: string;
  markdown: string;
}

export function Markdown({ markdown = "", className }: MarkdownProps) {
  const statementRef = useRef<HTMLDivElement>(null);

  const handleRenderMarkdown = useCallback(() => {
    if (statementRef.current)
      statementRef.current.innerHTML = md.render(markdown);
  }, [markdown]);

  useEffect(() => {
    handleRenderMarkdown();
  }, [handleRenderMarkdown]);

  return <div className={clsx("markdown", className)} ref={statementRef}></div>;
}
