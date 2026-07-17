"use client";

import { motion } from "framer-motion";
import { Medal } from "lucide-react";

import { Avatar } from "@/components/ui";
import { cn, formatNumber } from "@/lib/utils";
import type { LeaderboardEntry } from "@/lib/repositories";

const MEDAL_COLORS = ["text-warning", "text-muted-foreground", "text-premium"];

export function PlayerRow({
  entry,
  unit,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  unit: string;
  isCurrentUser: boolean;
}) {
  const medalColor = entry.rank <= 3 ? MEDAL_COLORS[entry.rank - 1] : null;

  return (
    <motion.div
      layout
      layoutId={entry.userId}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-center gap-4 rounded-xl border px-4 py-3",
        isCurrentUser
          ? "border-primary/40 bg-primary-muted/40"
          : "border-border/60 bg-surface/60",
      )}
    >
      <div className="flex w-8 shrink-0 items-center justify-center">
        {medalColor ? (
          <Medal className={cn("h-5 w-5", medalColor)} />
        ) : (
          <span className="font-mono text-sm text-muted-foreground">
            {entry.rank}
          </span>
        )}
      </div>

      <Avatar name={entry.fullName} src={entry.avatarUrl} size="sm" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {entry.fullName}
          {isCurrentUser && (
            <span className="ml-2 text-xs text-primary">Вы</span>
          )}
        </p>
      </div>

      <p className="font-mono text-sm font-semibold tabular-nums text-foreground">
        {formatNumber(entry.value)} {unit}
      </p>
    </motion.div>
  );
}
