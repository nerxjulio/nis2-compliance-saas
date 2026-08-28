import { Document, Text, View } from "@react-pdf/renderer";
import { DocumentShell } from "./DocumentShell";
import { pdfStyles } from "./styles";
import { PDF_CONTENT } from "./content";
import type { OrgContext } from "./types";

const COLS = { risque: "34%", proba: "13%", impact: "13%", niveau: "13%", mesures: "27%" } as const;

export function RegistreRisquesSection({ org }: { org: OrgContext }) {
  const c = PDF_CONTENT[org.locale];
  const r = c.registreRisques;

  return (
    <DocumentShell title={c.documentTypeTitles.registre_risques} org={org}>
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.paragraph}>{r.intro(org.orgName)}</Text>
      </View>

      <View style={pdfStyles.table}>
        <View style={pdfStyles.tableHeaderRow}>
          <Text style={[pdfStyles.tableCell, { width: COLS.risque }]}>{r.colRisque}</Text>
          <Text style={[pdfStyles.tableCell, { width: COLS.proba }]}>{r.colProba}</Text>
          <Text style={[pdfStyles.tableCell, { width: COLS.impact }]}>{r.colImpact}</Text>
          <Text style={[pdfStyles.tableCell, { width: COLS.niveau }]}>{r.colNiveau}</Text>
          <Text style={[pdfStyles.tableCell, { width: COLS.mesures }]}>{r.colMesures}</Text>
        </View>
        {r.risks.map((risk) => (
          <View style={pdfStyles.tableRow} key={risk.risque} wrap={false}>
            <Text style={[pdfStyles.tableCell, { width: COLS.risque }]}>{risk.risque}</Text>
            <Text style={[pdfStyles.tableCell, { width: COLS.proba }]}>{risk.probabilite}</Text>
            <Text style={[pdfStyles.tableCell, { width: COLS.impact }]}>{risk.impact}</Text>
            <Text style={[pdfStyles.tableCell, { width: COLS.niveau }]}>{risk.niveau}</Text>
            <Text style={[pdfStyles.tableCell, { width: COLS.mesures }]}>{risk.mesures}</Text>
          </View>
        ))}
      </View>
    </DocumentShell>
  );
}

export function RegistreRisquesPdf({ org }: { org: OrgContext }) {
  return (
    <Document title={`${PDF_CONTENT[org.locale].documentTypeTitles.registre_risques} — ${org.orgName}`}>
      <RegistreRisquesSection org={org} />
    </Document>
  );
}
