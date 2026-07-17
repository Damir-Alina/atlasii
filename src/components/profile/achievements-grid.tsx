import {
  Award,
  BookOpen,
  Compass,
  Flame,
  Lock,
  Map,
  Moon,
  Target,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, Progress } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Achievement } from "@/types";

const ICONS: Record<string, LucideIcon> = {
  compass: Compass,
  award: Award,
  flame: Flame,
  zap: Zap,
  map: Map,
  "book-open": BookOpen,
  target: Target,
  moon: Moon,
};

export function AchievementsGrid({
  achievements,
}: {
  achievements: Achievement[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Достижения</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-3 lg:grid-cols-4">
        {achievements.map((achievement) => {
          const Icon = ICONS[achievement.icon] ?? Award;
          return (
            <div
              key={achievement.id}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-4 text-center",
                achievement.unlocked
                  ? "border-premium/30 bg-premium/10"
                  : "border-border/60 bg-surface/60",
              )}
            >
              <span
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full",
                  achievement.unlocked
                    ? "bg-premium/20 text-premium"
                    : "bg-surface-overlay text-muted-foreground",
                )}
              >
                {achievement.unlocked ? (
                  <Icon className="h-5 w-5" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
              </span>
              <p className="text-xs font-medium leading-tight">
                {achievement.title}
              </p>
              {!achievement.unlocked && (
                <Progress
                  value={achievement.progress}
                  max={achievement.goal}
                  size="sm"
                  className="mt-1"
                />
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
