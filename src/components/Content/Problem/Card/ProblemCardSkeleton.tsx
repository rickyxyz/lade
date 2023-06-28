import { Card } from "@/components";
import clsx from "clsx";

interface ProblemCardSkeletonProps {
  className?: string;
}

export function ProblemCardSkeleton({ className }: ProblemCardSkeletonProps) {
  return (
    <Card className={clsx(className, "flex flex-col gap-2")}>
      <div className="skeleton w-1/2 h-4"></div>
      <div className="skeleton w-full h-4"></div>
      <div className="skeleton w-full h-4"></div>
      <div className="skeleton w-full h-4"></div>
    </Card>
  );
}
