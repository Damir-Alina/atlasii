import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminProfile } from "@/lib/auth";
import {
  adminCreateCategory,
  adminDeleteCategory,
  adminUpdateCategory,
} from "@/lib/repositories";
import { createClient } from "@/lib/supabase/server";

const createSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  icon: z.string().min(1),
});

export async function POST(request: Request) {
  const admin = await requireAdminProfile();
  if (!admin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const supabase = createClient();
  const category = await adminCreateCategory(supabase, parsed.data);
  if (!category) {
    return NextResponse.json({ error: "create_failed" }, { status: 500 });
  }
  return NextResponse.json({ category });
}

const updateSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  icon: z.string().min(1).optional(),
});

export async function PATCH(request: Request) {
  const admin = await requireAdminProfile();
  if (!admin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { id, ...patch } = parsed.data;
  const supabase = createClient();
  const ok = await adminUpdateCategory(supabase, id, patch);
  return NextResponse.json({ ok });
}

export async function DELETE(request: Request) {
  const admin = await requireAdminProfile();
  if (!admin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });

  const supabase = createClient();
  const ok = await adminDeleteCategory(supabase, id);
  return NextResponse.json({ ok });
}
