import { AnswerType, ProblemAnswerType, ProblemType } from "@/types";
import { md } from "@/utils";
import { useCallback, useEffect, useMemo, useRef } from "react";

interface ProblemCreateEditorAnswerProps<T extends ProblemAnswerType> {
  type: T;
  answer: AnswerType<T>;
}

export function ProblemCreateEditorAnswer<T extends ProblemAnswerType>({
  type,
  answer,
}: ProblemCreateEditorAnswerProps<T>) {
  const statementRef = useRef<HTMLDivElement>(null);

  const latexFormula = useMemo(() => {
    if (type === "short_answer") {
      return `$\\text{${answer.content}}$`;
    } else {
      const { content, matrixHeight, matrixWidth } =
        answer as AnswerType<"matrix">;

      const matrix = content
        .filter((_, index) => index < matrixHeight)
        .map((row) => row.filter((_, idx) => idx < matrixWidth).join("&"))
        .join("\\\\");

      return `$\\begin{bmatrix}${matrix}\\end{bmatrix}$`;
    }
  }, [answer, type]);

  const handleRenderMarkdown = useCallback(() => {
    if (statementRef.current)
      statementRef.current.innerHTML = md.render(latexFormula);
  }, [latexFormula]);

  useEffect(() => {
    handleRenderMarkdown();
  }, [handleRenderMarkdown]);

  return <span ref={statementRef}></span>;
}
