import { useMemo, useEffect, useCallback, useState } from "react";
import { crudData, db, populateProblems } from "@/firebase";
import { Card, PageGenericTemplate, ProblemMain } from "@/components";
import { ProblemType } from "@/types";
import { deleteDoc, doc } from "firebase/firestore";

interface ProblemProps {
  id: string;
}

export function Problem({ id }: ProblemProps) {
  const [problem, setProblem] = useState<ProblemType>();
  const [loading, setLoading] = useState(true);

  const renderQuestion = useMemo(
    () => problem && <ProblemMain problem={problem} />,
    [problem]
  );

  const handleGetProblems = useCallback(async () => {
    if (!loading) return;

    setLoading(true);

    await crudData("get_problem", {
      id,
    }).then((result) => {
      if (result) {
        console.log(result);
        setProblem(result);
        setLoading(true);
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
