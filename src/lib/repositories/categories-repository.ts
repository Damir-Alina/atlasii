import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";
import type { Category } from "@/types";

type Client = SupabaseClient<Database>;

export async function listCategories(supabase: Client): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    icon: row.icon,
    totalQuestions: row.total_questions,
  }));
}
