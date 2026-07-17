import { Award, ChevronRight, Compass, Flame, Trophy, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { ROUTES } from "@/lib/constants";
import type { Achievement } from "@/types";

const ICONS: Record<string, LucideIcon> = {
  compass: Compass,
  award: Award,
  flame: Flame,
  trophy: Trophy,
  zap: Zap,
};

export function AchievementsPreview({
  achievements,
}: {
  achievements: Achievement[];
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Последние достижения</CardTitle>
        <Link
          href={ROUTES.achievements}
          className="flex items-center text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Все
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 pt-4">
        {achievements.map((achievement) => {
          const Icon = ICONS[achievement.icon] ?? Trophy;
          return (
            <div
              key={achievement.id}
              className="flex items-center gap-3 rounded-lg border border-border/60 bg-surface/60 px-3.5 py-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-premium/15 text-premium">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {achievement.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {achievement.description}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
