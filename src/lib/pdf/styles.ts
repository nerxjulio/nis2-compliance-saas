import { StyleSheet } from "@react-pdf/renderer";

// Palette et typographie partagées par tous les documents générés — sobre et
// professionnel, cohérent avec le positionnement "rassurant" du produit.
export const pdfStyles = StyleSheet.create({
  page: {
    paddingTop: 56,
    paddingBottom: 48,
    paddingHorizontal: 48,
    fontSize: 10.5,
    fontFamily: "Helvetica",
    color: "#1f2937",
  },
  headerOrg: {
    fontSize: 9,
    color: "#6b7280",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginTop: 4,
    marginBottom: 2,
  },
  headerMeta: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 20,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    color: "#111827",
  },
  paragraph: {
    marginBottom: 6,
    lineHeight: 1.5,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bulletDot: {
    width: 12,
    fontSize: 10.5,
  },
  bulletText: {
    flex: 1,
    lineHeight: 1.5,
  },
  table: {
    marginTop: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 6,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    paddingVertical: 6,
    fontFamily: "Helvetica-Bold",
  },
  tableCell: {
    paddingHorizontal: 4,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    fontSize: 8,
    color: "#9ca3af",
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 6,
  },
});
