import type { Metadata } from "next";
import { BarChart3, Clock, Flame, ListChecks, Zap } from "lucide-react";

import { RecentResults, StatCard } from "@/components/dashboard";
import { PremiumGate } from "@/components/pricing";
import { StatTrendCard } from "@/components/statistics";
import { getCurrentProfile } from "@/lib/auth";
import {
  getProfileTestStats,
  getTotalLearningSeconds,
  listRecentResults,
} from "@/lib/repositories";
import { createClient } from "@/lib/supabase/server";
import {
  formatDays,
  formatLearningTime,
  formatNumber,
  formatPercent,
} from "@/lib/utils";

export const metadata: Metadata = {
  title: "Статистика",
};

const TREND_SESSIONS = 12;

export default async function StatisticsPage() {
  const supabase = createClient();
  const profile = await getCurrentProfile();

  const [testStats, recentResults, learningSeconds] = await Promise.all([
    getProfileTestStats(supabase, profile.id).catch(() => null),
    listRecentResults(supabase, profile.id, TREND_SESSIONS).catch(() => []),
    getTotalLearningSeconds(supabase, profile.id).catch(() => 0),
  ]);

  // Results come back newest-first — reverse for chronological trend charts.
  const chronological = [...recentResults].reverse();
  const xpTrend = chronological.map((r) => r.xpEarned);
  const accuracyTrend = chronological.map((r) => Math.round(r.accuracy * 100));

  const stats = testStats ?? {
    testsCompleted: 0,
    averageAccuracy: profile.accuracy,
    bestStreak: profile.streakDays,
  };

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Статистика
        </h1>
        <p className="mt-1.5 text-muted-foreground">
          Ваш прогресс в подготовке к ЕНТ по географии.
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
          icon={ListChecks}
          label="Пройдено тестов"
          value={String(stats.testsCompleted)}
        />
        <StatCard
          icon={BarChart3}
          label="Средняя точность"
          value={formatPercent(stats.averageAccuracy)}
          accent="warning"
        />
        <StatCard
          icon={Flame}
          label="Лучшая серия"
          value={formatDays(stats.bestStreak)}
          accent="premium"
        />
      </div>

      {profile.isPremium ? (
        <>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              icon={Clock}
              label="Время обучения"
              value={formatLearningTime(learningSeconds)}
              accent="success"
            />
            <div className="sm:col-span-2 lg:col-span-2">
              <StatTrendCard
                title="XP по сессиям"
                meta={`Последние ${xpTrend.length || 0}`}
                data={xpTrend}
                color="primary"
              />
            </div>
          </div>
          <div className="mt-6">
            <StatTrendCard
              title="Точность по сессиям, %"
              meta={`Последние ${accuracyTrend.length || 0}`}
              data={accuracyTrend}
              color="success"
            />
          </div>
        </>
      ) : (
        <div className="mt-6">
          <PremiumGate
            title="Детальная статистика — в Premium"
            description="Время обучения и графики XP/точности по сессиям доступны на платном плане."
          />
        </div>
      )}

      <div className="mt-6">
        {recentResults.length > 0 ? (
          <RecentResults results={recentResults.slice(0, 5)} />
        ) : (
          <div className="rounded-xl border border-border bg-surface-elevated/60 p-8 text-center text-sm text-muted-foreground">
            Пока нет данных — пройдите первый тест, чтобы увидеть статистику.
          </div>
        )}
      </div>
    </div>
  );
}
