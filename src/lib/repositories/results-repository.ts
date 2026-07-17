import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";
import type { TestResult } from "@/types";

type Client = SupabaseClient<Database>;

export interface SaveResultInput {
  userId: string;
  categoryId?: string | null;
  categoryName: string;
  accuracy: number;
  xpEarned: number;
  correctCount: number;
  totalCount: number;
  durationSeconds?: number;
}

export async function saveResult(
  supabase: Client,
  input: SaveResultInput,
): Promise<TestResult | null> {
  const { data, error } = await supabase
    .from("results")
    .insert({
      user_id: input.userId,
      category_id: input.categoryId ?? null,
      category_name: input.categoryName,
      accuracy: input.accuracy,
      xp_earned: input.xpEarned,
      correct_count: input.correctCount,
      total_count: input.totalCount,
      duration_seconds: input.durationSeconds ?? 0,
    })
    .select("*")
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    categoryName: data.category_name,
    accuracy: data.accuracy,
    xpEarned: data.xp_earned,
    completedAt: data.completed_at,
    durationSeconds: data.duration_seconds,
  };
}

export async function listRecentResults(
  supabase: Client,
  userId: string,
  limit = 5,
): Promise<TestResult[]> {
  const { data, error } = await supabase
    .from("results")
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    categoryName: row.category_name,
    accuracy: row.accuracy,
    xpEarned: row.xp_earned,
    completedAt: row.completed_at,
    durationSeconds: row.duration_seconds,
  }));
}

export async function countCompletedSessions(
  supabase: Client,
  userId: string,
): Promise<number> {
  const { count, error } = await supabase
    .from("results")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error || count === null) return 0;
  return count;
}

/** Sum of every session's duration, in seconds — used for the "learning time" stat. */
export async function getTotalLearningSeconds(
  supabase: Client,
  userId: string,
): Promise<number> {
  const { data, error } = await supabase
    .from("results")
    .select("duration_seconds")
    .eq("user_id", userId);

  if (error || !data) return 0;
  return data.reduce((sum, row) => sum + row.duration_seconds, 0);
}

/** How many sessions this user has completed since local midnight — powers the free-tier daily cap. */
export async function countSessionsToday(
  supabase: Client,
  userId: string,
): Promise<number> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from("results")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("completed_at", startOfDay.toISOString());

  if (error || count === null) return 0;
  return count;
}
