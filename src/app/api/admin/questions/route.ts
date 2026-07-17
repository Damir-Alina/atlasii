import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminProfile } from "@/lib/auth";
import {
  adminCreateQuestion,
  adminDeleteQuestion,
  adminListQuestions,
  adminUpdateQuestion,
} from "@/lib/repositories";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const admin = await requireAdminProfile();
  if (!admin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId") ?? undefined;
  const search = searchParams.get("search") ?? "";
  const page = Math.max(0, Number(searchParams.get("page") ?? 0) || 0);

  const supabase = createClient();
  const result = await adminListQuestions(supabase, { categoryId, search, page });
  return NextResponse.json(result);
}

const createSchema = z.object({
  categoryId: z.string().uuid(),
  type: z.string().min(1),
  targetName: z.string().min(1),
  lng: z.number(),
  lat: z.number(),
  fact: z.string().default(""),
});

export async function POST(request: Request) {
  const admin = await requireAdminProfile();
  if (!admin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const supabase = createClient();
  const ok = await adminCreateQuestion(supabase, parsed.data);
  return NextResponse.json({ ok });
}

const updateSchema = z.object({
  id: z.string().uuid(),
  categoryId: z.string().uuid().optional(),
  type: z.string().min(1).optional(),
  targetName: z.string().min(1).optional(),
  lng: z.number().optional(),
  lat: z.number().optional(),
  fact: z.string().optional(),
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
  const ok = await adminUpdateQuestion(supabase, id, patch);
  return NextResponse.json({ ok });
}

export async function DELETE(request: Request) {
  const admin = await requireAdminProfile();
  if (!admin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });

  const supabase = createClient();
  const ok = await adminDeleteQuestion(supabase, id);
  return NextResponse.json({ ok });
}
