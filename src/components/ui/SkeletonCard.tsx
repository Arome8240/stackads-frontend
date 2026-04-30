import Skeleton from "./Skeleton";

export default function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-5 border border-white/8">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>
      <Skeleton className="w-24 h-7 mb-2" />
      <Skeleton className="w-32 h-4" />
    </div>
  );
}
