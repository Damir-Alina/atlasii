import { NextResponse } from "next/server";

import { isStripeConfigured, getStripeClient } from "@/lib/billing";
import { getCurrentProfile } from "@/lib/auth";
import { setStripeCustomerId } from "@/lib/repositories";
import { createClient } from "@/lib/supabase/server";

/**
 * Creates a Stripe Checkout Session for the Premium plan.
 *
 * Stage 15 scope is "prepare the structure, don't process real payments" —
 * this route is fully wired up but STRIPE_SECRET_KEY / STRIPE_PREMIUM_PRICE_ID
 * are intentionally left unset in .env.example, so by default it returns a
 * `configured: false` response and the pricing page shows a demo-mode
 * notice instead of redirecting to Stripe.
 */
export async function POST(request: Request) {
  const profile = await getCurrentProfile();

  if (!isStripeConfigured() || !process.env.STRIPE_PREMIUM_PRICE_ID) {
    return NextResponse.json({
      configured: false,
      message:
        "Оплата пока в демо-режиме — Stripe ещё не подключён на этом окружении.",
    });
  }

  const stripe = getStripeClient();
  const origin = new URL(request.url).origin;
  const supabase = createClient();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PREMIUM_PRICE_ID, quantity: 1 }],
    success_url: `${origin}/pricing?checkout=success`,
    cancel_url: `${origin}/pricing?checkout=cancelled`,
    client_reference_id: profile.id,
    customer_email: profile.email || undefined,
  });

  if (session.customer) {
    await setStripeCustomerId(supabase, profile.id, String(session.customer));
  }

  return NextResponse.json({ configured: true, url: session.url });
}
