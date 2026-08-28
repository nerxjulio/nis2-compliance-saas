import { Page, Text, View } from "@react-pdf/renderer";
import { pdfStyles } from "./styles";
import { PDF_CONTENT } from "./content";
import type { OrgContext } from "./types";

const DATE_FORMATTER: Record<string, Intl.DateTimeFormat> = {
  en: new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "long", year: "numeric" }),
  fr: new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }),
  es: new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "long", year: "numeric" }),
  de: new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "long", year: "numeric" }),
};

export function formatPdfDate(date: Date, locale: string): string {
  return (DATE_FORMATTER[locale] ?? DATE_FORMATTER.en).format(date);
}

export function DocumentShell({
  title,
  org,
  children,
}: {
  title: string;
  org: OrgContext;
  children: React.ReactNode;
}) {
  const content = PDF_CONTENT[org.locale];

  return (
    <Page size="A4" style={pdfStyles.page}>
      <Text style={pdfStyles.headerOrg}>{org.orgName}</Text>
      <Text style={pdfStyles.headerTitle}>{title}</Text>
      <Text style={pdfStyles.headerMeta}>
        {content.disclaimer(formatPdfDate(org.generatedAt, org.locale))}
      </Text>
      <View style={pdfStyles.divider} />

      {children}

      <View style={pdfStyles.footer} fixed>
        <Text>{org.orgName}</Text>
        <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
      </View>
    </Page>
  );
}
