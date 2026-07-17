"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const SIZE_CLASSES = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-3.5",
} as const;

export interface ProgressProps {
  value: number;
  max?: number;
  size?: keyof typeof SIZE_CLASSES;
  variant?: "primary" | "success" | "premium";
  className?: string;
  label?: string;
}

const VARIANT_CLASSES = {
  primary: "bg-primary",
  success: "bg-success",
  premium: "bg-premium",
} as const;

export function Progress({
  value,
  max = 100,
  size = "md",
  variant = "primary",
  className,
  label,
}: ProgressProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <span>{label}</span>
          <span>{Math.round(percent)}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn(
          "w-full overflow-hidden rounded-full bg-surface-overlay",
          SIZE_CLASSES[size],
        )}
      >
        <motion.div
          className={cn("h-full rounded-full", VARIANT_CLASSES[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
