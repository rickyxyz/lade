import { Card, Paragraph } from "@/components";
import { ProblemDetailTopics } from "@/features/ProblemDetail";
import { SolvedPublicType, UserType } from "@/types";
import { timeAgo } from "@/utils";
import Link from "next/link";
import { ProfileLastSolvedSkeleton } from "./ProfileLastSolvedSkeleton";

interface ProfileLastSolvedProps {
  solveds: SolvedPublicType[];
  loading?: boolean;
}

export function ProfileLastSolved({
  solveds,
  loading,
}: ProfileLastSolvedProps) {
  return (
    <Card className="h-fit flex-grow flex flex-col gap-4">
      {loading ? (
        <ProfileLastSolvedSkeleton />
      ) : (
        <>
          <Paragraph tag="h2" weight="semibold">
            Last Solved
          </Paragraph>
          {solveds.map(
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
          )}
        </>
      )}
    </Card>
  );
}
