import { Skeleton } from "@/components/ui";

export default function MapLoading() {
  return (
    <div className="container max-w-6xl py-8">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-3 h-4 w-72" />
      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-11 rounded-lg" />
          <Skeleton className="h-[60vh] rounded-2xl lg:h-[70vh]" />
        </div>
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>
  );
}
