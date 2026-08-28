import { Document, Text, View } from "@react-pdf/renderer";
import { DocumentShell } from "./DocumentShell";
import { pdfStyles } from "./styles";
import type { OrgContext } from "./types";

type Risk = {
  risque: string;
  probabilite: "Faible" | "Moyenne" | "Élevée";
  impact: "Faible" | "Moyen" | "Élevé";
  niveau: "Faible" | "Moyen" | "Élevé" | "Critique";
  mesures: string;
};

const STARTER_RISKS: Risk[] = [
  {
    risque: "Cyberattaque (rançongiciel, hameçonnage)",
    probabilite: "Élevée",
    impact: "Élevé",
    niveau: "Critique",
    mesures: "MFA, sauvegardes testées, sensibilisation des équipes",
  },
  {
    risque: "Accès non autorisé aux systèmes",
    probabilite: "Moyenne",
    impact: "Élevé",
    niveau: "Élevé",
    mesures: "Authentification forte, principe du moindre privilège",
  },
  {
    risque: "Panne matérielle ou perte de données",
    probabilite: "Moyenne",
    impact: "Élevé",
    niveau: "Élevé",
    mesures: "Sauvegardes régulières et testées, redondance",
  },
  {
    risque: "Défaillance d'un prestataire critique",
    probabilite: "Moyenne",
    impact: "Élevé",
    niveau: "Élevé",
    mesures: "Clauses de sécurité contractuelles, plan de continuité",
  },
  {
    risque: "Indisponibilité prolongée des systèmes",
    probabilite: "Faible",
    impact: "Élevé",
    niveau: "Moyen",
    mesures: "Plan de reprise d'activité (PRA), redondance",
  },
  {
    risque: "Erreur humaine (manipulation, envoi erroné)",
    probabilite: "Élevée",
    impact: "Moyen",
    niveau: "Moyen",
    mesures: "Formation régulière, contrôle d'accès, double validation",
  },
  {
    risque: "Fuite de données personnelles",
    probabilite: "Moyenne",
    impact: "Élevé",
    niveau: "Élevé",
    mesures: "Chiffrement, contrôle d'accès, conformité RGPD",
  },
];

const COLS = { risque: "34%", proba: "13%", impact: "13%", niveau: "13%", mesures: "27%" } as const;

export function RegistreRisquesSection({ org }: { org: OrgContext }) {
  return (
      <DocumentShell title="Registre des risques" org={org}>
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.paragraph}>
            Ce registre recense les risques génériques liés à la sécurité de l&apos;information
            pour {org.orgName}. Il constitue un point de départ : chaque risque doit être revu,
            ajusté et complété par des risques spécifiques à l&apos;activité de l&apos;organisation.
          </Text>
        </View>

        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableHeaderRow}>
            <Text style={[pdfStyles.tableCell, { width: COLS.risque }]}>Risque</Text>
            <Text style={[pdfStyles.tableCell, { width: COLS.proba }]}>Probabilité</Text>
            <Text style={[pdfStyles.tableCell, { width: COLS.impact }]}>Impact</Text>
            <Text style={[pdfStyles.tableCell, { width: COLS.niveau }]}>Niveau</Text>
            <Text style={[pdfStyles.tableCell, { width: COLS.mesures }]}>Mesures</Text>
          </View>
          {STARTER_RISKS.map((r) => (
            <View style={pdfStyles.tableRow} key={r.risque} wrap={false}>
              <Text style={[pdfStyles.tableCell, { width: COLS.risque }]}>{r.risque}</Text>
              <Text style={[pdfStyles.tableCell, { width: COLS.proba }]}>{r.probabilite}</Text>
              <Text style={[pdfStyles.tableCell, { width: COLS.impact }]}>{r.impact}</Text>
              <Text style={[pdfStyles.tableCell, { width: COLS.niveau }]}>{r.niveau}</Text>
              <Text style={[pdfStyles.tableCell, { width: COLS.mesures }]}>{r.mesures}</Text>
            </View>
          ))}
        </View>
      </DocumentShell>
  );
}

export function RegistreRisquesPdf({ org }: { org: OrgContext }) {
  return (
    <Document title={`Registre des risques — ${org.orgName}`}>
      <RegistreRisquesSection org={org} />
    </Document>
  );
}
