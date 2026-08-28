import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const t = await getTranslations("dashboard");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: membership } = await supabase
    .from("memberships")
    .select("org_id")
    .eq("user_id", user!.id)
    .limit(1)
    .maybeSingle();

  const orgId = membership?.org_id;

  const [{ data: result }, { count: totalItems }, { count: doneItems }, { count: docCount }] =
    await Promise.all([
      supabase
        .from("diagnostic_results")
        .select("classification, score")
        .eq("org_id", orgId)
        .eq("framework", "NIS2")
        .maybeSingle(),
      supabase
        .from("checklist_templates")
        .select("id", { count: "exact", head: true })
        .eq("framework", "NIS2"),
      supabase
        .from("org_checklist_progress")
        .select("id", { count: "exact", head: true })
        .eq("org_id", orgId)
        .eq("status", "done"),
      supabase
        .from("documents")
        .select("id", { count: "exact", head: true })
        .eq("org_id", orgId),
    ]);

  const progressPct = totalItems ? Math.round(((doneItems ?? 0) / totalItems) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>{t("nis2Status")}</CardDescription>
            <CardTitle className="text-xl">
              {result ? (
                <Link href="/diagnostic/resultat">
                  <Badge variant={result.classification === "hors_champ" ? "secondary" : "default"}>
                    {t(`classification.${result.classification}` as "classification.essentielle")}
                  </Badge>
                </Link>
              ) : (
                <span className="text-sm font-normal text-muted-foreground">
                  {t("diagnosticNotDone")}
                </span>
              )}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>{t("checklistProgress")}</CardDescription>
            <CardTitle className="text-xl">{progressPct}%</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={progressPct} />
            <Link href="/checklist" className="text-sm text-primary hover:underline">
              {t("viewChecklist")}
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>{t("documentsGenerated")}</CardDescription>
            <CardTitle className="text-xl">{docCount ?? 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/documents" className="text-sm text-primary hover:underline">
              {t("viewDocuments")}
            </Link>
          </CardContent>
        </Card>
      </div>

      {!result ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("startDiagnosticTitle")}</CardTitle>
            <CardDescription>{t("startDiagnosticDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button render={<Link href="/diagnostic" />} nativeButton={false}>
              {t("doDiagnostic")}
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
