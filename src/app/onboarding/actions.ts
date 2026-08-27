"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { error: string | null };

export async function createOrganizationAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const sector = String(formData.get("sector") ?? "").trim() || null;
  const sizeBand = String(formData.get("size_band") ?? "").trim() || null;

  if (!name) {
    return { error: "Le nom de l'organisation est requis." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("create_organization", {
    org_name: name,
    org_sector: sector,
    org_size_band: sizeBand,
  });

  if (error) {
    return { error: "Impossible de créer l'organisation. Réessaie dans un instant." };
  }

  redirect("/dashboard");
}
