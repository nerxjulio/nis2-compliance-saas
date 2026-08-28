import { getLocale, getTranslations } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateChecklistStatusAction } from "./actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PRIORITY_TONE: Record<string, "destructive" | "default" | "secondary"> = {
  haute: "destructive",
  moyenne: "default",
  basse: "secondary",
};

export default async function ChecklistPage() {
  const supabase = await createClient();
  const locale = await getLocale();
  const t = await getTranslations("checklist");
  const tCategories = await getTranslations("checklistCategories");
  const tItems = await getTranslations("checklistItems");

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

  const [{ data: templates }, { data: progress }] = await Promise.all([
    supabase
      .from("checklist_templates")
      .select("id, slug, category, priority, sort_order")
      .eq("framework", "NIS2")
      .order("sort_order"),
    supabase
      .from("org_checklist_progress")
      .select("template_id, status")
      .eq("org_id", orgId),
  ]);

  const statusByTemplate = new Map((progress ?? []).map((p) => [p.template_id, p.status]));
  const items = (templates ?? []).map((tpl) => ({
    ...tpl,
    status: statusByTemplate.get(tpl.id) ?? "todo",
  }));

  const total = items.length;
  const done = items.filter((i) => i.status === "done").length;
  const progressPct = total ? Math.round((done / total) * 100) : 0;

  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("progress", { done, total })}</p>
        <Progress value={progressPct} className="mt-3" />
      </div>

      {categories.map((category) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-base">
              {tCategories(category as "governance")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items
              .filter((i) => i.category === category)
              .map((item) => (
                <div key={item.id} className="rounded-md border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {tItems(`${item.slug}.title` as "mfa.title")}
                        </p>
                        <Badge variant={PRIORITY_TONE[item.priority]}>
                          {t(`priority.${item.priority}` as "priority.haute")}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {tItems(`${item.slug}.description` as "mfa.description")}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    {(["todo", "in_progress", "done"] as const).map((status) => (
                      <form key={status} action={updateChecklistStatusAction}>
                        <input type="hidden" name="template_id" value={item.id} />
                        <input type="hidden" name="status" value={status} />
                        <Button
                          type="submit"
                          size="sm"
                          variant={item.status === status ? "default" : "outline"}
                        >
                          {t(`status.${status}`)}
                        </Button>
                      </form>
                    ))}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
