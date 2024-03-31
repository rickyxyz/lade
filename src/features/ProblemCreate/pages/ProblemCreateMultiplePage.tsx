import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PROBLEM_BLANK } from "@/consts";
import { ProblemCreateEditor } from "../components";
import { PageTemplate } from "@/templates";
import { ProblemType } from "@/types";
import { crudData } from "@/libs/firebase";
import { useDebounce } from "@/hooks";
import { api } from "@/utils/api";
import { useAppSelector } from "@/libs/redux";
import { API } from "@/api";
import { Button } from "@/components";
import { PROBLEM_PLACEHOLDERS } from "@/libs/firebase/placeholders";
import { ProblemCreateEditorMultiple } from "../components/ProblemCreateEditorMultiple";

export function ProblemCreateMultiplePage() {
  const stateProblems = useState<ProblemType[]>([
    PROBLEM_BLANK as unknown as ProblemType,
  ]);

  const stateLoading = useState(false);
  const [, setLoading] = stateLoading;
  const debounce = useDebounce();
  const router = useRouter();
  const user = useAppSelector("user");

  const renderHead = useMemo(() => {
    return <h1 className="mb-8">Create Problem</h1>;
  }, []);

  return (
    <PageTemplate className="flex" title="Create Problem">
      <ProblemCreateEditorMultiple
        headElement={renderHead}
        stateProblems={stateProblems}
        stateLoading={stateLoading}
        onSubmit={() => {}}
      />
    </PageTemplate>
  );
}
