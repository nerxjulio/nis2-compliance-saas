import { renderToBuffer } from "@react-pdf/renderer";
import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { DossierAuditPdf, type ChecklistItemSummary } from "@/lib/pdf/DossierAuditPdf";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale");
  const locale: Locale = hasLocale(routing.locales, localeParam) ? localeParam : routing.defaultLocale;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response("Not authenticated.", { status: 401 });
  }

  const { data: membership } = await supabase
    .from("memberships")
    .select("org_id, organizations(name, sector, size_band)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) {
    return new Response("Organization not found.", { status: 404 });
  }

  const org = membership.organizations as unknown as {
    name: string;
    sector: string | null;
    size_band: string | null;
  } | null;

  if (!org) {
    return new Response("Organization not found.", { status: 404 });
  }

  const { data: nis2Result } = await supabase
    .from("diagnostic_results")
    .select("classification")
    .eq("org_id", membership.org_id)
    .eq("framework", "NIS2")
    .maybeSingle();

  if (!nis2Result || nis2Result.classification === "hors_champ") {
    return new Response("No audit package needed for this organization.", { status: 400 });
  }

  const [{ data: templates }, { data: progress }] = await Promise.all([
    supabase
      .from("checklist_templates")
      .select("id, slug, category, priority")
      .eq("framework", "NIS2")
      .order("sort_order"),
    supabase.from("org_checklist_progress").select("template_id, status").eq(
      "org_id",
      membership.org_id
    ),
  ]);

  const tCategories = await getTranslations({ locale, namespace: "checklistCategories" });
  const tItems = await getTranslations({ locale, namespace: "checklistItems" });
  const tPriority = await getTranslations({ locale, namespace: "checklist.priority" });

  const statusByTemplate = new Map((progress ?? []).map((p) => [p.template_id, p.status]));
  const checklistItems: ChecklistItemSummary[] = (templates ?? []).map((tpl) => ({
    category: tCategories(tpl.category),
    title: tItems(`${tpl.slug}.title` as "mfa.title"),
    priority: tPriority(tpl.priority),
    status: (statusByTemplate.get(tpl.id) ?? "todo") as ChecklistItemSummary["status"],
  }));

  const pdfBuffer = await renderToBuffer(
    DossierAuditPdf({
      org: {
        orgName: org.name,
        sector: org.sector,
        sizeBand: org.size_band,
        classification: nis2Result.classification,
        generatedAt: new Date(),
        locale,
      },
      checklistItems,
    })
  );

  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="nis2-audit-package.pdf"',
    },
  });
}
