"use client";

import dynamic from "next/dynamic";

import { Spinner } from "@/components/ui";

function MapLoadingSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-surface">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Spinner size="lg" />
        <p className="text-sm">Загрузка карты...</p>
      </div>
    </div>
  );
}

/**
 * maplibre-gl is one of the heaviest dependencies in this project. Loading
 * it via next/dynamic with ssr:false keeps it out of both the server-render
 * pass and the initial JS chunk for every other route — it's only fetched
 * when a map actually mounts (Stage 17 code-splitting).
 */
export const KazakhstanMap = dynamic(
  () => import("./kazakhstan-map").then((mod) => mod.KazakhstanMap),
  { ssr: false, loading: MapLoadingSkeleton },
);
