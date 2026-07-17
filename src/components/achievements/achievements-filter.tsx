"use client";

import { useMemo, useState } from "react";

import { AchievementsGrid } from "@/components/profile";
import { Tabs } from "@/components/ui";
import type { Achievement } from "@/types";

type Filter = "all" | "unlocked" | "locked";

const FILTER_TABS = [
  { value: "all", label: "Все" },
  { value: "unlocked", label: "Открытые" },
  { value: "locked", label: "Заблокированные" },
];

export function AchievementsFilter({
  achievements,
}: {
  achievements: Achievement[];
}) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "unlocked") return achievements.filter((a) => a.unlocked);
    if (filter === "locked") return achievements.filter((a) => !a.unlocked);
    return achievements;
  }, [achievements, filter]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Открыто {unlockedCount} из {achievements.length}
        </p>
        <Tabs
          items={FILTER_TABS}
          value={filter}
          onChange={(value) => setFilter(value as Filter)}
        />
      </div>

      <AchievementsGrid achievements={filtered} />
    </div>
  );
}
