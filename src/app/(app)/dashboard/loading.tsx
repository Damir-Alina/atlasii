import { Skeleton } from "@/components/ui";

export default function DashboardLoading() {
  return (
    <div className="container max-w-6xl py-8">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="mt-3 h-4 w-80" />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  );
}
