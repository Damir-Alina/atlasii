import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";
import type { Achievement } from "@/types";

type Client = SupabaseClient<Database>;

interface AchievementRowWithProgress {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  goal: number;
  user_achievements: { progress: number; unlocked: boolean }[] | null;
}

export async function listAchievementsWithProgress(
  supabase: Client,
  userId: string,
): Promise<Achievement[]> {
  const { data, error } = await supabase
    .from("achievements")
    .select("*, user_achievements(progress, unlocked)")
    .eq("user_achievements.user_id", userId)
    .order("goal");

  if (error || !data) return [];

  return (data as unknown as AchievementRowWithProgress[]).map((row) => {
    const progressRow = row.user_achievements?.[0];
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      icon: row.icon,
      unlocked: progressRow?.unlocked ?? false,
      progress: progressRow?.progress ?? 0,
      goal: row.goal,
    };
  });
}

/**
 * Recomputes progress for the achievements we can measure directly from
 * profile stats (lifetime XP, current streak) and upserts any that just
 * crossed their goal. Category-specific achievements ("Знаток областей",
 * "Мастер карты", etc.) need per-category answer counts, which aren't
 * tracked yet — those stay at their seeded zero progress until a future
 * stage adds per-category result tracking.
 */
export async function syncMeasurableAchievements(
  supabase: Client,
  userId: string,
  stats: { totalXp: number; streakDays: number },
): Promise<void> {
  const trackedSlugs: Record<string, number> = {
    "geo-pro": stats.totalXp,
    "streak-7": stats.streakDays,
  };

  const { data: achievements } = await supabase
    .from("achievements")
    .select("id, slug, goal")
    .in("slug", Object.keys(trackedSlugs));

  if (!achievements) return;

  await Promise.all(
    achievements.map((achievement) => {
      const progress = trackedSlugs[achievement.slug] ?? 0;
      const unlocked = progress >= achievement.goal;

      return supabase.from("user_achievements").upsert(
        {
          user_id: userId,
          achievement_id: achievement.id,
          progress: Math.min(progress, achievement.goal),
          unlocked,
          unlocked_at: unlocked ? new Date().toISOString() : null,
        },
        { onConflict: "user_id,achievement_id" },
      );
    }),
  );
}
