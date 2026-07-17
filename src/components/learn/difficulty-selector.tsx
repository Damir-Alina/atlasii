"use client";

import { cn } from "@/lib/utils";
import { DIFFICULTIES, type DifficultyId } from "@/lib/learning";

export function DifficultySelector({
  value,
  onChange,
}: {
  value: DifficultyId;
  onChange: (value: DifficultyId) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium">Сложность</p>
      <div className="grid grid-cols-3 gap-2">
        {DIFFICULTIES.map((difficulty) => {
          const isActive = difficulty.id === value;
          return (
            <button
              key={difficulty.id}
              type="button"
              onClick={() => onChange(difficulty.id)}
              className={cn(
                "rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary/50 bg-primary-muted text-primary"
                  : "border-border bg-surface text-muted-foreground hover:bg-surface-elevated hover:text-foreground",
              )}
            >
              {difficulty.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
