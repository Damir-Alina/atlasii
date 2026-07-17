import type { User } from "@supabase/supabase-js";

import { getMockProfile } from "@/lib/mock/dashboard";
import { getProfile } from "@/lib/repositories";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";

/**
 * Resolves the signed-in user's Profile for Server Components.
 *
 * Reads the real `profiles` row (Stage 9). If that row doesn't exist yet —
 * migrations not applied, or the new-user trigger hasn't run for an older
 * account — this degrades gracefully to a profile built from the auth user
 * (or full mock data if there's no user at all) instead of crashing the
 * dashboard/profile pages.
 */
export async function getCurrentProfile(): Promise<Profile> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return getMockProfile();

  const dbProfile = await getProfile(supabase, user.id).catch(() => null);
  if (dbProfile) {
    return { ...dbProfile, email: user.email ?? dbProfile.email };
  }

  return buildProfileFromUser(user);
}

/** Fallback used when there's no `profiles` row yet — identity from auth, gamification fields from mock data. */
export function buildProfileFromUser(user: User | null): Profile {
  const mock = getMockProfile();
  if (!user) return mock;

  return {
    ...mock,
    id: user.id,
    email: user.email ?? mock.email,
    fullName:
      (user.user_metadata?.full_name as string | undefined) ?? mock.fullName,
    avatarUrl: (user.user_metadata?.avatar_url as string | undefined) ?? null,
  };
}
