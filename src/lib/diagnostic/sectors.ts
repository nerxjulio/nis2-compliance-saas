// Secteurs tels que listés aux annexes I et II de la directive NIS2 (UE 2022/2555).
// "tier" détermine le poids dans la classification : annexe1 (hautement critique),
// annexe2 (autres secteurs critiques), hors_champ (non couvert par NIS2).
// Les libellés affichés vivent dans messages/*.json (namespace "diagnostic.sectors"),
// indexés par "value" — ce fichier ne contient que la structure, indépendante de la langue.
export type SectorTier = "annexe1" | "annexe2" | "hors_champ";

export type Sector = {
  value: string;
  tier: SectorTier;
};

export const SECTORS: Sector[] = [
  // Annexe I — secteurs hautement critiques
  { value: "energie", tier: "annexe1" },
  { value: "transport", tier: "annexe1" },
  { value: "banque", tier: "annexe1" },
  { value: "marches_financiers", tier: "annexe1" },
  { value: "sante", tier: "annexe1" },
  { value: "eau_potable", tier: "annexe1" },
  { value: "eaux_usees", tier: "annexe1" },
  { value: "infra_numerique", tier: "annexe1" },
  { value: "gestion_tic", tier: "annexe1" },
  { value: "administration", tier: "annexe1" },
  { value: "espace", tier: "annexe1" },

  // Annexe II — autres secteurs critiques
  { value: "postal", tier: "annexe2" },
  { value: "dechets", tier: "annexe2" },
  { value: "chimie", tier: "annexe2" },
  { value: "alimentaire", tier: "annexe2" },
  { value: "fabrication", tier: "annexe2" },
  { value: "fournisseur_numerique", tier: "annexe2" },
  { value: "recherche", tier: "annexe2" },

  // Hors champ NIS2 par défaut
  { value: "autre", tier: "hors_champ" },
];

export function getSector(value: string): Sector | undefined {
  return SECTORS.find((s) => s.value === value);
}
