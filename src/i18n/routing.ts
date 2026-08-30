import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr", "es", "de"],
  defaultLocale: "en",
  // Défaut next-intl : { name: "NEXT_LOCALE", sameSite: "lax" }, sans secure. httpOnly
  // n'est pas exposé par le type CookieAttributes de next-intl (choix délibéré de la
  // lib, pas un oubli) — impossible à forcer sans passer outre le typage officiel.
  localeCookie: { secure: process.env.NODE_ENV === "production" },
});

export type Locale = (typeof routing.locales)[number];
