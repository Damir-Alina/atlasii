"use client";

import { useState } from "react";

import { Button } from "@/components/ui";

export function UpgradeButton({ isPremium }: { isPremium: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const [demoMessage, setDemoMessage] = useState<string | null>(null);

  async function handleClick() {
    setIsLoading(true);
    setDemoMessage(null);

    const res = await fetch("/api/billing/checkout", { method: "POST" }).catch(
      () => null,
    );
    const data = await res?.json().catch(() => null);

    if (data?.configured && data.url) {
      window.location.href = data.url;
      return;
    }

    setDemoMessage(
      data?.message ??
        "Оплата пока в демо-режиме — Stripe ещё не подключён на этом окружении.",
    );
    setIsLoading(false);
  }

  if (isPremium) {
    return (
      <Button variant="secondary" className="w-full" disabled>
        У вас уже Premium
      </Button>
    );
  }

  return (
    <div>
      <Button className="w-full" onClick={handleClick} isLoading={isLoading}>
        Оформить Premium
      </Button>
      {demoMessage && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {demoMessage}
        </p>
      )}
    </div>
  );
}
