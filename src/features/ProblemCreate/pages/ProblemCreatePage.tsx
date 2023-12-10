import { useMemo, useState } from "react";
import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { ProblemWithoutIdType } from "@/types";
import { PROBLEM_BLANK } from "@/consts";
import { ProblemCreateEditor } from "../components";
import { PageTemplate } from "@/templates";

export function ProblemCreatePage() {
  const stateProblem = useState<ProblemWithoutIdType>(
    PROBLEM_BLANK as unknown as ProblemWithoutIdType
  );
  const problem = stateProblem[0];

  const renderHead = useMemo(() => {
    return <h1 className="mb-8">Create Problem</h1>;
  }, []);

  return (
    <PageTemplate>
      <ProblemCreateEditor
        headElement={renderHead}
        problem={problem}
        purpose="create"
      />
    </PageTemplate>
  );
}
