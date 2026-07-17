import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

/**
 * Service-role client for privileged server-only operations (currently:
 * deleting a user's auth account). Uses SUPABASE_SERVICE_ROLE_KEY, which
 * has no NEXT_PUBLIC_ prefix and is therefore never bundled into client
 * JavaScript — only import this from Route Handlers / Server Actions.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
