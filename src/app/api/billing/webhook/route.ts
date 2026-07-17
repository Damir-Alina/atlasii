import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { getStripeClient, isStripeConfigured } from "@/lib/billing";
import { setSubscriptionStatus } from "@/lib/repositories";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Stripe webhook endpoint — kept fully wired up for when a real Stripe
 * account is connected, but inert by default (Stage 15 does not process
 * real payments): without STRIPE_WEBHOOK_SECRET configured, every request
 * is rejected before any subscription data is touched.
 *
 * Uses the service-role client because a webhook call has no end-user
 * session to authenticate — Stripe is the only caller, verified via the
 * signature below.
 */
export async function POST(request: Request) {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }

  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  if (!signature) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const stripe = getStripeClient();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id;
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : (session.subscription?.id ?? null);

      if (customerId) {
        await setSubscriptionStatus(supabase, customerId, {
          isPremium: true,
          subscriptionId,
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer?.id;

      if (customerId) {
        await setSubscriptionStatus(supabase, customerId, {
          isPremium: subscription.status === "active",
          subscriptionId: subscription.id,
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer?.id;

      if (customerId) {
        await setSubscriptionStatus(supabase, customerId, {
          isPremium: false,
          subscriptionId: null,
        });
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
