import type { Metadata } from "next";

import { AchievementsFilter } from "@/components/achievements";
import { getCurrentProfile } from "@/lib/auth";
import { getMockAllAchievements } from "@/lib/mock/profile";
import { listAchievementsWithProgress } from "@/lib/repositories";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Достижения",
};

export default async function AchievementsPage() {
  const supabase = createClient();
  const profile = await getCurrentProfile();

  const achievements = await listAchievementsWithProgress(
    supabase,
    profile.id,
  ).catch(() => null);

  return (
    <div className="container max-w-5xl py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Достижения
        </h1>
        <p className="mt-1.5 text-muted-foreground">
          Открывайте награды за скорость, точность и упорство в обучении.
        </p>
      </div>

      <AchievementsFilter achievements={achievements ?? getMockAllAchievements()} />
    </div>
  );
}
