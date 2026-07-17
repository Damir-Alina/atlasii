import type { Metadata } from "next";
import { BarChart3, ListChecks, MapPin, Users, Zap, Crown } from "lucide-react";

import { StatCard } from "@/components/dashboard";
import { getPlatformAnalytics } from "@/lib/repositories";
import { createClient } from "@/lib/supabase/server";
import { formatNumber, formatPercent } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Аналитика — Админ",
};

export default async function AdminAnalyticsPage() {
  const supabase = createClient();
  const analytics = await getPlatformAnalytics(supabase).catch(() => null);

  if (!analytics) {
    return (
      <div className="rounded-xl border border-border bg-surface-elevated/60 p-8 text-center text-sm text-muted-foreground">
        Не удалось загрузить аналитику — проверьте, что миграции базы данных
        применены.
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard
        icon={Users}
        label="Пользователей"
        value={formatNumber(analytics.totalUsers)}
      />
      <StatCard
        icon={Crown}
        label="Premium пользователей"
        value={formatNumber(analytics.premiumUsers)}
        accent="premium"
      />
      <StatCard
        icon={ListChecks}
        label="Пройдено сессий"
        value={formatNumber(analytics.totalSessions)}
        accent="success"
      />
      <StatCard
        icon={MapPin}
        label="Объектов в базе"
        value={formatNumber(analytics.totalQuestions)}
      />
      <StatCard
        icon={Zap}
        label="Выдано XP (всего)"
        value={formatNumber(analytics.totalXpAwarded)}
        accent="premium"
      />
      <StatCard
        icon={BarChart3}
        label="Средняя точность платформы"
        value={formatPercent(analytics.averageAccuracy)}
        accent="warning"
      />
    </div>
  );
}
