import type { Metadata } from "next";

import { LeaderboardExplorer } from "@/components/leaderboard";
import { getCurrentProfile } from "@/lib/auth";
import { getGlobalLeaderboard, getUserGlobalRank } from "@/lib/repositories";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Рейтинг",
};

export default async function LeaderboardPage() {
  const supabase = createClient();
  const profile = await getCurrentProfile();

  const [initial, myRank] = await Promise.all([
    getGlobalLeaderboard(supabase, 0).catch(() => ({
      entries: [],
      totalCount: 0,
    })),
    getUserGlobalRank(supabase, profile.id).catch(() => null),
  ]);

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Рейтинг
          </h1>
          <p className="mt-1.5 text-muted-foreground">
            Сравнивайте свой прогресс с другими учениками AtlasIQ.
          </p>
        </div>
        {myRank && (
          <p className="text-sm text-muted-foreground">
            Ваше место в общем рейтинге:{" "}
            <span className="font-mono font-semibold text-primary">
              #{myRank}
            </span>
          </p>
        )}
      </div>

      <LeaderboardExplorer
        currentUserId={profile.id}
        initialEntries={initial.entries}
        initialTotalCount={initial.totalCount}
      />
    </div>
  );
}
