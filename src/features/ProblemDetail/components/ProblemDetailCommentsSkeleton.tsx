import { Card } from "@/components";
import clsx from "clsx";

interface ProblemDetailCommentsSkeletonProps {
  className?: string;
}

export function ProblemDetailCommentsSkeleton({
  className,
}: ProblemDetailCommentsSkeletonProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="skeleton w-1/4 h-4"></div>
      <div className="skeleton w-1/2 h-4"></div>
      <div className="skeleton w-1/2 h-4"></div>
      <div className="skeleton w-1/4 h-4 mt-4"></div>
      <div className="skeleton w-1/2 h-4"></div>
      <div className="skeleton w-1/2 h-4"></div>
      <div className="skeleton w-1/4 h-4 mt-4"></div>
      <div className="skeleton w-1/2 h-4"></div>
      <div className="skeleton w-1/2 h-4"></div>
    </div>
  );
}
