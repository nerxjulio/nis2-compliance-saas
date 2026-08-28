import type { Locale } from "@/i18n/routing";

export type OrgContext = {
  orgName: string;
  sector: string | null;
  sizeBand: string | null;
  classification: "essentielle" | "importante" | "hors_champ" | null;
  generatedAt: Date;
  locale: Locale;
};
