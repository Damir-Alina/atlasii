"use client";

import { ChevronLeft, Timer } from "lucide-react";

import { Button, Progress } from "@/components/ui";
import { formatDuration } from "@/lib/utils";
import { useLearningStore } from "@/store";

export function SessionHeader({ onExit }: { onExit: () => void }) {
  const currentIndex = useLearningStore((s) => s.currentIndex);
  const queueLength = useLearningStore((s) => s.queue.length);
  const timeLeft = useLearningStore((s) => s.timeLeft);

  const percent = ((currentIndex + 1) / Math.max(queueLength, 1)) * 100;
  const isUrgent = timeLeft <= 5;

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={onExit}
        aria-label="Назад"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Вопрос {Math.min(currentIndex + 1, queueLength)} из {queueLength}
          </span>
          <span
            className={
              isUrgent
                ? "flex items-center gap-1.5 font-mono font-semibold text-destructive"
                : "flex items-center gap-1.5 font-mono"
            }
          >
            <Timer className="h-3.5 w-3.5" />
            {formatDuration(timeLeft)}
          </span>
        </div>
        <Progress value={percent} max={100} size="sm" />
      </div>

      <Button variant="secondary" size="sm" onClick={onExit}>
        Завершить
      </Button>
    </div>
  );
}
