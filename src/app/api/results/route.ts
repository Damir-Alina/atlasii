import { NextResponse } from "next/server";
import { z } from "zod";

import {
  applySessionToProfile,
  saveResult,
  syncMeasurableAchievements,
} from "@/lib/repositories";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  categoryName: z.string().min(1),
  accuracy: z.number().min(0).max(1),
  xpEarned: z.number().int().min(0),
  correctCount: z.number().int().min(0),
  totalCount: z.number().int().min(0),
});

/**
 * Persists one finished learning session (the Stage 7 question engine calls
 * this from the client when a session reaches "finished"). Inserts the
 * result row, rolls the outcome into the profile (XP/level/accuracy/streak),
 * and syncs the two achievements we can measure automatically.
 */
export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_body", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const input = parsed.data;

  const result = await saveResult(supabase, {
    userId: user.id,
    categoryName: input.categoryName,
    accuracy: input.accuracy,
    xpEarned: input.xpEarned,
    correctCount: input.correctCount,
    totalCount: input.totalCount,
  });

  if (!result) {
    return NextResponse.json(
      {
        error: "save_failed",
        message:
          "Could not write to the results table — have the Stage 9 migrations been applied?",
      },
      { status: 500 },
    );
  }

  const updated = await applySessionToProfile(supabase, user.id, {
    xpEarned: input.xpEarned,
    correctCount: input.correctCount,
    totalCount: input.totalCount,
  });

  if (updated) {
    await syncMeasurableAchievements(supabase, user.id, {
      totalXp: updated.totalXp,
      streakDays: updated.profile.streakDays,
    }).catch(() => null);
  }

  return NextResponse.json({ result, profile: updated?.profile ?? null });
}
