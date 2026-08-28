import Stripe from "stripe";

// Instanciation paresseuse : construire un Stripe() au chargement du module ferait planter le
// build (et toute route qui importe ce fichier) tant que STRIPE_SECRET_KEY n'est pas configurée.
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY n'est pas configurée.");
    _stripe = new Stripe(key);
  }
  return _stripe;
}

export const PLAN_PRICE_ENV = {
  starter: "STRIPE_STARTER_PRICE_ID",
  pro: "STRIPE_PRO_PRICE_ID",
} as const;

export type BillingPlan = keyof typeof PLAN_PRICE_ENV;

export function priceIdForPlan(plan: BillingPlan): string {
  const id = process.env[PLAN_PRICE_ENV[plan]];
  if (!id) throw new Error(`Missing env var ${PLAN_PRICE_ENV[plan]}`);
  return id;
}

export function planForPriceId(priceId: string): BillingPlan | null {
  if (priceId === process.env.STRIPE_STARTER_PRICE_ID) return "starter";
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return "pro";
  return null;
}
