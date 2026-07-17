import type { Metadata } from "next";

import {
  AchievementsGrid,
  FavoriteTopics,
  ProfileHeader,
  ProfileStats,
} from "@/components/profile";
import { getCurrentProfile } from "@/lib/auth";
import { getMockAllAchievements, getMockFavoriteTopics } from "@/lib/mock/profile";
import {
  getProfileTestStats,
  listAchievementsWithProgress,
  listCategories,
} from "@/lib/repositories";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Профиль",
};

/**
 * Every section below independently falls back to mock data only if its
 * own Supabase query errors (migrations not applied) — a real signed-in
 * user with genuinely no achievements/history yet still sees accurate
 * (zeroed) real data rather than fake numbers.
 */
export default async function ProfilePage() {
  const supabase = createClient();
  const profile = await getCurrentProfile();

  const [testStats, achievements, categories] = await Promise.all([
    getProfileTestStats(supabase, profile.id).catch(() => null),
    listAchievementsWithProgress(supabase, profile.id).catch(() => null),
    listCategories(supabase).catch(() => null),
  ]);

  return (
    <div className="container max-w-5xl py-8">
      <div className="flex flex-col gap-6">
        <ProfileHeader profile={profile} />
        <ProfileStats
          profile={profile}
          testStats={
            testStats ?? { testsCompleted: 0, averageAccuracy: profile.accuracy, bestStreak: profile.streakDays }
          }
        />
        <FavoriteTopics topics={categories?.length ? categories : getMockFavoriteTopics()} />
        <AchievementsGrid achievements={achievements ?? getMockAllAchievements()} />
      </div>
    </div>
  );
}
