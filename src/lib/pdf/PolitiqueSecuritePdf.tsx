import { Document, Text, View } from "@react-pdf/renderer";
import { DocumentShell } from "./DocumentShell";
import { pdfStyles } from "./styles";
import { PDF_CONTENT } from "./content";
import type { OrgContext } from "./types";

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={pdfStyles.bullet}>
      <Text style={pdfStyles.bulletDot}>•</Text>
      <Text style={pdfStyles.bulletText}>{children}</Text>
    </View>
  );
}

// Contenu seul (sans <Document>), pour composition dans le dossier d'audit combiné.
export function PolitiqueSecuriteSection({ org }: { org: OrgContext }) {
  const c = PDF_CONTENT[org.locale];
  const s = c.politiqueSecurite;
  const sectorSuffix = org.sector ? ` (${c.dossier.secteurLabel.toLowerCase()}: ${org.sector})` : "";
  const classificationSentences: Record<string, (label: string) => string> = {
    en: (label) =>
      ` Based on the diagnostic performed, the organization is classified as "${label}" under the NIS2 directive, which requires implementing the risk management measures described in this document.`,
    fr: (label) =>
      ` D'après le diagnostic réalisé, l'organisation est classée « ${label} » au sens de la directive NIS2, ce qui implique la mise en œuvre des mesures de gestion des risques décrites dans ce document.`,
    es: (label) =>
      ` Según el diagnóstico realizado, la organización está clasificada como «${label}» conforme a la directiva NIS2, lo que implica la implementación de las medidas de gestión de riesgos descritas en este documento.`,
    de: (label) =>
      ` Laut der durchgeführten Diagnose wird die Organisation im Sinne der NIS2-Richtlinie als „${label}“ eingestuft, was die Umsetzung der in diesem Dokument beschriebenen Risikomanagementmaßnahmen erfordert.`,
  };
  const classificationSuffix = org.classification
    ? classificationSentences[org.locale](c.classificationLabel[org.classification])
    : "";

  return (
    <DocumentShell title={c.documentTypeTitles.politique_securite} org={org}>
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>{s.objetTitle}</Text>
        <Text style={pdfStyles.paragraph}>{s.objetText(org.orgName, sectorSuffix, classificationSuffix)}</Text>
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>{s.principesTitle}</Text>
        {s.principes.map((p) => (
          <Bullet key={p}>{p}</Bullet>
        ))}
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>{s.rolesTitle}</Text>
        <Text style={pdfStyles.paragraph}>{s.rolesText(org.orgName)}</Text>
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>{s.accesTitle}</Text>
        {s.acces.map((a) => (
          <Bullet key={a}>{a}</Bullet>
        ))}
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>{s.incidentsTitle}</Text>
        <Text style={pdfStyles.paragraph}>{s.incidentsText}</Text>
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>{s.revisionTitle}</Text>
        <Text style={pdfStyles.paragraph}>{s.revisionText}</Text>
      </View>
    </DocumentShell>
  );
}

export function PolitiqueSecuritePdf({ org }: { org: OrgContext }) {
  return (
    <Document title={`${PDF_CONTENT[org.locale].documentTypeTitles.politique_securite} — ${org.orgName}`}>
      <PolitiqueSecuriteSection org={org} />
    </Document>
  );
}
