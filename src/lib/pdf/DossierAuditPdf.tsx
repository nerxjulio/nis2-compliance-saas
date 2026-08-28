import { Document, Page, Text, View } from "@react-pdf/renderer";
import { pdfStyles } from "./styles";
import { CLASSIFICATION_LABEL, type OrgContext } from "./types";
import { PolitiqueSecuriteSection } from "./PolitiqueSecuritePdf";
import { RegistreRisquesSection } from "./RegistreRisquesPdf";
import { PlanIncidentsSection } from "./PlanIncidentsPdf";

export type ChecklistItemSummary = {
  category: string;
  title: string;
  priority: "haute" | "moyenne" | "basse";
  status: "todo" | "in_progress" | "done";
};

const STATUS_LABEL: Record<string, string> = {
  todo: "À faire",
  in_progress: "En cours",
  done: "Fait",
};

const DATE_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

function CoverPage({ org, items }: { org: OrgContext; items: ChecklistItemSummary[] }) {
  const done = items.filter((i) => i.status === "done").length;
  const classificationLabel = org.classification ? CLASSIFICATION_LABEL[org.classification] : "—";

  return (
    <Page size="A4" style={pdfStyles.page}>
      <View style={{ marginTop: 160, textAlign: "center" }}>
        <Text style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>
          Dossier d&apos;audit de conformité
        </Text>
        <Text style={{ fontSize: 26, fontFamily: "Helvetica-Bold", marginBottom: 8 }}>
          {org.orgName}
        </Text>
        <Text style={{ fontSize: 13, color: "#6b7280" }}>
          Généré le {DATE_FORMATTER.format(org.generatedAt)} avec NIS2Ready
        </Text>
      </View>

      <View style={{ marginTop: 60, alignSelf: "center", width: 320 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
          <Text style={{ color: "#6b7280" }}>Statut NIS2</Text>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>{classificationLabel}</Text>
        </View>
        {org.sector ? (
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <Text style={{ color: "#6b7280" }}>Secteur</Text>
            <Text>{org.sector}</Text>
          </View>
        ) : null}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
          <Text style={{ color: "#6b7280" }}>Avancement checklist</Text>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>
            {done} / {items.length} actions
          </Text>
        </View>
      </View>

      <View style={pdfStyles.footer} fixed>
        <Text>{org.orgName}</Text>
        <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
      </View>
    </Page>
  );
}

function ChecklistSummaryPage({ org, items }: { org: OrgContext; items: ChecklistItemSummary[] }) {
  const COLS = { category: "22%", title: "48%", priority: "15%", status: "15%" } as const;

  return (
    <Page size="A4" style={pdfStyles.page}>
      <Text style={pdfStyles.headerTitle}>Checklist de conformité</Text>
      <Text style={pdfStyles.headerMeta}>
        État d&apos;avancement au {DATE_FORMATTER.format(org.generatedAt)}.
      </Text>
      <View style={pdfStyles.divider} />

      <View style={pdfStyles.table}>
        <View style={pdfStyles.tableHeaderRow}>
          <Text style={[pdfStyles.tableCell, { width: COLS.category }]}>Catégorie</Text>
          <Text style={[pdfStyles.tableCell, { width: COLS.title }]}>Action</Text>
          <Text style={[pdfStyles.tableCell, { width: COLS.priority }]}>Priorité</Text>
          <Text style={[pdfStyles.tableCell, { width: COLS.status }]}>Statut</Text>
        </View>
        {items.map((item, i) => (
          <View style={pdfStyles.tableRow} key={i} wrap={false}>
            <Text style={[pdfStyles.tableCell, { width: COLS.category }]}>{item.category}</Text>
            <Text style={[pdfStyles.tableCell, { width: COLS.title }]}>{item.title}</Text>
            <Text style={[pdfStyles.tableCell, { width: COLS.priority }]}>{item.priority}</Text>
            <Text style={[pdfStyles.tableCell, { width: COLS.status }]}>
              {STATUS_LABEL[item.status]}
            </Text>
          </View>
        ))}
      </View>

      <View style={pdfStyles.footer} fixed>
        <Text>{org.orgName}</Text>
        <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
      </View>
    </Page>
  );
}

export function DossierAuditPdf({
  org,
  checklistItems,
}: {
  org: OrgContext;
  checklistItems: ChecklistItemSummary[];
}) {
  return (
    <Document title={`Dossier d'audit — ${org.orgName}`}>
      <CoverPage org={org} items={checklistItems} />
      <ChecklistSummaryPage org={org} items={checklistItems} />
      <PolitiqueSecuriteSection org={org} />
      <RegistreRisquesSection org={org} />
      <PlanIncidentsSection org={org} />
    </Document>
  );
}
