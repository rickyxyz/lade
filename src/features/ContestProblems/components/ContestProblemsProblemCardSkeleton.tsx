import clsx from "clsx";
import { Card } from "@/components";

interface ContestDetailMainSkeletonProps {
  className?: string;
}

export function ContestDetailMainSkeleton({
  className,
}: ContestDetailMainSkeletonProps) {
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
