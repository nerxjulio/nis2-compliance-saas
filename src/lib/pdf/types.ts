export type OrgContext = {
  orgName: string;
  sector: string | null;
  sizeBand: string | null;
  classification: "essentielle" | "importante" | "hors_champ" | null;
  generatedAt: Date;
};

export const CLASSIFICATION_LABEL: Record<string, string> = {
  essentielle: "Entité essentielle",
  importante: "Entité importante",
  hors_champ: "Hors champ NIS2",
};
