import { Map } from "lucide-react";
import Link from "next/link";

import { Button, Card, Progress } from "@/components/ui";
import { ROUTES } from "@/lib/constants";
import type { Category } from "@/types";

export function ContinueLearningCard({
  category,
  progressPercent,
}: {
  category: Category;
  progressPercent: number;
}) {
  return (
    <Card className="overflow-hidden p-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Map className="h-4 w-4" />
        Продолжить обучение
      </div>

      <h3 className="mt-3 font-display text-xl font-semibold tracking-tight">
        {category.name}
      </h3>

      <Progress
        value={progressPercent}
        max={100}
        className="mt-5"
        label={`Пройдено ${progressPercent}%`}
      />

      <Link href={ROUTES.learn} className="mt-6 block">
        <Button className="w-full sm:w-auto">Продолжить</Button>
      </Link>
    </Card>
  );
}
