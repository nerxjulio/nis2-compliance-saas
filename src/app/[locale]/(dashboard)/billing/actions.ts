"use server";

import { redirect as redirectExternal } from "next/navigation";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStripe, priceIdForPlan, type BillingPlan } from "@/lib/stripe/client";

async function getOrgAndCustomer() {
  const supabase = await createClient();
  const locale = await getLocale();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect({ href: "/login", locale });

  const { data: membership } = await supabase
    .from("memberships")
    .select("org_id, organizations(name)")
    .eq("user_id", user!.id)
    .limit(1)
    .maybeSingle();
  if (!membership) redirect({ href: "/onboarding", locale });

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id, plan, status")
    .eq("org_id", membership!.org_id)
    .maybeSingle();

  return { supabase, user: user!, locale, orgId: membership!.org_id as string, subscription };
}

export async function createCheckoutSessionAction(plan: BillingPlan) {
  const { supabase, user, locale, orgId, subscription } = await getOrgAndCustomer();

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
    success_url: `${siteUrl}/${locale}/billing?checkout=success`,
    cancel_url: `${siteUrl}/${locale}/billing?checkout=cancelled`,
    metadata: { org_id: orgId },
    subscription_data: { metadata: { org_id: orgId } },
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  // URL externe (Stripe) : le redirect localisé de next-intl valide/préfixe les routes
  // internes, il ne faut pas l'utiliser ici.
  redirectExternal(session.url);
}

export async function createPortalSessionAction() {
  const { subscription, locale } = await getOrgAndCustomer();

  if (!subscription?.stripe_customer_id) {
    redirect({ href: "/billing", locale });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await getStripe().billingPortal.sessions.create({
    customer: subscription!.stripe_customer_id!,
    return_url: `${siteUrl}/${locale}/billing`,
  });

  redirectExternal(session.url);
}
