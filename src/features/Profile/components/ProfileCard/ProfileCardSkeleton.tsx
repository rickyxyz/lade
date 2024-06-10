export function ProfileCardSkeleton() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="skeleton w-32 h-32 mb-6"></div>
      <div className="skeleton w-full h-8 mb-4"></div>
      <div className="skeleton w-1/2 h-4"></div>
    </div>
  );
}
