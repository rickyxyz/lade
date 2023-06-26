/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect, useCallback, useState } from "react";
import { crudData } from "@/firebase";
import {
  GenericPageTemplate,
  ProblemMain,
  ProblemMainSkeleton,
} from "@/components";
import { ProblemType } from "@/types";
import { ProblemEdit } from "@/components/Problem/Editor";
import { deconstructAnswerString } from "@/utils";

interface ProblemProps {
  id: string;
}

export function Problem({ id }: ProblemProps) {
  const stateProblem = useState<ProblemType>();
  const [problem, setProblem] = stateProblem;
  const [loading, setLoading] = useState(true);
  const stateMode = useState<"view" | "edit">("view");
  const [mode, setMode] = stateMode;

  const renderEditHeader = useMemo(
    () => <h1 className="mb-8">Edit Problem</h1>,
    []
  );

  const renderQuestion = useMemo(() => {
    if (loading || !problem) return <ProblemMainSkeleton />;

    return mode === "view" ? (
      <ProblemMain problem={problem} stateMode={stateMode} />
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

  return <GenericPageTemplate>{renderQuestion}</GenericPageTemplate>;
}

export async function getServerSideProps({ params }: { params: ProblemProps }) {
  const { id } = params;

  return { props: { id } };
}

export default Problem;
