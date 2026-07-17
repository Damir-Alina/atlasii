import type { SupabaseClient } from "@supabase/supabase-js";

import { DEFAULT_PROFILE_SETTINGS } from "@/lib/constants";
import type { Database } from "@/types/database";
import type { ProfileSettings } from "@/types";

type Client = SupabaseClient<Database>;

function mergeSettings(stored: Record<string, unknown> | null): ProfileSettings {
  const s = (stored ?? {}) as Partial<ProfileSettings>;
  return {
    theme: s.theme ?? DEFAULT_PROFILE_SETTINGS.theme,
    language: s.language ?? DEFAULT_PROFILE_SETTINGS.language,
    notifications: {
      ...DEFAULT_PROFILE_SETTINGS.notifications,
      ...s.notifications,
    },
    privacy: {
      ...DEFAULT_PROFILE_SETTINGS.privacy,
      ...s.privacy,
    },
  };
}

export async function getProfileSettings(
  supabase: Client,
  userId: string,
): Promise<ProfileSettings> {
  const { data, error } = await supabase
    .from("profiles")
    .select("settings")
    .eq("id", userId)
    .single();

  if (error || !data) return DEFAULT_PROFILE_SETTINGS;
  return mergeSettings(data.settings);
}

/** Deep-merges `patch` into the stored settings and writes the full object back. */
export async function updateProfileSettings(
  supabase: Client,
  userId: string,
  patch: Partial<ProfileSettings>,
): Promise<ProfileSettings | null> {
  const current = await getProfileSettings(supabase, userId);

  const next: ProfileSettings = {
    ...current,
    ...patch,
    notifications: { ...current.notifications, ...patch.notifications },
    privacy: { ...current.privacy, ...patch.privacy },
  };

  const { error } = await supabase
    .from("profiles")
    .update({ settings: next })
    .eq("id", userId);

  if (error) return null;
  return next;
}
