import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";
import type { GeoObject, GeoObjectCategory } from "@/types";

type Client = SupabaseClient<Database>;

/**
 * Returns every question row for the given category slugs, shaped exactly
 * like `GeoObject` — the same type the static data in
 * src/lib/map/geo-objects.ts already exposes to the map and question
 * engine. This repository is the DB-backed source of truth going forward;
 * swapping the learning engine over to it is a drop-in change since the
 * consumer-facing type doesn't change.
 */
export async function getQuestionsForCategories(
  supabase: Client,
  categorySlugs: GeoObjectCategory[],
): Promise<GeoObject[]> {
  if (categorySlugs.length === 0) return [];

  const { data, error } = await supabase
    .from("questions")
    .select("id, target_name, lng, lat, fact, categories!inner(slug)")
    .in("categories.slug", categorySlugs);

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.target_name,
    // The inner join guarantees `categories` is present and matches one of
    // the requested slugs, which is exactly the GeoObjectCategory union.
    category: (row as unknown as { categories: { slug: GeoObjectCategory } })
      .categories.slug,
    lng: row.lng,
    lat: row.lat,
    fact: row.fact ?? "",
  }));
}
