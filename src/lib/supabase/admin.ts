import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Client "service role" : bypasse le RLS. Réservé au webhook Stripe (appel serveur-à-serveur,
// pas de session utilisateur) — jamais importé depuis un composant client ni exposé au navigateur.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
