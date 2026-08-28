import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { DossierAuditPdf, type ChecklistItemSummary } from "@/lib/pdf/DossierAuditPdf";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response("Non authentifié.", { status: 401 });
  }

  const { data: membership } = await supabase
    .from("memberships")
    .select("org_id, organizations(name, sector, size_band)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) {
    return new Response("Organisation introuvable.", { status: 404 });
  }

  const org = membership.organizations as unknown as {
    name: string;
    sector: string | null;
    size_band: string | null;
  } | null;

  if (!org) {
    return new Response("Organisation introuvable.", { status: 404 });
  }

  const { data: nis2Result } = await supabase
    .from("diagnostic_results")
    .select("classification")
    .eq("org_id", membership.org_id)
    .eq("framework", "NIS2")
    .maybeSingle();

  if (!nis2Result || nis2Result.classification === "hors_champ") {
    return new Response("Aucun dossier d'audit nécessaire pour cette organisation.", {
      status: 400,
    });
  }

  const [{ data: templates }, { data: progress }] = await Promise.all([
    supabase
      .from("checklist_templates")
      .select("id, category, title, priority")
      .eq("framework", "NIS2")
      .order("sort_order"),
    supabase.from("org_checklist_progress").select("template_id, status").eq(
      "org_id",
      membership.org_id
    ),
  ]);

  const statusByTemplate = new Map((progress ?? []).map((p) => [p.template_id, p.status]));
  const checklistItems: ChecklistItemSummary[] = (templates ?? []).map((t) => ({
    category: t.category,
    title: t.title,
    priority: t.priority,
    status: (statusByTemplate.get(t.id) ?? "todo") as ChecklistItemSummary["status"],
  }));

  const pdfBuffer = await renderToBuffer(
    DossierAuditPdf({
      org: {
        orgName: org.name,
        sector: org.sector,
        sizeBand: org.size_band,
        classification: nis2Result.classification,
        generatedAt: new Date(),
      },
      checklistItems,
    })
  );

  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="dossier-audit-nis2.pdf"',
    },
  });
}
