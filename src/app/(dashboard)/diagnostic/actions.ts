"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { classifyDiagnostic, type DiagnosticAnswers } from "@/lib/diagnostic/classify";

type ActionResult = { error: string | null };

function toNumber(value: FormDataEntryValue | null): number {
  const n = Number(String(value ?? "0").replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export async function submitDiagnosticAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
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

  const sector = String(formData.get("sector") ?? "");
  if (!sector) {
    return { error: "Sélectionne un secteur d'activité." };
  }

  const answers: DiagnosticAnswers = {
    sector,
    employees: toNumber(formData.get("employees")),
    annualTurnoverEur: toNumber(formData.get("annual_turnover")),
    balanceSheetEur: toNumber(formData.get("balance_sheet")),
    euOperations: formData.get("eu_operations") === "oui",
    soleProvider: formData.get("sole_provider") === "on",
    criticalPublicImpact: formData.get("critical_public_impact") === "on",
    isFinancialEntity: formData.get("is_financial_entity") === "on",
  };

  const responsesToSave = Object.entries(answers).map(([question_key, value]) => ({
    org_id: orgId,
    question_key,
    answer: value as unknown as never,
  }));

  const { error: responsesError } = await supabase
    .from("diagnostic_responses")
    .upsert(responsesToSave, { onConflict: "org_id,question_key" });

  if (responsesError) {
    return { error: "Impossible d'enregistrer tes réponses. Réessaie dans un instant." };
  }

  const { nis2, dora } = classifyDiagnostic(answers);

  const { error: resultsError } = await supabase.from("diagnostic_results").upsert(
    [
      {
        org_id: orgId,
        framework: "NIS2" as const,
        classification: nis2.classification,
        score: nis2.score,
        details: nis2.details as unknown as never,
      },
      {
        org_id: orgId,
        framework: "DORA" as const,
        classification: dora.classification,
        score: dora.score,
        details: dora.details as unknown as never,
      },
    ],
    { onConflict: "org_id,framework" }
  );

  if (resultsError) {
    return { error: "Impossible de calculer le résultat. Réessaie dans un instant." };
  }

  redirect("/diagnostic/resultat");
}
