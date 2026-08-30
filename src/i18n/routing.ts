import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr", "es", "de"],
  defaultLocale: "en",
  // Défaut next-intl : { name: "NEXT_LOCALE", sameSite: "lax" }, sans secure — pas grave
  // en dev (http://localhost), mais autant le forcer en prod comme pour les cookies
  // Supabase.
  localeCookie: { secure: process.env.NODE_ENV === "production" },
});

export type Locale = (typeof routing.locales)[number];
