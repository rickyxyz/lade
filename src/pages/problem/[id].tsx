import { useMemo, useEffect, useCallback, useState } from "react";
import { crudData } from "@/firebase";
import {
  PageGenericTemplate,
  ProblemMain,
  ProblemMainSkeleton,
} from "@/components";
import { ProblemType } from "@/types";

interface ProblemProps {
  id: string;
}

export function Problem({ id }: ProblemProps) {
  const [problem, setProblem] = useState<ProblemType>();
  const [loading, setLoading] = useState(true);

  const renderQuestion = useMemo(
    () =>
      !loading && problem ? (
        <ProblemMain problem={problem} />
      ) : (
        <ProblemMainSkeleton />
      ),
    [loading, problem]
  );

  const handleGetProblems = useCallback(async () => {
    if (!loading) return;

    setLoading(true);

    await crudData("get_problem", {
      id,
    }).then((result) => {
      if (result) {
        setProblem(result);
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
