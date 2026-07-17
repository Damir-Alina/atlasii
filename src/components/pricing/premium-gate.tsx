import { Lock } from "lucide-react";
import Link from "next/link";

import { Button, Card } from "@/components/ui";
import { ROUTES } from "@/lib/constants";

export function PremiumGate({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="flex flex-col items-center gap-3 p-8 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-premium/15 text-premium">
        <Lock className="h-5 w-5" />
      </span>
      <p className="font-medium">{title}</p>
      <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
      <Link href={ROUTES.pricing}>
        <Button size="sm" className="mt-1">
          Оформить Premium
        </Button>
      </Link>
    </Card>
  );
}
