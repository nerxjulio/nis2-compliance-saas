import { Page, Text, View } from "@react-pdf/renderer";
import { pdfStyles } from "./styles";
import type { OrgContext } from "./types";

const DATE_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function DocumentShell({
  title,
  org,
  children,
}: {
  title: string;
  org: OrgContext;
  children: React.ReactNode;
}) {
  return (
    <Page size="A4" style={pdfStyles.page}>
      <Text style={pdfStyles.headerOrg}>{org.orgName}</Text>
      <Text style={pdfStyles.headerTitle}>{title}</Text>
      <Text style={pdfStyles.headerMeta}>
        Généré le {DATE_FORMATTER.format(org.generatedAt)} avec NIS2Ready — document de travail à
        relire et valider par un responsable de l&apos;organisation.
      </Text>
      <View style={pdfStyles.divider} />

      {children}

      <View style={pdfStyles.footer} fixed>
        <Text>{org.orgName}</Text>
        <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
      </View>
    </Page>
  );
}
