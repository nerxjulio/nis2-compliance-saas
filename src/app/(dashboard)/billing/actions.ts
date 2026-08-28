"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStripe, priceIdForPlan, type BillingPlan } from "@/lib/stripe/client";

async function getOrgAndCustomer() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: membership } = await supabase
    .from("memberships")
    .select("org_id, organizations(name)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (!membership) redirect("/onboarding");

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id, plan, status")
    .eq("org_id", membership.org_id)
    .maybeSingle();

  return { supabase, user, orgId: membership.org_id as string, subscription };
}

export async function createCheckoutSessionAction(plan: BillingPlan) {
  const { supabase, user, orgId, subscription } = await getOrgAndCustomer();

  const stripe = getStripe();
  let customerId = subscription?.stripe_customer_id ?? null;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { org_id: orgId },
    });
    customerId = customer.id;
    await supabase
      .from("subscriptions")
      .update({ stripe_customer_id: customerId })
      .eq("org_id", orgId);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceIdForPlan(plan), quantity: 1 }],
    success_url: `${siteUrl}/billing?checkout=success`,
    cancel_url: `${siteUrl}/billing?checkout=cancelled`,
    metadata: { org_id: orgId },
    subscription_data: { metadata: { org_id: orgId } },
  });

  if (!session.url) {
    throw new Error("Stripe n'a pas renvoyé d'URL de checkout.");
  }

  redirect(session.url);
}

export async function createPortalSessionAction() {
  const { subscription } = await getOrgAndCustomer();

  if (!subscription?.stripe_customer_id) {
    redirect("/billing");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await getStripe().billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${siteUrl}/billing`,
  });

  redirect(session.url);
}
