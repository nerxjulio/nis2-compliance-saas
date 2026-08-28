import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutSessionAction, createPortalSessionAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PLANS = [
  {
    plan: "starter" as const,
    name: "Starter",
    price: "149€/mois",
    features: ["1 organisation", "Checklist priorisée", "5 documents clés", "1 utilisateur"],
  },
  {
    plan: "pro" as const,
    name: "Pro",
    price: "299€/mois",
    features: [
      "Multi-utilisateurs",
      "Documents illimités",
      "Dossier d'audit complet",
      "Support prioritaire",
    ],
  },
];

const PLAN_LABEL: Record<string, string> = { free: "Free", starter: "Starter", pro: "Pro" };

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const { checkout } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: membership } = await supabase
    .from("memberships")
    .select("org_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (!membership) redirect("/onboarding");

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, status, stripe_customer_id, current_period_end")
    .eq("org_id", membership.org_id)
    .maybeSingle();

  const currentPlan = subscription?.plan ?? "free";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Facturation</h1>
        <p className="text-muted-foreground">
          Plan actuel : <Badge variant="secondary">{PLAN_LABEL[currentPlan]}</Badge>
        </p>
      </div>

      {checkout === "success" ? (
        <p className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">
          Abonnement activé — merci !
        </p>
      ) : null}
      {checkout === "cancelled" ? (
        <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
          Paiement annulé, aucun changement n&apos;a été effectué.
        </p>
      ) : null}

      {subscription?.stripe_customer_id ? (
        <form action={createPortalSessionAction}>
          <Button type="submit" variant="outline">
            Gérer mon abonnement
          </Button>
        </form>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {PLANS.map((p) => (
          <Card key={p.plan} className={currentPlan === p.plan ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
              <CardDescription>{p.price}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-1 text-sm text-muted-foreground">
                {p.features.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
              {currentPlan === p.plan ? (
                <Badge>Plan actuel</Badge>
              ) : (
                <form action={createCheckoutSessionAction.bind(null, p.plan)}>
                  <Button type="submit" className="w-full">
                    Passer à {p.name}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
