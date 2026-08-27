"use server";

import { createClient } from "@/lib/supabase/server";

type ActionResult = { error: string | null; sent: boolean };

export async function signInWithMagicLink(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email || !email.includes("@")) {
    return { error: "Adresse email invalide.", sent: false };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    return { error: "Impossible d'envoyer le lien de connexion. Réessaie dans un instant.", sent: false };
  }

  return { error: null, sent: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
