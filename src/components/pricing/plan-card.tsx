import { Check } from "lucide-react";

import { Badge, Card } from "@/components/ui";
import { PRICING_PLANS } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { UpgradeButton } from "./upgrade-button";

export function PlanCard({
  plan,
  isCurrentPlan,
  isPremiumUser,
}: {
  plan: (typeof PRICING_PLANS)[number];
  isCurrentPlan: boolean;
  isPremiumUser: boolean;
}) {
  return (
    <Card
      className={cn(
        "flex h-full flex-col p-7",
        plan.highlighted &&
          "border-primary/40 shadow-glow-primary ring-1 ring-primary/20",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-lg font-semibold tracking-tight">
          {plan.name}
        </h3>
        <div className="flex items-center gap-2">
          {isCurrentPlan && <Badge variant="success">Текущий план</Badge>}
          {plan.highlighted && !isCurrentPlan && (
            <Badge variant="premium">Popular</Badge>
          )}
        </div>
      </div>

      <p className="mt-4">
        <span className="font-display text-4xl font-semibold tracking-tight">
          {plan.price}
        </span>
        <span className="text-muted-foreground">{plan.period}</span>
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>

      <ul className="mt-6 flex flex-1 flex-col gap-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2.5 text-sm">
            <Check className="h-4 w-4 shrink-0 text-success" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-8">
        {plan.id === "premium" ? (
          <UpgradeButton isPremium={isPremiumUser} />
        ) : (
          <Badge
            variant={isCurrentPlan ? "success" : "default"}
            className="w-full justify-center py-2.5"
          >
            {isCurrentPlan ? "Ваш текущий план" : "Бесплатно навсегда"}
          </Badge>
        )}
      </div>
    </Card>
  );
}
