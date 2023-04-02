import { Card, PageGenericTemplate, ProblemCard } from "@/components";
import { useMemo } from "react";
import { ProblemType } from "@/types";

const PROBLEM_SAMPLE: ProblemType = {
  id: "test1",
  statement: `Suppose there is a carton paper with the dimensions $24 \\text{ m} \\times 9 \\text{ m}$, and an
	open box will be made out of it. Calculate the dimensions of the box
	such that the volume is at its maximum, and the volume.`,
  title: "Maximum Volume of Box",
  topics: ["Calculus", "Applications of Derivative"],
};

const PROBLEM_SAMPLE_2: ProblemType = {
  id: "test2",
  statement: `Suppose there is a carton paper with the dimensions 24 m x 9 m, and an
	open box will be made out of it. Calculate the dimensions of the box
	such that the volume is at its maximum, and the volume.`,
  title: "Maximum Volume of Box",
  topics: ["Calculus", "Applications of Derivative"],
};

export default function Home() {
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
        <ProblemCard problem={PROBLEM_SAMPLE} />
        <ProblemCard problem={PROBLEM_SAMPLE_2} />
        <ProblemCard problem={PROBLEM_SAMPLE} />
        <ProblemCard problem={PROBLEM_SAMPLE_2} />
        <ProblemCard problem={PROBLEM_SAMPLE} />
        <ProblemCard problem={PROBLEM_SAMPLE_2} />
      </div>
    ),
    []
  );

  return (
    <PageGenericTemplate header={renderHeader}>
      {renderProblems}
    </PageGenericTemplate>
  );
}
