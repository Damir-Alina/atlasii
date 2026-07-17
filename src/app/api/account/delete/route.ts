import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.deleteUser(user.id);

  if (error) {
    return NextResponse.json({ error: "delete_failed" }, { status: 500 });
  }

  // The profiles/results/user_achievements rows all cascade-delete via
  // their `references auth.users(id) on delete cascade` foreign keys.
  await supabase.auth.signOut();

  return NextResponse.json({ ok: true });
}
