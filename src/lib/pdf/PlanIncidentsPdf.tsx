import { Document, Text, View } from "@react-pdf/renderer";
import { DocumentShell } from "./DocumentShell";
import { pdfStyles } from "./styles";
import { PDF_CONTENT } from "./content";
import type { OrgContext } from "./types";

function Bullet({ label, text }: { label: string; text: string }) {
  return (
    <View style={pdfStyles.bullet}>
      <Text style={pdfStyles.bulletDot}>•</Text>
      <Text style={pdfStyles.bulletText}>
        <Text style={{ fontFamily: "Helvetica-Bold" }}>{label}</Text> — {text}
      </Text>
    </View>
  );
}

export function PlanIncidentsSection({ org }: { org: OrgContext }) {
  const c = PDF_CONTENT[org.locale];
  const p = c.planIncidents;

  return (
    <DocumentShell title={c.documentTypeTitles.plan_gestion_incidents} org={org}>
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>{p.objectifTitle}</Text>
        <Text style={pdfStyles.paragraph}>{p.objectifText(org.orgName)}</Text>
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>{p.etapesTitle}</Text>
        {p.etapes.map((e) => (
          <Bullet key={e.label} label={e.label} text={e.text} />
        ))}
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>{p.delaisTitle}</Text>
        <Text style={pdfStyles.paragraph}>{p.delaisIntro}</Text>
        {p.delais.map((d) => (
          <Bullet key={d.label} label={d.label} text={d.text} />
        ))}
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>{p.rolesTitle}</Text>
        <Text style={pdfStyles.paragraph}>{p.rolesText}</Text>
      </View>
    </DocumentShell>
  );
}

export function PlanIncidentsPdf({ org }: { org: OrgContext }) {
  return (
    <Document title={`${PDF_CONTENT[org.locale].documentTypeTitles.plan_gestion_incidents} — ${org.orgName}`}>
      <PlanIncidentsSection org={org} />
    </Document>
  );
}
