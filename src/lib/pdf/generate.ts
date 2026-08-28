import { renderToBuffer } from "@react-pdf/renderer";
import { PolitiqueSecuritePdf } from "./PolitiqueSecuritePdf";
import { RegistreRisquesPdf } from "./RegistreRisquesPdf";
import { PlanIncidentsPdf } from "./PlanIncidentsPdf";
import { PDF_CONTENT } from "./content";
import type { OrgContext } from "./types";

// Titres/descriptions affichés proviennent de messages/*.json (namespace "documents.types") —
// cette liste ne porte que l'identifiant stable de chaque type de document.
export const DOCUMENT_TYPES = [
  { type: "politique_securite" as const },
  { type: "registre_risques" as const },
  { type: "plan_gestion_incidents" as const },
];

export type DocumentType = (typeof DOCUMENT_TYPES)[number]["type"];

export async function generateDocumentPdf(type: DocumentType, org: OrgContext): Promise<Buffer> {
  switch (type) {
    case "politique_securite":
      return renderToBuffer(PolitiqueSecuritePdf({ org }));
    case "registre_risques":
      return renderToBuffer(RegistreRisquesPdf({ org }));
    case "plan_gestion_incidents":
      return renderToBuffer(PlanIncidentsPdf({ org }));
  }
}

export function documentTypeTitle(type: DocumentType, locale: OrgContext["locale"]): string {
  return PDF_CONTENT[locale].documentTypeTitles[type];
}
