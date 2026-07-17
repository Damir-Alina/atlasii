import { Compass, Landmark, Mountain, Waves, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import type { Category } from "@/types";

const ICONS: Record<string, LucideIcon> = {
  compass: Compass,
  landmark: Landmark,
  waves: Waves,
  "map-pin": MapPin,
  mountain: Mountain,
};

export function FavoriteTopics({ topics }: { topics: Category[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Любимые темы</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2.5 pt-4">
        {topics.map((topic) => {
          const Icon = ICONS[topic.icon] ?? Compass;
          return (
            <span
              key={topic.id}
              className="flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-sm"
            >
              <Icon className="h-3.5 w-3.5 text-primary" />
              {topic.name}
              <span className="text-xs text-muted-foreground">
                {topic.totalQuestions}
              </span>
            </span>
          );
        })}
      </CardContent>
    </Card>
  );
}
