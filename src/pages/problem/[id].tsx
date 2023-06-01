/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useEffect, useCallback, useState } from "react";
import { crudData } from "@/firebase";
import {
  PageGenericTemplate,
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
  const [problem, setProblem] = useState<ProblemType>();
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"view" | "edit">("view");

  const renderEditHeader = useMemo(
    () => <h1 className="mb-8">Edit Problem</h1>,
    []
  );

  const renderQuestion = useMemo(() => {
    if (loading || !problem) return <ProblemMainSkeleton />;

    return mode === "view" ? (
      <ProblemMain problem={problem} />
    ) : (
      <ProblemEdit
        headElement={renderEditHeader}
        problem={problem}
        mode="edit"
      />
    );
  }, [problem, loading, mode, renderEditHeader]);

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
  }, [id, loading]);

  useEffect(() => {
    handleGetProblems();
  }, [handleGetProblems]);

  return <PageGenericTemplate>{renderQuestion}</PageGenericTemplate>;
}

export async function getServerSideProps({ params }: { params: ProblemProps }) {
  const { id } = params;

  return { props: { id } };
}

export default Problem;
