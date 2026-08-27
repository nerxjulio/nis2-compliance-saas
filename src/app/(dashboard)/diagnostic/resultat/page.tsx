import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const NIS2_LABELS: Record<string, { label: string; tone: "default" | "secondary" | "destructive" }> = {
  essentielle: { label: "Entité essentielle", tone: "destructive" },
  importante: { label: "Entité importante", tone: "default" },
  hors_champ: { label: "Hors champ NIS2", tone: "secondary" },
};

const NIS2_EXPLANATIONS: Record<string, string> = {
  hors_ue: "Tu as indiqué ne pas opérer dans l'UE : NIS2 ne s'applique pas à ton organisation.",
  secteur_non_couvert:
    "Ton secteur d'activité ne figure pas dans les annexes I ou II de la directive NIS2.",
  trop_petit:
    "Ton effectif et tes chiffres financiers te placent sous le seuil d'application de NIS2 (moins de 50 salariés et moins de 10M€ de chiffre d'affaires/bilan), sans critère d'exception qualitatif.",
  annexe2: "Ton secteur relève de l'annexe II de NIS2 : tu es classé entité importante.",
  annexe1_grande:
    "Ton secteur relève de l'annexe I et ta taille dépasse le seuil des grandes entreprises (250 salariés, ou plus de 50M€ de CA et 43M€ de bilan) : tu es classé entité essentielle.",
  annexe1_moyenne:
    "Ton secteur relève de l'annexe I et ta taille correspond à une moyenne entreprise : tu es classé entité importante.",
  derogation_qualitative:
    "Bien que ta taille soit sous le seuil habituel, un critère qualitatif (seul fournisseur ou impact critique) peut te faire entrer dans le champ de NIS2 — à confirmer avec un juriste spécialisé.",
};

export default async function DiagnosticResultPage() {
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

  const { data: results } = await supabase
    .from("diagnostic_results")
    .select("framework, classification, details")
    .eq("org_id", membership.org_id);

  if (!results || results.length === 0) {
    redirect("/diagnostic");
  }

  const nis2 = results.find((r) => r.framework === "NIS2");
  const dora = results.find((r) => r.framework === "DORA");
  const nis2Reason = (nis2?.details as { reason?: string } | null)?.reason;
  const showOverlapNote =
    dora?.classification === "importante" && nis2 && nis2.classification !== "hors_champ";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Ton résultat</h1>
        <p className="text-muted-foreground">
          Ceci est une orientation basée sur tes réponses, pas un avis juridique certifié.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>NIS2</CardTitle>
            {nis2 ? (
              <Badge variant={NIS2_LABELS[nis2.classification].tone}>
                {NIS2_LABELS[nis2.classification].label}
              </Badge>
            ) : null}
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>
            {nis2Reason ? NIS2_EXPLANATIONS[nis2Reason] : "Résultat indisponible."}
          </CardDescription>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>DORA</CardTitle>
            <Badge variant={dora?.classification === "hors_champ" ? "secondary" : "default"}>
              {dora?.classification === "hors_champ" ? "Hors champ DORA" : "Concerné par DORA"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>
            {dora?.classification === "hors_champ"
              ? "Tu n'as pas indiqué être une entité financière régulée : DORA ne s'applique pas."
              : "En tant qu'entité financière régulée, DORA encadre ta gestion des risques liés aux TIC."}
          </CardDescription>
        </CardContent>
      </Card>

      {showOverlapNote ? (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="text-base">À savoir</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              DORA est prioritaire sur NIS2 pour les entités financières régulées (principe de
              lex specialis) : c&apos;est DORA qui encadre ta gestion des risques TIC, même si ton
              secteur apparaît aussi dans le champ de NIS2.
            </CardDescription>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex gap-3">
        <Button render={<Link href="/dashboard" />} nativeButton={false}>Retour au tableau de bord</Button>
        <Button variant="outline" render={<Link href="/diagnostic" />} nativeButton={false}>
          Refaire le diagnostic
        </Button>
      </div>
    </div>
  );
}
