import { renderToBuffer } from "@react-pdf/renderer";
import { PolitiqueSecuritePdf } from "./PolitiqueSecuritePdf";
import { RegistreRisquesPdf } from "./RegistreRisquesPdf";
import { PlanIncidentsPdf } from "./PlanIncidentsPdf";
import type { OrgContext } from "./types";

export const DOCUMENT_TYPES = [
  {
    type: "politique_securite" as const,
    title: "Politique de sécurité de l'information",
    description: "Cadre général de sécurité applicable à l'organisation.",
  },
  {
    type: "registre_risques" as const,
    title: "Registre des risques",
    description: "Risques génériques liés à la sécurité de l'information, avec mesures associées.",
  },
  {
    type: "plan_gestion_incidents" as const,
    title: "Plan de gestion des incidents",
    description: "Procédure de réponse aux incidents et délais de notification NIS2.",
  },
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
