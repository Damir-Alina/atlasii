import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";
import type { Category } from "@/types";

type Client = SupabaseClient<Database>;

const PAGE_SIZE = 15;

// ───────────────────────────── Users ─────────────────────────────

export interface AdminUserRow {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  level: number;
  totalXp: number;
  isPremium: boolean;
  role: "user" | "admin";
}

export async function adminListUsers(
  supabase: Client,
  { search = "", page = 0 }: { search?: string; page?: number } = {},
): Promise<{ users: AdminUserRow[]; totalCount: number }> {
  let query = supabase
    .from("profiles")
    .select("id, full_name, avatar_url, level, total_xp, is_premium, role", {
      count: "exact",
    })
    .order("created_at", { ascending: false });

  if (search.trim()) {
    query = query.ilike("full_name", `%${search.trim()}%`);
  }

  const offset = page * PAGE_SIZE;
  const { data, error, count } = await query.range(
    offset,
    offset + PAGE_SIZE - 1,
  );

  if (error || !data) return { users: [], totalCount: 0 };

  return {
    users: data.map((row) => ({
      id: row.id,
      fullName: row.full_name,
      avatarUrl: row.avatar_url,
      level: row.level,
      totalXp: row.total_xp,
      isPremium: row.is_premium,
      role: row.role,
    })),
    totalCount: count ?? data.length,
  };
}

export async function adminSetUserRole(
  supabase: Client,
  userId: string,
  role: "user" | "admin",
): Promise<boolean> {
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);
  return !error;
}

export async function adminSetUserPremium(
  supabase: Client,
  userId: string,
  isPremium: boolean,
): Promise<boolean> {
  const { error } = await supabase
    .from("profiles")
    .update({ is_premium: isPremium })
    .eq("id", userId);
  return !error;
}

// ─────────────────────────── Categories ───────────────────────────

export interface CategoryInput {
  slug: string;
  name: string;
  icon: string;
}

export async function adminCreateCategory(
  supabase: Client,
  input: CategoryInput,
): Promise<Category | null> {
  const { data, error } = await supabase
    .from("categories")
    .insert({ ...input, total_questions: 0 })
    .select("*")
    .single();

  if (error || !data) return null;
  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    icon: data.icon,
    totalQuestions: data.total_questions,
  };
}

export async function adminUpdateCategory(
  supabase: Client,
  id: string,
  input: Partial<CategoryInput>,
): Promise<boolean> {
  const { error } = await supabase.from("categories").update(input).eq("id", id);
  return !error;
}

export async function adminDeleteCategory(
  supabase: Client,
  id: string,
): Promise<boolean> {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  return !error;
}

// ─────────────────────────── Questions ───────────────────────────

export interface AdminQuestionRow {
  id: string;
  categoryId: string;
  categoryName: string;
  type: string;
  targetName: string;
  lng: number;
  lat: number;
  fact: string | null;
}

export async function adminListQuestions(
  supabase: Client,
  {
    categoryId,
    search = "",
    page = 0,
  }: { categoryId?: string; search?: string; page?: number } = {},
): Promise<{ questions: AdminQuestionRow[]; totalCount: number }> {
  let query = supabase
    .from("questions")
    .select("*, categories!inner(id, name)", { count: "exact" })
    .order("target_name");

  if (categoryId) query = query.eq("category_id", categoryId);
  if (search.trim()) query = query.ilike("target_name", `%${search.trim()}%`);

  const offset = page * PAGE_SIZE;
  const { data, error, count } = await query.range(
    offset,
    offset + PAGE_SIZE - 1,
  );

  if (error || !data) return { questions: [], totalCount: 0 };

  const rows = data as unknown as Array<{
    id: string;
    category_id: string;
    type: string;
    target_name: string;
    lng: number;
    lat: number;
    fact: string | null;
    categories: { id: string; name: string };
  }>;

  return {
    questions: rows.map((row) => ({
      id: row.id,
      categoryId: row.category_id,
      categoryName: row.categories?.name ?? "—",
      type: row.type,
      targetName: row.target_name,
      lng: row.lng,
      lat: row.lat,
      fact: row.fact,
    })),
    totalCount: count ?? rows.length,
  };
}

export interface QuestionInput {
  categoryId: string;
  type: string;
  targetName: string;
  lng: number;
  lat: number;
  fact: string;
}

export async function adminCreateQuestion(
  supabase: Client,
  input: QuestionInput,
): Promise<boolean> {
  const { error } = await supabase.from("questions").insert({
    category_id: input.categoryId,
    type: input.type,
    target_name: input.targetName,
    lng: input.lng,
    lat: input.lat,
    fact: input.fact,
  });
  return !error;
}

export async function adminUpdateQuestion(
  supabase: Client,
  id: string,
  input: Partial<QuestionInput>,
): Promise<boolean> {
  const patch: Database["public"]["Tables"]["questions"]["Update"] = {};
  if (input.categoryId) patch.category_id = input.categoryId;
  if (input.type) patch.type = input.type;
  if (input.targetName) patch.target_name = input.targetName;
  if (input.lng !== undefined) patch.lng = input.lng;
  if (input.lat !== undefined) patch.lat = input.lat;
  if (input.fact !== undefined) patch.fact = input.fact;

  const { error } = await supabase.from("questions").update(patch).eq("id", id);
  return !error;
}

export async function adminDeleteQuestion(
  supabase: Client,
  id: string,
): Promise<boolean> {
  const { error } = await supabase.from("questions").delete().eq("id", id);
  return !error;
}

// ────────────────────────── Achievements ──────────────────────────

export interface AchievementInput {
  slug: string;
  title: string;
  description: string;
  icon: string;
  goal: number;
}

export interface AdminAchievementRow extends AchievementInput {
  id: string;
}

export async function adminListAchievements(
  supabase: Client,
): Promise<AdminAchievementRow[]> {
  const { data, error } = await supabase
    .from("achievements")
    .select("id, slug, title, description, icon, goal")
    .order("goal");

  if (error || !data) return [];
  return data;
}

export async function adminCreateAchievement(
  supabase: Client,
  input: AchievementInput,
): Promise<boolean> {
  const { error } = await supabase.from("achievements").insert(input);
  return !error;
}

export async function adminUpdateAchievement(
  supabase: Client,
  id: string,
  input: Partial<AchievementInput>,
): Promise<boolean> {
  const { error } = await supabase
    .from("achievements")
    .update(input)
    .eq("id", id);
  return !error;
}

export async function adminDeleteAchievement(
  supabase: Client,
  id: string,
): Promise<boolean> {
  const { error } = await supabase.from("achievements").delete().eq("id", id);
  return !error;
}

// ─────────────────────────── Analytics ───────────────────────────

export interface PlatformAnalytics {
  totalUsers: number;
  totalSessions: number;
  totalQuestions: number;
  totalXpAwarded: number;
  averageAccuracy: number;
  premiumUsers: number;
}

export async function getPlatformAnalytics(
  supabase: Client,
): Promise<PlatformAnalytics> {
  const [usersRes, sessionsRes, questionsRes, xpRes, premiumRes] =
    await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("results").select("id", { count: "exact", head: true }),
      supabase.from("questions").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("total_xp, total_correct, total_answered"),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("is_premium", true),
    ]);

  const xpRows = xpRes.data ?? [];
  const totalXpAwarded = xpRows.reduce((sum, r) => sum + r.total_xp, 0);
  const totalCorrect = xpRows.reduce((sum, r) => sum + r.total_correct, 0);
  const totalAnswered = xpRows.reduce((sum, r) => sum + r.total_answered, 0);

  return {
    totalUsers: usersRes.count ?? 0,
    totalSessions: sessionsRes.count ?? 0,
    totalQuestions: questionsRes.count ?? 0,
    totalXpAwarded,
    averageAccuracy: totalAnswered > 0 ? totalCorrect / totalAnswered : 0,
    premiumUsers: premiumRes.count ?? 0,
  };
}

export { PAGE_SIZE as ADMIN_PAGE_SIZE };
