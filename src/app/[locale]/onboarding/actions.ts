"use server";

import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { error: string | null };

export async function createOrganizationAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const t = await getTranslations("onboarding");
  const locale = await getLocale();
  const name = String(formData.get("name") ?? "").trim();
  const sector = String(formData.get("sector") ?? "").trim() || null;
  const sizeBand = String(formData.get("size_band") ?? "").trim() || null;

  if (!name) {
    return { error: t("nameRequired") };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("create_organization", {
    org_name: name,
    org_sector: sector,
    org_size_band: sizeBand,
  });

  if (error) {
    return { error: t("createError") };
  }

  return redirect({ href: "/dashboard", locale });
}
