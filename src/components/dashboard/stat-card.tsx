import type { LucideIcon } from "lucide-react";

import { Card, Progress } from "@/components/ui";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  meta?: string;
  accent?: "primary" | "success" | "warning" | "premium";
  progress?: { value: number; max: number };
}

const ACCENT_CLASSES = {
  primary: "bg-primary-muted text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  premium: "bg-premium/15 text-premium",
} as const;

export function StatCard({
  icon: Icon,
  label,
  value,
  meta,
  accent = "primary",
  progress,
}: StatCardProps) {
  return (
    <Card hoverable className="p-5">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            ACCENT_CLASSES[accent],
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="font-mono text-2xl font-semibold tabular-nums text-foreground">
            {value}
          </p>
        </div>
      </div>

      {progress && (
        <Progress
          value={progress.value}
          max={progress.max}
          size="sm"
          className="mt-4"
        />
      )}

      {meta && !progress && (
        <p className="mt-3 text-xs text-muted-foreground">{meta}</p>
      )}
      {meta && progress && (
        <p className="mt-1.5 text-xs text-muted-foreground">{meta}</p>
      )}
    </Card>
  );
}
