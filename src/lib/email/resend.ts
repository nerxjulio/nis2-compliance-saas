import { Resend } from "resend";

// Même pattern d'instanciation paresseuse que le client Stripe (src/lib/stripe/client.ts) :
// construire au chargement du module casserait le build tant que RESEND_API_KEY n'est pas
// configurée.
let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY n'est pas configurée.");
    _resend = new Resend(key);
  }
  return _resend;
}

// onboarding@resend.dev fonctionne sans domaine vérifié, mais n'envoie qu'à l'adresse email
// du compte Resend — utile pour tester. En production, configure EMAIL_FROM avec un domaine
// vérifié (Resend → Domains) pour envoyer aux vrais utilisateurs.
export const EMAIL_FROM = process.env.EMAIL_FROM ?? "NIS2Ready <onboarding@resend.dev>";
