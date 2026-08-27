import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();

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
        .from("org_checklist_progress")
        .select("id", { count: "exact", head: true })
        .eq("org_id", orgId),
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
        <h1 className="text-2xl font-semibold">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d&apos;ensemble de ta conformité NIS2.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Statut NIS2</CardDescription>
            <CardTitle className="text-xl">
              {result ? (
                <Link href="/diagnostic/resultat">
                  <Badge variant={result.classification === "hors_champ" ? "secondary" : "default"}>
                    {result.classification === "hors_champ"
                      ? "Hors champ"
                      : result.classification === "essentielle"
                        ? "Entité essentielle"
                        : "Entité importante"}
                  </Badge>
                </Link>
              ) : (
                <span className="text-sm font-normal text-muted-foreground">
                  Diagnostic non réalisé
                </span>
              )}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Avancement checklist</CardDescription>
            <CardTitle className="text-xl">{progressPct}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progressPct} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Documents générés</CardDescription>
            <CardTitle className="text-xl">{docCount ?? 0}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {!result ? (
        <Card>
          <CardHeader>
            <CardTitle>Commence par le diagnostic</CardTitle>
            <CardDescription>
              10 minutes pour savoir précisément si NIS2 te concerne et à quel niveau.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button render={<Link href="/diagnostic" />} nativeButton={false}>Faire le diagnostic</Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
