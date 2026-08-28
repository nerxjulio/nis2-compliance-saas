import { getLocale, getTranslations } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const NIS2_TONE: Record<string, "default" | "secondary" | "destructive"> = {
  essentielle: "destructive",
  importante: "default",
  hors_champ: "secondary",
};

export default async function DiagnosticResultPage() {
  const supabase = await createClient();
  const locale = await getLocale();
  const t = await getTranslations("diagnosticResult");
  const tNis2Label = await getTranslations("diagnosticResult.nis2Label");
  const tReasons = await getTranslations("diagnosticResult.reasons");

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

  const { data: results } = await supabase
    .from("diagnostic_results")
    .select("framework, classification, details")
    .eq("org_id", membership!.org_id);

  if (!results || results.length === 0) {
    redirect({ href: "/diagnostic", locale });
  }

  const nis2 = results!.find((r) => r.framework === "NIS2");
  const dora = results!.find((r) => r.framework === "DORA");
  const nis2Reason = (nis2?.details as { reason?: string } | null)?.reason;
  const showOverlapNote =
    dora?.classification === "importante" && nis2 && nis2.classification !== "hors_champ";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>NIS2</CardTitle>
            {nis2 ? (
              <Badge variant={NIS2_TONE[nis2.classification]}>
                {tNis2Label(nis2.classification)}
              </Badge>
            ) : null}
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>
            {nis2Reason ? tReasons(nis2Reason as "hors_ue") : t("unavailable")}
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>DORA</CardTitle>
            <Badge variant={dora?.classification === "hors_champ" ? "secondary" : "default"}>
              {dora?.classification === "hors_champ" ? t("doraOut") : t("doraIn")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>
            {dora?.classification === "hors_champ" ? t("doraOutText") : t("doraInText")}
          </CardDescription>
        </CardContent>
      </Card>

      {showOverlapNote ? (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="text-base">{t("overlapTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{t("overlapText")}</CardDescription>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex gap-3">
        <Button render={<Link href="/dashboard" />} nativeButton={false}>
          {t("backToDashboard")}
        </Button>
        <Button variant="outline" render={<Link href="/diagnostic" />} nativeButton={false}>
          {t("retakeDiagnostic")}
        </Button>
      </div>
    </div>
  );
}
