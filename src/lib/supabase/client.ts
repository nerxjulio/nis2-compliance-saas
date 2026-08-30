import { createBrowserClient } from "@supabase/ssr";

// httpOnly reste false (défaut Supabase) : le client browser a besoin de lire/écrire
// ces cookies via document.cookie pour gérer la session — le forcer casserait l'auth.
// secure en revanche ne sert à rien en dev (http://localhost) et doit être forcé en prod.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookieOptions: { secure: process.env.NODE_ENV === "production" } }
  );
}
