import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  value: number;
}

export interface LeaderboardPage {
  entries: LeaderboardEntry[];
  totalCount: number;
}

const PAGE_SIZE = 10;

function withRanks(
  rows: { userId: string; fullName: string; avatarUrl: string | null; value: number }[],
  offset: number,
): LeaderboardEntry[] {
  return rows.map((row, i) => ({ ...row, rank: offset + i + 1 }));
}

/** Lifetime XP ranking — "Global" / "Top XP". */
export async function getGlobalLeaderboard(
  supabase: Client,
  page = 0,
): Promise<LeaderboardPage> {
  const offset = page * PAGE_SIZE;
  const { data, error, count } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, total_xp", { count: "exact" })
    .order("total_xp", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (error || !data) return { entries: [], totalCount: 0 };

  return {
    entries: withRanks(
      data.map((row) => ({
        userId: row.id,
        fullName: row.full_name,
        avatarUrl: row.avatar_url,
        value: row.total_xp,
      })),
      offset,
    ),
    totalCount: count ?? data.length,
  };
}

/** Rolling-window XP ranking, built from `results` (weekly = 7 days, monthly = 30 days). */
export async function getPeriodLeaderboard(
  supabase: Client,
  daysBack: 7 | 30,
  page = 0,
): Promise<LeaderboardPage> {
  const offset = page * PAGE_SIZE;
  const { data, error } = await supabase.rpc("get_period_leaderboard", {
    days_back: daysBack,
    result_limit: PAGE_SIZE,
    result_offset: offset,
  });

  if (error || !data) return { entries: [], totalCount: 0 };

  return {
    entries: withRanks(
      data.map((row) => ({
        userId: row.user_id,
        fullName: row.full_name,
        avatarUrl: row.avatar_url,
        value: row.period_xp,
      })),
      offset,
    ),
    totalCount: data[0]?.total_count ?? data.length,
  };
}

/** Ranked by lifetime answer accuracy (users with at least one answered question). */
export async function getAccuracyLeaderboard(
  supabase: Client,
  page = 0,
): Promise<LeaderboardPage> {
  const offset = page * PAGE_SIZE;
  const { data, error, count } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, accuracy", { count: "exact" })
    .gt("total_answered", 0)
    .order("accuracy", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (error || !data) return { entries: [], totalCount: 0 };

  return {
    entries: withRanks(
      data.map((row) => ({
        userId: row.id,
        fullName: row.full_name,
        avatarUrl: row.avatar_url,
        value: Math.round(row.accuracy * 100),
      })),
      offset,
    ),
    totalCount: count ?? data.length,
  };
}

/** Ranked by best streak ever recorded. */
export async function getStreakLeaderboard(
  supabase: Client,
  page = 0,
): Promise<LeaderboardPage> {
  const offset = page * PAGE_SIZE;
  const { data, error, count } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, best_streak_days", { count: "exact" })
    .order("best_streak_days", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (error || !data) return { entries: [], totalCount: 0 };

  return {
    entries: withRanks(
      data.map((row) => ({
        userId: row.id,
        fullName: row.full_name,
        avatarUrl: row.avatar_url,
        value: row.best_streak_days,
      })),
      offset,
    ),
    totalCount: count ?? data.length,
  };
}

/** Search by name, ranked by lifetime XP — used by the leaderboard search box. */
export async function searchLeaderboard(
  supabase: Client,
  query: string,
): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, total_xp")
    .ilike("full_name", `%${query}%`)
    .order("total_xp", { ascending: false })
    .limit(PAGE_SIZE);

  if (error || !data) return [];

  return data.map((row, i) => ({
    rank: i + 1,
    userId: row.id,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    value: row.total_xp,
  }));
}

/** 1-based global XP rank for a single user — used to show "your rank" even off-page. */
export async function getUserGlobalRank(
  supabase: Client,
  userId: string,
): Promise<number | null> {
  const { data: self } = await supabase
    .from("profiles")
    .select("total_xp")
    .eq("id", userId)
    .single();

  if (!self) return null;

  const { count, error } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .gt("total_xp", self.total_xp);

  if (error || count === null) return null;
  return count + 1;
}

export const LEADERBOARD_PAGE_SIZE = PAGE_SIZE;
