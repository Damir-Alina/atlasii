import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { cn, formatNumber, formatPercent, formatShortDateTime } from "@/lib/utils";
import type { TestResult } from "@/types";

function accuracyClass(accuracy: number): string {
  if (accuracy >= 0.9) return "text-success";
  if (accuracy >= 0.7) return "text-warning";
  return "text-destructive";
}

export function RecentResults({ results }: { results: TestResult[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Последние результаты</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="flex flex-col divide-y divide-border/60">
          {results.map((result) => (
            <li
              key={result.id}
              className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  Тест: {result.categoryName}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatShortDateTime(result.completedAt)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <span
                  className={cn(
                    "font-mono text-sm font-semibold tabular-nums",
                    accuracyClass(result.accuracy),
                  )}
                >
                  {formatPercent(result.accuracy)}
                </span>
                <span className="font-mono text-sm tabular-nums text-primary">
                  +{formatNumber(result.xpEarned)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
