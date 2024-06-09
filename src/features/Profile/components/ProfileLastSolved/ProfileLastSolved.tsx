import { Card, Paragraph } from "@/components";
import { ProblemDetailTopics } from "@/features/ProblemDetail";
import { SolvedPublicType, UserType } from "@/types";
import { timeAgo } from "@/utils";
import Link from "next/link";

interface ProfileLastSolvedProps {
  solveds: SolvedPublicType[];
  loading?: boolean;
}

export function ProfileLastSolved({
  solveds,
  loading,
}: ProfileLastSolvedProps) {
  return (
    <Card className="flex-grow flex flex-col gap-4">
      <Paragraph tag="h2" weight="semibold">
        Last Solved
      </Paragraph>
      {loading ? (
        <>
          <div className="skeleton w-1/2 h-4"></div>
          <div className="skeleton w-1/2 h-4"></div>
          <div className="skeleton w-1/2 h-4"></div>
          <div className="skeleton w-1/2 h-4"></div>
        </>
      ) : (
        solveds.map(
          ({ id, problem: { title, topic, subTopic }, createdAt }) => (
            <div className="flex justify-between items-center" key={id}>
              <div>
                <Link href={`/problem/${id}`}>
                  <Paragraph>{title}</Paragraph>
                </Link>
                <ProblemDetailTopics topic={topic} subTopic={subTopic} />
              </div>
              <Paragraph>{timeAgo(new Date(createdAt))}</Paragraph>
            </div>
          )
        )
      )}
    </Card>
  );
}
