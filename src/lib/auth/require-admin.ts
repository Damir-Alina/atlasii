import type { Profile } from "@/types";

import { getCurrentProfile } from "./get-current-profile";

/** Returns the signed-in profile only if it has the admin role, otherwise null. */
export async function requireAdminProfile(): Promise<Profile | null> {
  const profile = await getCurrentProfile();
  return profile.role === "admin" ? profile : null;
}
