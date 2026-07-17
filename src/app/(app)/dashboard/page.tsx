import type { Metadata } from "next";
import { BarChart3, Flame, Target, Zap } from "lucide-react";

import {
  AchievementsPreview,
  ContinueLearningCard,
  RecentResults,
  StatCard,
} from "@/components/dashboard";
import { getCurrentProfile } from "@/lib/auth";
import { getMockContinueLearning, getMockRecentAchievements } from "@/lib/mock/dashboard";
import { listAchievementsWithProgress, listRecentResults } from "@/lib/repositories";
import { createClient } from "@/lib/supabase/server";
import { formatDays, formatNumber, formatPercent } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Главная",
};

/**
 * Profile is real (Stage 9, with graceful mock fallback baked into
 * getCurrentProfile). Recent results and achievements are also read from
 * Supabase now — each independently falls back to mock data only if the
 * query itself errors (e.g. migrations not applied yet), so a genuinely
 * empty result for a real new user still renders as a real empty state.
 * "Continue learning" progress-per-category isn't tracked yet (that's
 * Stage 11 territory), so it stays mock for now.
 */
export default async function DashboardPage() {
  const supabase = createClient();
  const profile = await getCurrentProfile();
  const continueLearning = getMockContinueLearning();

  const [recentResults, recentAchievements] = await Promise.all([
    listRecentResults(supabase, profile.id, 3).catch(() => null),
    listAchievementsWithProgress(supabase, profile.id).catch(() => null),
  ]);

  const results = recentResults ?? [];
  const achievements = (
    recentAchievements ?? getMockRecentAchievements()
  ).filter((a) => a.unlocked).slice(0, 3);

  const firstName = profile.fullName.split(" ")[0];

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Привет, {firstName}! 👋
        </h1>
        <p className="mt-1.5 text-muted-foreground">
          Продолжай учиться и достигай новых высот!
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Zap}
          label="Уровень"
          value={String(profile.level)}
          meta={`${formatNumber(profile.xp)} / ${formatNumber(profile.xpToNextLevel)} XP`}
          progress={{ value: profile.xp, max: profile.xpToNextLevel }}
        />
        <StatCard
          icon={Target}
          label="Очки"
          value={formatNumber(profile.xp)}
          accent="success"
        />
        <StatCard
          icon={BarChart3}
          label="Точность"
          value={formatPercent(profile.accuracy)}
          accent="warning"
        />
        <StatCard
          icon={Flame}
          label="Серия"
          value={formatDays(profile.streakDays)}
          meta="Дней подряд"
          accent="premium"
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <ContinueLearningCard
          category={continueLearning.category}
          progressPercent={continueLearning.progressPercent}
        />
        <AchievementsPreview achievements={achievements} />
      </div>

      <div className="mt-6">
        {results.length > 0 ? (
          <RecentResults results={results} />
        ) : (
          <div className="rounded-xl border border-border bg-surface-elevated/60 p-8 text-center text-sm text-muted-foreground">
            Вы ещё не проходили тесты. Начните обучение, чтобы увидеть здесь
            свои результаты.
          </div>
        )}
      </div>
    </div>
  );
}
