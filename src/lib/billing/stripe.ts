import Stripe from "stripe";

/**
 * Stage 15 is architecture-only: no live payment processing. This client
 * is only ever constructed when STRIPE_SECRET_KEY is set (never in this
 * template's default `.env.example`), so every call site checks
 * `isStripeConfigured()` first and falls back to a friendly "demo mode"
 * response otherwise — see /api/billing/checkout.
 */
let cachedClient: Stripe | null = null;

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripeClient(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set — check isStripeConfigured() before calling getStripeClient().",
    );
  }

  if (!cachedClient) {
    cachedClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    });
  }

  return cachedClient;
}
