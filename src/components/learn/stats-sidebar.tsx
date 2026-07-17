"use client";

import { Card } from "@/components/ui";
import { cn, formatNumber } from "@/lib/utils";
import { useLearningStore } from "@/store";

export function StatsSidebar() {
  const score = useLearningStore((s) => s.score);
  const combo = useLearningStore((s) => s.combo);
  const correctCount = useLearningStore((s) => s.correctCount);
  const totalCount = useLearningStore((s) => s.totalCount);
  const currentIndex = useLearningStore((s) => s.currentIndex);
  const queueLength = useLearningStore((s) => s.queue.length);
  const status = useLearningStore((s) => s.status);
  const lastResult = useLearningStore((s) => s.lastResult);

  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 100;

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-5">
        <p className="text-xs text-muted-foreground">Очки</p>
        <p className="mt-1 font-mono text-3xl font-semibold tabular-nums text-foreground">
          {formatNumber(score)}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">+10 за вопрос</p>
      </Card>

      <Card className="p-5">
        <p className="text-xs text-muted-foreground">Серия</p>
        <p className="mt-1 font-mono text-3xl font-semibold tabular-nums text-foreground">
          {combo}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {combo >= 2 ? `x${(1 + combo * 0.1).toFixed(1)} бонус` : "Отвечайте верно подряд"}
        </p>
      </Card>

      <Card className="p-5">
        <p className="text-xs text-muted-foreground">Точность</p>
        <p className="mt-1 font-mono text-3xl font-semibold tabular-nums text-foreground">
          {accuracy}%
        </p>
      </Card>

      <Card className="p-5">
        <p className="mb-3 text-xs text-muted-foreground">Прогресс</p>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: queueLength }).map((_, index) => {
            const isCurrent = index === currentIndex && status !== "finished";
            const isAnsweredCurrent = isCurrent && status === "answered";
            const isCompleted = index < currentIndex || status === "finished";

            return (
              <span
                key={index}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  isAnsweredCurrent && lastResult === "correct" && "bg-success",
                  isAnsweredCurrent && lastResult === "incorrect" && "bg-destructive",
                  isCurrent && !isAnsweredCurrent && "bg-primary",
                  !isCurrent && isCompleted && "bg-muted-foreground/40",
                  !isCurrent && !isCompleted && "bg-surface-overlay",
                )}
              />
            );
          })}
        </div>
      </Card>
    </div>
  );
}
