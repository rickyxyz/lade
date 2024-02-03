import { md } from "@/utils";
import { useCallback, useEffect, useRef } from "react";

export interface MarkdownProps {
  markdown: string;
}

export function Markdown({ markdown = "" }: MarkdownProps) {
  const statementRef = useRef<HTMLDivElement>(null);

  const handleRenderMarkdown = useCallback(() => {
    if (statementRef.current)
      statementRef.current.innerHTML = md.render(markdown);
  }, [markdown]);

  useEffect(() => {
    handleRenderMarkdown();
  }, [handleRenderMarkdown]);

  return <div className="markdown" ref={statementRef}></div>;
}
