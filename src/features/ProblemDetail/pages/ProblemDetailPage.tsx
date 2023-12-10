/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect, useCallback, useState } from "react";
import { crudData } from "@/firebase";
import { ProblemType, ContentViewType } from "@/types";
import { deconstructAnswerString } from "@/utils";
import { PROBLEM_BLANK } from "@/consts";
import { ProblemDetailMainSkeleton } from "../components/ProblemDetailMainSkeleton";
import { ProblemDetailMain } from "../components";
import { PageTemplate } from "@/templates";
import { ProblemCreateEditor } from "@/features/ProblemCreate";

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
      <ProblemCreateEditor
        headElement={renderEditHeader}
        problem={problem}
        purpose="edit"
        handleUpdateProblem={(data) => {
          setMode("view");
          setProblem((prev) => ({
            ...prev,
            ...data,
          }));
        }}
        onLeaveEditor={() => {
          setMode("view");
        }}
      />
    );
  }, [
    loading,
    problem,
    mode,
    stateProblem,
    stateMode,
    renderEditHeader,
    setMode,
    setProblem,
  ]);

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
