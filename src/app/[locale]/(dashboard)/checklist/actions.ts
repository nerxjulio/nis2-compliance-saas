"use server";

import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

const VALID_STATUSES = new Set(["todo", "in_progress", "done"]);

export async function updateChecklistStatusAction(formData: FormData) {
  const templateId = String(formData.get("template_id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!templateId || !VALID_STATUSES.has(status)) return;

  const supabase = await createClient();
  const locale = await getLocale();

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

  await supabase.from("org_checklist_progress").upsert(
    {
      org_id: membership!.org_id,
      template_id: templateId,
      status,
      updated_by: user!.id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "org_id,template_id" }
  );

  revalidatePath("/[locale]/(dashboard)/checklist", "page");
  revalidatePath("/[locale]/(dashboard)/dashboard", "page");
}
