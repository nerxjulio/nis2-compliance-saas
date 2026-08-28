import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutSessionAction, createPortalSessionAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PLAN_KEYS = ["starter", "pro"] as const;

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const { checkout } = await searchParams;
  const supabase = await createClient();
  const locale = await getLocale();
  const t = await getTranslations("billing");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect({ href: "/login", locale });

  const { data: membership } = await supabase
    .from("memberships")
    .select("org_id")
    .eq("user_id", user!.id)
    .limit(1)
    .maybeSingle();
  if (!membership) redirect({ href: "/onboarding", locale });

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, status, stripe_customer_id, current_period_end")
    .eq("org_id", membership!.org_id)
    .maybeSingle();

  const currentPlan = subscription?.plan ?? "free";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-muted-foreground">
          {t("currentPlan")}{" "}
          <Badge variant="secondary">
            {t(`planNames.${currentPlan}` as "planNames.free")}
          </Badge>
        </p>
      </div>

      {checkout === "success" ? (
        <p className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">
          {t("checkoutSuccess")}
        </p>
      ) : null}
      {checkout === "cancelled" ? (
        <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
          {t("checkoutCancelled")}
        </p>
      ) : null}

      {subscription?.stripe_customer_id ? (
        <form action={createPortalSessionAction}>
          <Button type="submit" variant="outline">
            {t("manageSubscription")}
          </Button>
        </form>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {PLAN_KEYS.map((plan) => (
          <Card key={plan} className={currentPlan === plan ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle>{t(`plans.${plan}.name`)}</CardTitle>
              <CardDescription>{t(`plans.${plan}.price`)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-1 text-sm text-muted-foreground">
                {t.raw(`plans.${plan}.features`).map((f: string) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
              {currentPlan === plan ? (
                <Badge>{t("currentPlanBadge")}</Badge>
              ) : (
                <form action={createCheckoutSessionAction.bind(null, plan)}>
                  <Button type="submit" className="w-full">
                    {t("upgradeTo", { plan: t(`plans.${plan}.name`) })}
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
