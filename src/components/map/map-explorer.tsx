"use client";

import { useState } from "react";

import { KazakhstanMap, RegionDetailPanel, RegionSearch } from "@/components/map";
import { KAZAKHSTAN_REGIONS } from "@/lib/map/regions";
import type { MapPoint, Region } from "@/types";

export function MapExplorer() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  function handleSelectPoint(point: MapPoint) {
    const region = KAZAKHSTAN_REGIONS.find((r) => r.id === point.id);
    if (region) setSelectedRegion(region);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <div className="order-2 flex flex-col gap-4 lg:order-1">
        <RegionSearch onSelectRegion={setSelectedRegion} />
        <div className="h-[60vh] overflow-hidden rounded-2xl border border-border shadow-card lg:h-[70vh]">
          <KazakhstanMap
            points={KAZAKHSTAN_REGIONS}
            selectedId={selectedRegion?.id ?? null}
            onSelectPoint={handleSelectPoint}
            className="h-full w-full"
          />
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <RegionDetailPanel
          region={selectedRegion}
          onClose={() => setSelectedRegion(null)}
        />
      </div>
    </div>
  );
}
