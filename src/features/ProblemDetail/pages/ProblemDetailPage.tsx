/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect, useCallback, useState } from "react";
import { crudData } from "@/firebase";
import { ProblemType, ContentViewType } from "@/types";
import { deconstructAnswerString } from "@/utils";
import { PROBLEM_BLANK } from "@/consts";
import { ProblemDetailMainSkeleton } from "../components/ProblemDetailMainSkeleton";
import { ProblemDetailMain } from "../components";
import { ProblemEdit } from "@/features/ProblemCreate";
import { PageTemplate } from "@/templates";

interface ProblemProps {
  id: string;
}

export function ProblemDetailPage({ id }: ProblemProps) {
  const stateProblem = useState<ProblemType>(
    PROBLEM_BLANK as unknown as ProblemType
  );
  const [problem, setProblem] = stateProblem;
  const [loading, setLoading] = useState(true);
  const stateMode = useState<ContentViewType>("view");
  const [mode, setMode] = stateMode;

  const renderEditHeader = useMemo(
    () => <h1 className="mb-8">Edit Problem</h1>,
    []
  );

  const renderQuestion = useMemo(() => {
    if (loading || !problem) return <ProblemDetailMainSkeleton />;

    return mode === "view" ? (
      <ProblemDetailMain stateProblem={stateProblem} stateMode={stateMode} />
    ) : (
      <ProblemEdit
        headElement={renderEditHeader}
        stateProblem={stateProblem}
        problem={problem}
        stateMode={stateMode}
        purpose="edit"
      />
    );
  }, [loading, problem, mode, stateMode, renderEditHeader, stateProblem]);

  const handleGetProblems = useCallback(async () => {
    if (!loading) return;

    setLoading(true);

    await crudData("get_problem", {
      id,
    }).then((result) => {
      if (result) {
        setProblem({
          ...result,
          answer: deconstructAnswerString(result.type, result.answer),
        } as ProblemType);

        setLoading(false);
      }
    });
  }, [id, loading, setProblem]);

  useEffect(() => {
    handleGetProblems();
  }, [handleGetProblems]);

  return <PageTemplate>{renderQuestion}</PageTemplate>;
}
