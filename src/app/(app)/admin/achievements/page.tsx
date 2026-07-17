import type { Metadata } from "next";

import { AchievementsManager } from "@/components/admin";
import { adminListAchievements } from "@/lib/repositories";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Достижения — Админ",
};

export default async function AdminAchievementsPage() {
  const supabase = createClient();
  const achievements = await adminListAchievements(supabase).catch(() => []);

  return <AchievementsManager initialAchievements={achievements} />;
}
