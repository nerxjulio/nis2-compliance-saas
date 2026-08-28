"use server";

import { revalidatePath } from "next/cache";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { generateDocumentPdf, documentTypeTitle, DOCUMENT_TYPES, type DocumentType } from "@/lib/pdf/generate";

type ActionResult = { error: string | null };

export async function generateDocumentAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("documents");
  const type = String(formData.get("type") ?? "") as DocumentType;
  const isValidType = DOCUMENT_TYPES.some((d) => d.type === type);
  if (!isValidType) {
    return { error: "Unknown document type." };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect({ href: "/login", locale });

  const { data: membership } = await supabase
    .from("memberships")
    .select("org_id, organizations(name, sector, size_band)")
    .eq("user_id", user!.id)
    .limit(1)
    .maybeSingle();
  if (!membership) redirect({ href: "/onboarding", locale });

  const org = membership!.organizations as unknown as {
    name: string;
    sector: string | null;
    size_band: string | null;
  } | null;
  if (!org) {
    return { error: "Organization not found." };
  }

  const { data: nis2Result } = await supabase
    .from("diagnostic_results")
    .select("classification")
    .eq("org_id", membership!.org_id)
    .eq("framework", "NIS2")
    .maybeSingle();

  const { data: existing } = await supabase
    .from("documents")
    .select("version")
    .eq("org_id", membership!.org_id)
    .eq("type", type)
    .maybeSingle();

  const nextVersion = (existing?.version ?? 0) + 1;
  const generatedAt = new Date();

  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await generateDocumentPdf(type, {
      orgName: org.name,
      sector: org.sector,
      sizeBand: org.size_band,
      classification: nis2Result?.classification ?? null,
      generatedAt,
      locale,
    });
  } catch (err) {
    console.error("[generateDocumentAction] PDF render failed:", err);
    return { error: t("generateError") };
  }

  const storagePath = `${membership!.org_id}/${type}.pdf`;
  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(storagePath, pdfBuffer, { contentType: "application/pdf", upsert: true });

  if (uploadError) {
    console.error("[generateDocumentAction] upload failed:", uploadError.message);
    return { error: `${t("uploadError")}: ${uploadError.message}` };
  }

  const { error: dbError } = await supabase.from("documents").upsert(
    {
      org_id: membership!.org_id,
      type,
      title: documentTypeTitle(type, locale),
      storage_path: storagePath,
      version: nextVersion,
      generated_by: user!.id,
      generated_at: generatedAt.toISOString(),
    },
    { onConflict: "org_id,type" }
  );

  if (dbError) {
    console.error("[generateDocumentAction] db upsert failed:", dbError.message);
    return { error: `${t("saveError")}: ${dbError.message}` };
  }

  revalidatePath("/[locale]/(dashboard)/documents", "page");
  revalidatePath("/[locale]/(dashboard)/dashboard", "page");
  return { error: null };
}

export async function getDocumentDownloadUrlAction(storagePath: string): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(storagePath, 60);

  if (error || !data) return null;
  return data.signedUrl;
}
