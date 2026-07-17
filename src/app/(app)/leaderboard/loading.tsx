import { Skeleton } from "@/components/ui";

export default function LeaderboardLoading() {
  return (
    <div className="container max-w-4xl py-8">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="mt-3 h-4 w-64" />

      <div className="mt-6 flex flex-col gap-2.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
