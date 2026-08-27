import { getSector } from "./sectors";

export type SizeTier = "micro_small" | "medium" | "large";

export type DiagnosticAnswers = {
  sector: string;
  employees: number;
  annualTurnoverEur: number;
  balanceSheetEur: number;
  euOperations: boolean;
  soleProvider: boolean;
  criticalPublicImpact: boolean;
  isFinancialEntity: boolean;
};

export type ClassificationResult = {
  classification: "essentielle" | "importante" | "hors_champ";
  score: number;
  details: Record<string, unknown>;
};

export type DiagnosticOutcome = {
  nis2: ClassificationResult;
  dora: ClassificationResult;
};

// Seuils de taille repris de la recommandation UE 2003/361 (définition PME),
// utilisés par NIS2 comme critère d'application (Art. 2 et 3 de la directive).
function sizeTier(employees: number, turnover: number, balanceSheet: number): SizeTier {
  const isLarge = employees >= 250 || (turnover > 50_000_000 && balanceSheet > 43_000_000);
  if (isLarge) return "large";

  const isMediumOrAbove = employees >= 50 || turnover > 10_000_000 || balanceSheet > 10_000_000;
  if (isMediumOrAbove) return "medium";

  return "micro_small";
}

export function classifyDiagnostic(answers: DiagnosticAnswers): DiagnosticOutcome {
  const sector = getSector(answers.sector);
  const size = sizeTier(answers.employees, answers.annualTurnoverEur, answers.balanceSheetEur);
  const qualitativeOverride = answers.soleProvider || answers.criticalPublicImpact;

  const nis2 = classifyNis2(sector?.tier ?? "hors_champ", size, qualitativeOverride, answers.euOperations);
  const dora = classifyDora(answers.isFinancialEntity);

  return { nis2, dora };
}

function classifyNis2(
  sectorTier: "annexe1" | "annexe2" | "hors_champ",
  size: SizeTier,
  qualitativeOverride: boolean,
  euOperations: boolean
): ClassificationResult {
  const details = { sectorTier, size, qualitativeOverride, euOperations };

  if (!euOperations) {
    return { classification: "hors_champ", score: 0, details: { ...details, reason: "hors_ue" } };
  }

  if (sectorTier === "hors_champ") {
    return { classification: "hors_champ", score: 0, details: { ...details, reason: "secteur_non_couvert" } };
  }

  if (size === "micro_small" && !qualitativeOverride) {
    return { classification: "hors_champ", score: 20, details: { ...details, reason: "trop_petit" } };
  }

  if (sectorTier === "annexe2") {
    return { classification: "importante", score: 70, details: { ...details, reason: "annexe2" } };
  }

  // Annexe I à partir d'ici.
  if (size === "large") {
    return { classification: "essentielle", score: 100, details: { ...details, reason: "annexe1_grande" } };
  }

  if (size === "medium") {
    return { classification: "importante", score: 70, details: { ...details, reason: "annexe1_moyenne" } };
  }

  // Micro/petite entreprise annexe I avec dérogation qualitative (seul fournisseur,
  // impact critique) : classée par prudence en "importante", à confirmer avec un juriste.
  return { classification: "importante", score: 60, details: { ...details, reason: "derogation_qualitative" } };
}

function classifyDora(isFinancialEntity: boolean): ClassificationResult {
  if (!isFinancialEntity) {
    return { classification: "hors_champ", score: 0, details: { isFinancialEntity } };
  }
  // DORA ne distingue pas essentielle/importante : on réutilise "importante" pour
  // signifier "concerné". Le régime est proportionné à la taille dans les obligations,
  // pas dans l'applicabilité elle-même.
  return { classification: "importante", score: 100, details: { isFinancialEntity } };
}
