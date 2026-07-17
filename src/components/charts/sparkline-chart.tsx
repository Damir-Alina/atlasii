"use client";

import { motion } from "framer-motion";
import { useId } from "react";

import { buildSparklineAreaPath, buildSparklinePath } from "@/lib/charts/sparkline";
import { cn } from "@/lib/utils";

const COLOR_VARS = {
  primary: "hsl(var(--primary))",
  success: "hsl(var(--success))",
  premium: "hsl(var(--premium))",
} as const;

export interface SparklineChartProps {
  data: number[];
  color?: keyof typeof COLOR_VARS;
  height?: number;
  className?: string;
  /** Optional per-point labels shown as a subtle x-axis (e.g. dates). */
  labels?: string[];
}

export function SparklineChart({
  data,
  color = "primary",
  height = 110,
  className,
  labels,
}: SparklineChartProps) {
  const gradientId = useId();
  const width = 320;
  const strokeColor = COLOR_VARS[color];

  if (data.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center text-sm text-muted-foreground",
          className,
        )}
        style={{ height }}
      >
        Пока нет данных
      </div>
    );
  }

  const linePath = buildSparklinePath(data, width, height);
  const areaPath = buildSparklineAreaPath(data, width, height);

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        style={{ height }}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={areaPath}
          fill={`url(#${gradientId})`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      {labels && (
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          {labels.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>
      )}
    </div>
  );
}
