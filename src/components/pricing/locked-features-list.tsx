import { BarChart3, Infinity as InfinityIcon, Lock, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { cn } from "@/lib/utils";

const FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: InfinityIcon,
    title: "Неограниченная практика",
    description: "Без дневного лимита сессий обучения.",
  },
  {
    icon: BarChart3,
    title: "Детальная статистика",
    description: "Графики XP и точности по сессиям, время обучения.",
  },
  {
    icon: Zap,
    title: "Приоритетная поддержка",
    description: "Быстрые ответы на вопросы и запросы.",
  },
];

export function LockedFeaturesList({ isPremiumUser }: { isPremiumUser: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Что открывает Premium</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 pt-4 sm:grid-cols-3">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className={cn(
                "relative flex flex-col gap-2 rounded-xl border p-4",
                isPremiumUser
                  ? "border-premium/30 bg-premium/10"
                  : "border-border/60 bg-surface/60",
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg",
                    isPremiumUser
                      ? "bg-premium/20 text-premium"
                      : "bg-surface-overlay text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                {!isPremiumUser && (
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>
              <p className="text-sm font-medium">{feature.title}</p>
              <p className="text-xs text-muted-foreground">
                {feature.description}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
