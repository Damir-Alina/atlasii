import { Crown } from "lucide-react";
import Link from "next/link";

import { Button, Card } from "@/components/ui";
import { FREE_DAILY_SESSION_LIMIT } from "@/lib/billing";
import { ROUTES } from "@/lib/constants";

export function DailyLimitUpsell() {
  return (
    <Card className="mx-auto max-w-md p-8 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-premium/15 text-premium">
        <Crown className="h-6 w-6" />
      </span>
      <h2 className="mt-4 font-display text-xl font-semibold tracking-tight">
        Дневной лимит исчерпан
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        На бесплатном плане доступно {FREE_DAILY_SESSION_LIMIT} сессии в
        день. Оформите Premium для неограниченной практики.
      </p>
      <Link href={ROUTES.pricing} className="mt-6 block">
        <Button className="w-full">Оформить Premium</Button>
      </Link>
    </Card>
  );
}
