import { NextResponse } from "next/server";

import {
  getAccuracyLeaderboard,
  getGlobalLeaderboard,
  getPeriodLeaderboard,
  getStreakLeaderboard,
  searchLeaderboard,
} from "@/lib/repositories";
import { createClient } from "@/lib/supabase/server";

const METRICS = ["global", "weekly", "monthly", "accuracy", "streak"] as const;
type Metric = (typeof METRICS)[number];

function isMetric(value: string | null): value is Metric {
  return METRICS.includes(value as Metric);
}

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q")?.trim();
  if (query) {
    const entries = await searchLeaderboard(supabase, query);
    return NextResponse.json({ entries, totalCount: entries.length });
  }

  const metricParam = searchParams.get("metric");
  const metric: Metric = isMetric(metricParam) ? metricParam : "global";
  const page = Math.max(0, Number(searchParams.get("page") ?? 0) || 0);

  const pageData = await (async () => {
    switch (metric) {
      case "weekly":
        return getPeriodLeaderboard(supabase, 7, page);
      case "monthly":
        return getPeriodLeaderboard(supabase, 30, page);
      case "accuracy":
        return getAccuracyLeaderboard(supabase, page);
      case "streak":
        return getStreakLeaderboard(supabase, page);
      case "global":
      default:
        return getGlobalLeaderboard(supabase, page);
    }
  })();

  return NextResponse.json(pageData);
}
