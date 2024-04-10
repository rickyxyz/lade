"use client";
import { PageTemplate } from "@/templates";
import { ProblemQuery, ProblemType } from "@/types";
import { useCallback } from "react";
import { ProblemCard, ProblemCardSkeleton, ProblemList } from "../components";
import Link from "next/link";

interface ProblemListPageProps {
  query: ProblemQuery;
}

export function ProblemListPage({ query }: ProblemListPageProps) {
  const renderProblems = useCallback(
    (problems: ProblemType[], loading?: boolean) => {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
            <>
              <ProblemCardSkeleton />
              <ProblemCardSkeleton />
              <ProblemCardSkeleton />
              <ProblemCardSkeleton />
            </>
          ) : (
            problems.map((problem) => (
              <ProblemCard key={problem.id} problem={problem as any} isLink />
            ))
          )}
        </div>
      );
    },
    []
  );

  return (
    <PageTemplate title="Problems">
      <ProblemList query={query} renderProblems={renderProblems} />
    </PageTemplate>
  );
}
