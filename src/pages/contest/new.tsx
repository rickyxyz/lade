import { useMemo, useState } from "react";
import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { ContestEdit, GenericPageTemplate } from "@/components";
import { ContestDatabaseType } from "@/types";
import { CONTEST_DEFAULT } from "@/consts";

export default function CreateProblem() {
  const stateContest = useState<ContestDatabaseType>(
    CONTEST_DEFAULT as unknown as ContestDatabaseType
  );
  const contest = stateContest[0];

  const renderHead = useMemo(() => {
    return <h1 className="mb-8">Create Contest</h1>;
  }, []);

  return (
    <GenericPageTemplate>
      <ContestEdit
        headElement={renderHead}
        contest={contest}
        purpose="create"
      />
    </GenericPageTemplate>
  );
}
