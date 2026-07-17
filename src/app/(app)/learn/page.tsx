import type { Metadata } from "next";

import { LearnSession } from "@/components/learn";
import { getCurrentProfile } from "@/lib/auth";
import { FREE_DAILY_SESSION_LIMIT } from "@/lib/billing";
import { countSessionsToday } from "@/lib/repositories";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Обучение",
};

export default async function LearnPage() {
  const supabase = createClient();
  const profile = await getCurrentProfile();
  const sessionsToday = await countSessionsToday(supabase, profile.id).catch(
    () => 0,
  );

  return (
    <div className="container max-w-6xl py-8">
      <LearnSession
        isPremium={profile.isPremium}
        dailyLimitReached={
          !profile.isPremium && sessionsToday >= FREE_DAILY_SESSION_LIMIT
        }
      />
    </div>
  );
}
