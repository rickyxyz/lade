/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect, useCallback, useState } from "react";
import { crudData } from "@/libs/firebase";
import { ProblemType, ContentViewType } from "@/types";
import { PROBLEM_BLANK } from "@/consts";
import { ProblemDetailMainSkeleton } from "../components/ProblemDetailMainSkeleton";
import { ProblemDetailMain } from "../components";
import { PageTemplate } from "@/templates";
import { ProblemCreateEditor } from "@/features/ProblemCreate";
import { parseAnswer } from "@/utils";

interface ProblemProps {
  id: string;
}

export function ProblemDetailPage({ id }: ProblemProps) {
  const stateProblem = useState<ProblemType>(
    PROBLEM_BLANK as unknown as ProblemType
  );
  const [problem, setProblem] = stateProblem;
  const stateAccept = useState<unknown>({
    content: "",
  });
  const [accept, setAccept] = stateAccept;
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
      <ProblemDetailMain
        stateProblem={stateProblem}
        stateAccept={stateAccept}
        stateMode={stateMode}
      />
    ) : (
      <ProblemCreateEditor
        headElement={renderEditHeader}
        stateProblem={stateProblem}
        purpose="edit"
        handleUpdateProblem={(data) => {
          setMode("view");
          setProblem((prev) => ({
            ...prev,
            ...data,
          }));
          console.log("UP");
          console.log(data.type);
          console.log(data.answer);
          console.log();
          setAccept(parseAnswer(data.type, data.answer));
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
    stateAccept,
    stateMode,
    renderEditHeader,
    setMode,
    setProblem,
    setAccept,
  ]);

  const handleGetProblems = useCallback(async () => {
    if (!loading) return;

    setLoading(true);

    await crudData("get_problem", {
      id,
    }).then((result) => {
      if (result) {
        setProblem(result as ProblemType);
        setAccept(parseAnswer(result.type, result.answer));
        setLoading(false);
      }
    });
  }, [id, loading, setAccept, setProblem]);

  useEffect(() => {
    handleGetProblems();
  }, [handleGetProblems]);

  return <PageTemplate className="w-full">{renderQuestion}</PageTemplate>;
}
