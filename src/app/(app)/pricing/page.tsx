import type { Metadata } from "next";

import { LockedFeaturesList, PlanCard } from "@/components/pricing";
import { getCurrentProfile } from "@/lib/auth";
import { PRICING_PLANS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Тариф",
};

export default async function PricingPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Тариф
        </h1>
        <p className="mt-1.5 text-muted-foreground">
          Управляйте подпиской и узнайте, что даёт Premium.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {PRICING_PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrentPlan={
              profile.isPremium ? plan.id === "premium" : plan.id === "free"
            }
            isPremiumUser={profile.isPremium}
          />
        ))}
      </div>

      <div className="mt-6">
        <LockedFeaturesList isPremiumUser={profile.isPremium} />
      </div>
    </div>
  );
}
