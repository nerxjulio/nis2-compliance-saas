// Secteurs tels que listés aux annexes I et II de la directive NIS2 (UE 2022/2555).
// "tier" détermine le poids dans la classification : annexe1 (hautement critique),
// annexe2 (autres secteurs critiques), hors_champ (non couvert par NIS2).
export type SectorTier = "annexe1" | "annexe2" | "hors_champ";

export type Sector = {
  value: string;
  label: string;
  tier: SectorTier;
};

export const SECTORS: Sector[] = [
  // Annexe I — secteurs hautement critiques
  { value: "energie", label: "Énergie (électricité, gaz, pétrole, chauffage urbain, hydrogène)", tier: "annexe1" },
  { value: "transport", label: "Transport (aérien, ferroviaire, maritime, routier)", tier: "annexe1" },
  { value: "banque", label: "Secteur bancaire", tier: "annexe1" },
  { value: "marches_financiers", label: "Infrastructures de marchés financiers", tier: "annexe1" },
  { value: "sante", label: "Santé (soins, laboratoires, dispositifs médicaux/pharma critiques)", tier: "annexe1" },
  { value: "eau_potable", label: "Eau potable", tier: "annexe1" },
  { value: "eaux_usees", label: "Eaux usées", tier: "annexe1" },
  { value: "infra_numerique", label: "Infrastructures numériques (cloud, data centers, CDN, DNS, télécom)", tier: "annexe1" },
  { value: "gestion_tic", label: "Gestion des services TIC (fournisseur B2B)", tier: "annexe1" },
  { value: "administration", label: "Administration publique", tier: "annexe1" },
  { value: "espace", label: "Espace", tier: "annexe1" },

  // Annexe II — autres secteurs critiques
  { value: "postal", label: "Services postaux et d'expédition", tier: "annexe2" },
  { value: "dechets", label: "Gestion des déchets", tier: "annexe2" },
  { value: "chimie", label: "Fabrication et distribution de produits chimiques", tier: "annexe2" },
  { value: "alimentaire", label: "Production, transformation et distribution alimentaire", tier: "annexe2" },
  { value: "fabrication", label: "Fabrication (dispositifs médicaux, électronique, machines, véhicules)", tier: "annexe2" },
  { value: "fournisseur_numerique", label: "Fournisseur numérique (marketplace, moteur de recherche, réseau social)", tier: "annexe2" },
  { value: "recherche", label: "Organisme de recherche", tier: "annexe2" },

  // Hors champ NIS2 par défaut
  { value: "autre", label: "Aucun de ces secteurs", tier: "hors_champ" },
];

export function getSector(value: string): Sector | undefined {
  return SECTORS.find((s) => s.value === value);
}
