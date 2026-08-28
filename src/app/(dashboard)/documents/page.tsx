import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DOCUMENT_TYPES } from "@/lib/pdf/generate";
import { DocumentCard } from "./document-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DocumentsPage() {
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

  const orgId = membership.org_id;

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
            <CardTitle>Fais d&apos;abord le diagnostic</CardTitle>
            <CardDescription>
              Les documents sont générés à partir de ton résultat NIS2 — commence par le
              diagnostic pour les débloquer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button render={<Link href="/diagnostic" />} nativeButton={false}>
              Faire le diagnostic
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
            <CardTitle>Pas de document nécessaire</CardTitle>
            <CardDescription>
              D&apos;après ton diagnostic, tu n&apos;es pas dans le champ d&apos;application de
              NIS2 — aucun document de conformité à générer ici.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" render={<Link href="/dashboard" />} nativeButton={false}>
              Retour au tableau de bord
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
        <h1 className="text-2xl font-semibold">Documents de conformité</h1>
        <p className="text-muted-foreground">
          Génère tes documents à partir des informations de ton organisation et de ton résultat
          NIS2. Relis-les avant diffusion — ce sont des modèles de travail, pas des documents
          finalisés.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {DOCUMENT_TYPES.map((doc) => {
          const existing = existingByType.get(doc.type);
          return (
            <DocumentCard
              key={doc.type}
              type={doc.type}
              title={doc.title}
              description={doc.description}
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
    </div>
  );
}
