import { useMemo, useState } from "react";
import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Card, PageGenericTemplate } from "@/components";
import { ProblemWithoutIdType } from "@/types";
import { PROBLEM_BLANK } from "@/consts";
import { ProblemEdit } from "@/components/Problem/Editor/ProblemEdit";

export default function Problem() {
  const stateProblem = useState<ProblemWithoutIdType>(
    PROBLEM_BLANK as unknown as ProblemWithoutIdType
  );
  const problem = stateProblem[0];

  const renderHead = useMemo(() => {
    return <h1 className="mb-8">Create Problem</h1>;
  }, []);

  return (
    <PageGenericTemplate>
      <Card>
        {renderHead}
        <ProblemEdit defaultProblem={problem} />
      </Card>
    </PageGenericTemplate>
  );
}
