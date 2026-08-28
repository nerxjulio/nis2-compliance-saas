import { Document, Text, View } from "@react-pdf/renderer";
import { DocumentShell } from "./DocumentShell";
import { pdfStyles } from "./styles";
import type { OrgContext } from "./types";

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={pdfStyles.bullet}>
      <Text style={pdfStyles.bulletDot}>•</Text>
      <Text style={pdfStyles.bulletText}>{children}</Text>
    </View>
  );
}

export function PlanIncidentsPdf({ org }: { org: OrgContext }) {
  return (
    <Document title={`Plan de gestion des incidents — ${org.orgName}`}>
      <DocumentShell title="Plan de gestion des incidents" org={org}>
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>1. Objectif</Text>
          <Text style={pdfStyles.paragraph}>
            Ce plan décrit la procédure à suivre par {org.orgName} en cas d&apos;incident de
            sécurité affectant ses systèmes d&apos;information, afin de limiter son impact et de
            respecter les obligations de notification prévues par la directive NIS2.
          </Text>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>2. Étapes de traitement</Text>
          <Bullet>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>Détection</Text> — repérage d&apos;un
            comportement anormal (alerte technique, signalement d&apos;un collaborateur, d&apos;un
            client ou d&apos;un prestataire).
          </Bullet>
          <Bullet>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>Qualification</Text> — évaluation de la
            nature et de la gravité de l&apos;incident par le responsable désigné.
          </Bullet>
          <Bullet>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>Confinement</Text> — mesures immédiates
            pour limiter la propagation (isolement des systèmes touchés, changement des accès
            compromis).
          </Bullet>
          <Bullet>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>Notification</Text> — information des
            autorités compétentes et, si nécessaire, des personnes concernées, dans les délais
            réglementaires (voir section 3).
          </Bullet>
          <Bullet>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>Remédiation</Text> — correction de la
            cause racine et restauration des systèmes affectés.
          </Bullet>
          <Bullet>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>Retour d&apos;expérience</Text> —
            analyse post-incident et mise à jour des mesures de sécurité pour éviter la
            récurrence.
          </Bullet>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>3. Délais de notification NIS2</Text>
          <Text style={pdfStyles.paragraph}>
            Pour tout incident significatif, la directive NIS2 impose les délais suivants auprès
            de l&apos;autorité compétente (ANSSI en France) :
          </Text>
          <Bullet>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>24 heures</Text> — alerte précoce
            signalant l&apos;incident et, le cas échéant, une suspicion d&apos;origine malveillante.
          </Bullet>
          <Bullet>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>72 heures</Text> — notification détaillée
            incluant une première évaluation de la gravité et de l&apos;impact.
          </Bullet>
          <Bullet>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>1 mois</Text> — rapport final incluant
            une description détaillée, la cause probable, les mesures d&apos;atténuation prises et
            l&apos;impact transfrontière éventuel.
          </Bullet>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>4. Rôles et contacts</Text>
          <Text style={pdfStyles.paragraph}>
            À compléter avec les coordonnées internes : responsable de la sécurité de
            l&apos;information, direction, prestataire IT le cas échéant, et le contact de
            l&apos;autorité compétente (cert.ssi.gouv.fr pour l&apos;ANSSI en France).
          </Text>
        </View>
      </DocumentShell>
    </Document>
  );
}
