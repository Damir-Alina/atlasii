import type { SupabaseClient } from "@supabase/supabase-js";

import { XP_REWARDS, xpRequiredForLevel } from "@/lib/constants";
import type { Database } from "@/types/database";
import type { Profile, ProfileTestStats } from "@/types";

import { countCompletedSessions } from "./results-repository";

type Client = SupabaseClient<Database>;
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

function mapProfileRow(row: ProfileRow): Profile {
  return {
    id: row.id,
    fullName: row.full_name,
    email: "", // profiles has no email column — callers overlay it from auth.getUser()
    avatarUrl: row.avatar_url,
    level: row.level,
    xp: row.xp,
    xpToNextLevel: row.xp_to_next_level,
    accuracy: row.total_answered > 0 ? row.total_correct / row.total_answered : 0,
    streakDays: row.streak_days,
    isPremium: row.is_premium,
    role: row.role,
  };
}

/** Returns null if the row doesn't exist yet (e.g. migrations not applied, or the new-user trigger hasn't run). */
export async function getProfile(
  supabase: Client,
  userId: string,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return mapProfileRow(data);
}

export async function updateProfileName(
  supabase: Client,
  userId: string,
  fullName: string,
): Promise<void> {
  await supabase.from("profiles").update({ full_name: fullName }).eq("id", userId);
}

/** Links a Stripe customer to a profile — called from the checkout route once a session is created. */
export async function setStripeCustomerId(
  supabase: Client,
  userId: string,
  stripeCustomerId: string,
): Promise<void> {
  await supabase
    .from("profiles")
    .update({ stripe_customer_id: stripeCustomerId })
    .eq("id", userId);
}

/** Applies a subscription's status to the profile — called from the Stripe webhook route. */
export async function setSubscriptionStatus(
  supabase: Client,
  stripeCustomerId: string,
  { isPremium, subscriptionId }: { isPremium: boolean; subscriptionId: string | null },
): Promise<void> {
  await supabase
    .from("profiles")
    .update({
      is_premium: isPremium,
      stripe_subscription_id: subscriptionId,
    })
    .eq("stripe_customer_id", stripeCustomerId);
}

function isSameDay(a: Date, b: Date): boolean {
  return a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10);
}

function isYesterday(previous: Date, today: Date): boolean {
  const diffMs = today.getTime() - previous.getTime();
  const oneDayMs = 24 * 60 * 60 * 1000;
  return diffMs > 0 && diffMs <= oneDayMs * 1.5; // small grace window
}

/**
 * Applies the outcome of a finished learning session to a profile: XP with
 * level-up rollover, running accuracy, and the daily streak counter.
 * Called once per session from the results API route (Stage 9's
 * server-side counterpart to the client-only XP math in use-learning-store).
 */
export async function applySessionToProfile(
  supabase: Client,
  userId: string,
  session: { xpEarned: number; correctCount: number; totalCount: number },
): Promise<{ profile: Profile; totalXp: number } | null> {
  const current = await getProfile(supabase, userId);
  if (!current) return null;

  const today = new Date();
  const { data: row } = await supabase
    .from("profiles")
    .select("last_active_date, streak_days, best_streak_days, total_correct, total_answered, total_xp")
    .eq("id", userId)
    .single();

  let streakDays = row?.streak_days ?? current.streakDays;
  const lastActive = row?.last_active_date ? new Date(row.last_active_date) : null;
  const alreadyActiveToday = Boolean(lastActive && isSameDay(lastActive, today));

  if (!alreadyActiveToday) {
    streakDays = lastActive && isYesterday(lastActive, today) ? streakDays + 1 : 1;
  }

  // First session of a new day (streak just moved) earns a small bonus on
  // top of the session's own XP — never for a second session on the same day.
  const streakBonus = !alreadyActiveToday ? XP_REWARDS.dailyStreakBonus : 0;
  const totalXpEarned = session.xpEarned + streakBonus;

  let level = current.level;
  let xp = current.xp + totalXpEarned;
  let xpToNextLevel = current.xpToNextLevel;

  while (xp >= xpToNextLevel) {
    xp -= xpToNextLevel;
    level += 1;
    xpToNextLevel = xpRequiredForLevel(level + 1);
  }

  const bestStreakDays = Math.max(row?.best_streak_days ?? 0, streakDays);

  const totalCorrect = (row?.total_correct ?? 0) + session.correctCount;
  const totalAnswered = (row?.total_answered ?? 0) + session.totalCount;
  const totalXp = (row?.total_xp ?? 0) + totalXpEarned;

  const { data: updated, error } = await supabase
    .from("profiles")
    .update({
      xp,
      level,
      xp_to_next_level: xpToNextLevel,
      total_xp: totalXp,
      total_correct: totalCorrect,
      total_answered: totalAnswered,
      streak_days: streakDays,
      best_streak_days: bestStreakDays,
      last_active_date: today.toISOString().slice(0, 10),
    })
    .eq("id", userId)
    .select("*")
    .single();

  if (error || !updated) return null;
  return { profile: mapProfileRow(updated), totalXp: updated.total_xp };
}

/** Composed stats for the Profile page — combines the profiles row with a count from results. */
export async function getProfileTestStats(
  supabase: Client,
  userId: string,
): Promise<ProfileTestStats | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("total_correct, total_answered, best_streak_days")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  const count = await countCompletedSessions(supabase, userId);

  return {
    testsCompleted: count,
    averageAccuracy:
      data.total_answered > 0 ? data.total_correct / data.total_answered : 0,
    bestStreak: data.best_streak_days,
  };
}
