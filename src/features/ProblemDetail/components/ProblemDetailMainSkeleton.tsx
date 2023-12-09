import { Card } from "@/components";
import clsx from "clsx";

interface ProblemDetailMainSkeletonProps {
  className?: string;
}

export function ProblemDetailMainSkeleton({
  className,
}: ProblemDetailMainSkeletonProps) {
  return (
    <Card className={clsx(className, "flex flex-col gap-2")}>
      <div className="skeleton w-3/4 h-8"></div>
      <div className="skeleton w-1/4 h-4"></div>
      <div className="skeleton w-1/2 h-8 mt-8"></div>
      <div className="skeleton w-full h-4"></div>
      <div className="skeleton w-full h-4"></div>
      <div className="skeleton w-1/2 h-8 mt-8"></div>
      <div className="skeleton w-full h-4"></div>
      <div className="skeleton w-full h-4"></div>
    </Card>
  );
}
