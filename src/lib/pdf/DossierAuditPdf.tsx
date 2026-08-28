import { Document, Page, Text, View } from "@react-pdf/renderer";
import { pdfStyles } from "./styles";
import { PDF_CONTENT } from "./content";
import { formatPdfDate } from "./DocumentShell";
import type { OrgContext } from "./types";
import { PolitiqueSecuriteSection } from "./PolitiqueSecuritePdf";
import { RegistreRisquesSection } from "./RegistreRisquesPdf";
import { PlanIncidentsSection } from "./PlanIncidentsPdf";

export type ChecklistItemSummary = {
  category: string;
  title: string;
  // Déjà traduit à l'appel (libellé affiché), pas la valeur brute de l'énumération DB.
  priority: string;
  status: "todo" | "in_progress" | "done";
};

function CoverPage({ org, items }: { org: OrgContext; items: ChecklistItemSummary[] }) {
  const c = PDF_CONTENT[org.locale];
  const done = items.filter((i) => i.status === "done").length;
  const classificationLabel = org.classification ? c.classificationLabel[org.classification] : "—";

  return (
    <Page size="A4" style={pdfStyles.page}>
      <View style={{ marginTop: 160, textAlign: "center" }}>
        <Text style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>{c.dossier.coverLabel}</Text>
        <Text style={{ fontSize: 26, fontFamily: "Helvetica-Bold", marginBottom: 8 }}>
          {org.orgName}
        </Text>
        <Text style={{ fontSize: 13, color: "#6b7280" }}>
          {c.disclaimer(formatPdfDate(org.generatedAt, org.locale)).split(" — ")[0]}
        </Text>
      </View>

      <View style={{ marginTop: 60, alignSelf: "center", width: 320 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
          <Text style={{ color: "#6b7280" }}>{c.dossier.statutLabel}</Text>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>{classificationLabel}</Text>
        </View>
        {org.sector ? (
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <Text style={{ color: "#6b7280" }}>{c.dossier.secteurLabel}</Text>
            <Text>{org.sector}</Text>
          </View>
        ) : null}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
          <Text style={{ color: "#6b7280" }}>{c.dossier.avancementLabel}</Text>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>
            {done} / {items.length} {c.dossier.actionsWord}
          </Text>
        </View>
      </View>

      <View style={pdfStyles.footer} fixed>
        <Text>{org.orgName}</Text>
        <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
      </View>
    </Page>
  );
}

function ChecklistSummaryPage({ org, items }: { org: OrgContext; items: ChecklistItemSummary[] }) {
  const c = PDF_CONTENT[org.locale];
  const d = c.dossier;
  const COLS = { category: "22%", title: "48%", priority: "15%", status: "15%" } as const;

  return (
    <Page size="A4" style={pdfStyles.page}>
      <Text style={pdfStyles.headerTitle}>{d.checklistTitle}</Text>
      <Text style={pdfStyles.headerMeta}>{d.checklistIntro(formatPdfDate(org.generatedAt, org.locale))}</Text>
      <View style={pdfStyles.divider} />

      <View style={pdfStyles.table}>
        <View style={pdfStyles.tableHeaderRow}>
          <Text style={[pdfStyles.tableCell, { width: COLS.category }]}>{d.colCategorie}</Text>
          <Text style={[pdfStyles.tableCell, { width: COLS.title }]}>{d.colAction}</Text>
          <Text style={[pdfStyles.tableCell, { width: COLS.priority }]}>{d.colPriorite}</Text>
          <Text style={[pdfStyles.tableCell, { width: COLS.status }]}>{d.colStatut}</Text>
        </View>
        {items.map((item, i) => (
          <View style={pdfStyles.tableRow} key={i} wrap={false}>
            <Text style={[pdfStyles.tableCell, { width: COLS.category }]}>{item.category}</Text>
            <Text style={[pdfStyles.tableCell, { width: COLS.title }]}>{item.title}</Text>
            <Text style={[pdfStyles.tableCell, { width: COLS.priority }]}>{item.priority}</Text>
            <Text style={[pdfStyles.tableCell, { width: COLS.status }]}>
              {d.statusLabel[item.status]}
            </Text>
          </View>
        ))}
      </View>

      <View style={pdfStyles.footer} fixed>
        <Text>{org.orgName}</Text>
        <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
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
    <Document title={`${PDF_CONTENT[org.locale].dossier.coverLabel} — ${org.orgName}`}>
      <CoverPage org={org} items={checklistItems} />
      <ChecklistSummaryPage org={org} items={checklistItems} />
      <PolitiqueSecuriteSection org={org} />
      <RegistreRisquesSection org={org} />
      <PlanIncidentsSection org={org} />
    </Document>
  );
}
