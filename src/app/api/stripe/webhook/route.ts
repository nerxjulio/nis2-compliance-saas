import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, planForPriceId } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";

// current_period_end vit sur les subscription items depuis la mise à jour Stripe
// "flexible billing" (2025) — plus sur l'objet Subscription lui-même.
function currentPeriodEnd(subscription: Stripe.Subscription): string | null {
  const ts = subscription.items.data[0]?.current_period_end;
  return ts ? new Date(ts * 1000).toISOString() : null;
}

async function upsertSubscriptionFromStripe(
  orgId: string,
  subscription: Stripe.Subscription
) {
  const priceId = subscription.items.data[0]?.price.id;
  const plan = priceId ? (planForPriceId(priceId) ?? "free") : "free";
  const admin = createAdminClient();

  await admin.from("subscriptions").upsert(
    {
      org_id: orgId,
      stripe_customer_id:
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id,
      stripe_subscription_id: subscription.id,
      plan,
      status: subscription.status,
      current_period_end: currentPeriodEnd(subscription),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "org_id" }
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[stripe webhook] STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const orgId = session.metadata?.org_id;
        if (orgId && session.subscription) {
          const subscriptionId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;
          const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
          await upsertSubscriptionFromStripe(orgId, subscription);
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const subscription = event.data.object;
        const orgId = subscription.metadata?.org_id;
        if (orgId) {
          await upsertSubscriptionFromStripe(orgId, subscription);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const orgId = subscription.metadata?.org_id;
        if (orgId) {
          const admin = createAdminClient();
          await admin
            .from("subscriptions")
            .update({ plan: "free", status: "canceled", updated_at: new Date().toISOString() })
            .eq("org_id", orgId);
        }
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("[stripe webhook] handler failed:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
