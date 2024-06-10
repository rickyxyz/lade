export function ProfileLastSolvedSkeletonSingle() {
  return (
    <div className="flex gap-2 items-center">
      <div className="flex flex-grow flex-col gap-2">
        <div className="skeleton w-2/3 h-8"></div>
        <div className="skeleton w-1/2 h-4"></div>
      </div>
      <div className="skeleton w-1/4 h-4"></div>
    </div>
  );
}
