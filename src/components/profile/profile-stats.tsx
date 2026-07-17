import { BarChart3, Flame, ListChecks, Zap } from "lucide-react";

import { StatCard } from "@/components/dashboard";
import { formatDays, formatNumber, formatPercent } from "@/lib/utils";
import type { Profile, ProfileTestStats } from "@/types";

export function ProfileStats({
  profile,
  testStats,
}: {
  profile: Profile;
  testStats: ProfileTestStats;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={Zap}
        label="Уровень"
        value={String(profile.level)}
        meta={`${formatNumber(profile.xp)} / ${formatNumber(profile.xpToNextLevel)} XP`}
        progress={{ value: profile.xp, max: profile.xpToNextLevel }}
      />
      <StatCard
        icon={ListChecks}
        label="Пройдено"
        value={String(testStats.testsCompleted)}
        meta="тестов"
      />
      <StatCard
        icon={BarChart3}
        label="Средняя точность"
        value={formatPercent(testStats.averageAccuracy)}
        accent="warning"
      />
      <StatCard
        icon={Flame}
        label="Лучшая серия"
        value={formatDays(testStats.bestStreak)}
        accent="premium"
      />
    </div>
  );
}
