"use client";

import { Flame, Menu, Zap } from "lucide-react";

import { Avatar } from "@/components/ui";
import { formatNumber } from "@/lib/utils";
import { useUIStore } from "@/store";
import type { Profile } from "@/types";

export function AppHeader({
  profile,
  title,
}: {
  profile: Profile;
  title?: string;
}) {
  const toggleMobileSidebar = useUIStore((state) => state.toggleMobileSidebar);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleMobileSidebar}
          aria-label="Открыть меню"
          className="rounded-md p-2 text-foreground lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        {title && (
          <h1 className="font-display text-lg font-semibold tracking-tight">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
          <Zap className="h-4 w-4 text-primary" />
          <span className="font-mono tabular-nums text-foreground">
            {formatNumber(profile.xp)}
          </span>
        </div>
        <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
          <Flame className="h-4 w-4 text-warning" />
          <span className="font-mono tabular-nums text-foreground">
            {profile.streakDays}
          </span>
        </div>
        <Avatar name={profile.fullName} src={profile.avatarUrl} size="sm" ring />
      </div>
    </header>
  );
}
