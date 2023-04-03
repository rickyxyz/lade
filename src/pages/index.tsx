import { useMemo, useEffect, useCallback, useState } from "react";
import { crudData, populateProblems } from "@/firebase";
import { Card, PageGenericTemplate, ProblemCard } from "@/components";
import { ProblemType } from "@/types";

export default function Home() {
  const [problems, setProblems] = useState<ProblemType[]>([]);
  const [loading, setLoading] = useState(true);

  const renderHeader = useMemo(
    () => (
      <Card>
        <h1>Problems</h1>
      </Card>
    ),
    []
  );

  const renderProblems = useMemo(
    () => (
      <div className="mt-8 flex flex-col gap-8">
        {problems.map((problem) => (
          <ProblemCard key={problem.id} problem={problem} />
        ))}
      </div>
    ),
    [problems]
  );

  const handleGetProblems = useCallback(async () => {
    if (!loading) return;

    setLoading(true);

    await crudData("get_problems", {}).then((results) => {
      if (results) {
        setProblems(results);
        setLoading(true);
      }
    });
  }, [loading]);

  useEffect(() => {
    handleGetProblems();
  }, [handleGetProblems]);

  return (
    <PageGenericTemplate header={renderHeader}>
      {renderProblems}
    </PageGenericTemplate>
  );
}
