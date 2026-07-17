import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminProfile } from "@/lib/auth";
import {
  adminListUsers,
  adminSetUserPremium,
  adminSetUserRole,
} from "@/lib/repositories";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const admin = await requireAdminProfile();
  if (!admin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const page = Math.max(0, Number(searchParams.get("page") ?? 0) || 0);

  const supabase = createClient();
  const result = await adminListUsers(supabase, { search, page });
  return NextResponse.json(result);
}

const patchSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["user", "admin"]).optional(),
  isPremium: z.boolean().optional(),
});

export async function PATCH(request: Request) {
  const admin = await requireAdminProfile();
  if (!admin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const json = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { userId, role, isPremium } = parsed.data;
  const supabase = createClient();

  if (role !== undefined) {
    await adminSetUserRole(supabase, userId, role);
  }
  if (isPremium !== undefined) {
    await adminSetUserPremium(supabase, userId, isPremium);
  }

  return NextResponse.json({ ok: true });
}
