import { getLocale, getTranslations } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { DOCUMENT_TYPES } from "@/lib/pdf/generate";
import { DocumentCard } from "./document-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DocumentsPage() {
  const supabase = await createClient();
  const locale = await getLocale();
  const t = await getTranslations("documents");

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

  const orgId = membership!.org_id;

  const { data: nis2Result } = await supabase
    .from("diagnostic_results")
    .select("classification")
    .eq("org_id", orgId)
    .eq("framework", "NIS2")
    .maybeSingle();

  if (!nis2Result) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{t("notDoneTitle")}</CardTitle>
            <CardDescription>{t("notDoneDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button render={<Link href="/diagnostic" />} nativeButton={false}>
              {t("doDiagnostic")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (nis2Result.classification === "hors_champ") {
    return (
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{t("notNeededTitle")}</CardTitle>
            <CardDescription>{t("notNeededDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" render={<Link href="/dashboard" />} nativeButton={false}>
              {t("backToDashboard")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: existingDocs } = await supabase
    .from("documents")
    .select("type, version, generated_at, storage_path")
    .eq("org_id", orgId);

  const existingByType = new Map((existingDocs ?? []).map((d) => [d.type, d]));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {DOCUMENT_TYPES.map((doc) => {
          const existing = existingByType.get(doc.type);
          return (
            <DocumentCard
              key={doc.type}
              type={doc.type}
              existing={
                existing
                  ? {
                      version: existing.version,
                      generatedAt: existing.generated_at,
                      storagePath: existing.storage_path,
                    }
                  : null
              }
            />
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("packageTitle")}</CardTitle>
          <CardDescription>{t("packageDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            render={<a href={`/api/audit-package?locale=${locale}`} />}
            nativeButton={false}
          >
            {t("packageButton")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
