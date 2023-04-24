import { useMemo, useEffect, useCallback, useState } from "react";
import { crudData, db, populateProblems } from "@/firebase";
import {
  Button,
  Card,
  PageGenericTemplate,
  ProblemCard,
  ProblemCardSkeleton,
} from "@/components";
import { ProblemType } from "@/types";
import { deleteDoc, doc } from "firebase/firestore";

export default function Home() {
  const [problems, setProblems] = useState<ProblemType[]>([]);
  const [loading, setLoading] = useState(true);

  const resetDatabase = useCallback(async () => {
    console.log("Reset Database!");

    for (const problem of problems) {
      await deleteDoc(doc(db, "problem", problem.id));
    }

    populateProblems();
  }, [problems]);

  const renderHeader = useMemo(
    () => (
      <Card>
        <h1>Problems</h1>
        <Button onClick={resetDatabase}>
          Populate with Placeholder Questions
        </Button>
      </Card>
    ),
    [resetDatabase]
  );

  const renderProblems = useMemo(
    () =>
      loading ? (
        <ProblemCardSkeleton className="mt-8" />
      ) : (
        <div className="mt-8 flex flex-col gap-8">
          {problems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      ),
    [loading, problems]
  );

  const handleGetProblems = useCallback(async () => {
    if (!loading) return;

    setLoading(true);

    await crudData("get_problems", {}).then((results) => {
      if (results) {
        console.log("Get Problems OK!!");
        setProblems(results);
        setLoading(false);
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
