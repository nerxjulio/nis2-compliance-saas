"use server";

import { getLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { error: string | null; sent: boolean };

export async function signInWithMagicLink(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const t = await getTranslations("login");

  if (!email || !email.includes("@")) {
    return { error: t("invalidEmail"), sent: false };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const locale = await getLocale();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?locale=${locale}`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    return { error: t("sendError"), sent: false };
  }

  return { error: null, sent: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
