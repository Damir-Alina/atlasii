import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const VARIANT_CLASSES = {
  default: "bg-surface-overlay text-foreground border-border-strong",
  primary: "bg-primary-muted text-primary border-primary/30",
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  destructive: "bg-destructive/15 text-destructive border-destructive/30",
  premium: "bg-premium/15 text-premium border-premium/30",
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof VARIANT_CLASSES;
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    />
  );
}
