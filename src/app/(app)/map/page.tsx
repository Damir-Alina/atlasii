import type { Metadata } from "next";

import { MapExplorer } from "@/components/map";

export const metadata: Metadata = {
  title: "Карта Казахстана",
};

export default function MapPage() {
  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Карта Казахстана
        </h1>
        <p className="mt-1.5 text-muted-foreground">
          Кликните на область, чтобы узнать больше, или найдите её через
          поиск.
        </p>
      </div>

      <MapExplorer />
    </div>
  );
}
