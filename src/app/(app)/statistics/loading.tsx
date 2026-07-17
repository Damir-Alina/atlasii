import { Skeleton } from "@/components/ui";

export default function StatisticsLoading() {
  return (
    <div className="container max-w-6xl py-8">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="mt-3 h-4 w-72" />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>
  );
}
