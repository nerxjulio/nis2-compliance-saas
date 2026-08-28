import { Document, Text, View } from "@react-pdf/renderer";
import { DocumentShell } from "./DocumentShell";
import { pdfStyles } from "./styles";
import { CLASSIFICATION_LABEL, type OrgContext } from "./types";

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
  const classificationLabel = org.classification ? CLASSIFICATION_LABEL[org.classification] : null;

  return (
      <DocumentShell title="Politique de sécurité de l'information" org={org}>
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>1. Objet et périmètre</Text>
          <Text style={pdfStyles.paragraph}>
            Cette politique définit les principes de sécurité de l&apos;information applicables à{" "}
            {org.orgName}
            {org.sector ? ` (secteur : ${org.sector})` : ""}. Elle s&apos;applique à l&apos;ensemble
            des collaborateurs, prestataires et systèmes d&apos;information de l&apos;organisation.
            {classificationLabel
              ? ` D'après le diagnostic réalisé, l'organisation est classée « ${classificationLabel} » au sens de la directive NIS2, ce qui implique la mise en œuvre des mesures de gestion des risques décrites dans ce document.`
              : ""}
          </Text>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>2. Principes généraux</Text>
          <Bullet>
            La sécurité de l&apos;information est une responsabilité partagée par tous les
            collaborateurs, pas uniquement par la fonction IT.
          </Bullet>
          <Bullet>
            L&apos;accès aux systèmes et données est accordé selon le principe du moindre
            privilège : chacun n&apos;accède qu&apos;à ce qui est nécessaire à son rôle.
          </Bullet>
          <Bullet>
            Toute donnée critique ou personnelle fait l&apos;objet de sauvegardes régulières et,
            lorsque pertinent, d&apos;un chiffrement au repos et en transit.
          </Bullet>
          <Bullet>
            Tout incident de sécurité, avéré ou suspecté, doit être signalé immédiatement au
            responsable désigné.
          </Bullet>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>3. Rôles et responsabilités</Text>
          <Text style={pdfStyles.paragraph}>
            La direction de {org.orgName} porte la responsabilité finale de la sécurité de
            l&apos;information et alloue les moyens nécessaires à sa mise en œuvre. Un responsable
            de la sécurité de l&apos;information (interne ou prestataire) est désigné comme point
            de contact opérationnel et référent pour les autorités compétentes.
          </Text>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>4. Gestion des accès</Text>
          <Bullet>
            L&apos;authentification à plusieurs facteurs (MFA) est requise sur les accès jugés
            critiques (messagerie, VPN, comptes à privilèges, outils cloud).
          </Bullet>
          <Bullet>
            Les droits d&apos;accès sont revus périodiquement et révoqués sans délai au départ
            d&apos;un collaborateur ou d&apos;un prestataire.
          </Bullet>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>5. Gestion des incidents</Text>
          <Text style={pdfStyles.paragraph}>
            Les modalités de détection, de qualification et de notification des incidents de
            sécurité sont détaillées dans le plan de gestion des incidents de l&apos;organisation,
            document distinct de la présente politique.
          </Text>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>6. Révision</Text>
          <Text style={pdfStyles.paragraph}>
            Cette politique est revue au minimum une fois par an, ou à la suite d&apos;un
            changement significatif de l&apos;activité, des systèmes d&apos;information, ou d&apos;un
            incident majeur.
          </Text>
        </View>
      </DocumentShell>
  );
}

export function PolitiqueSecuritePdf({ org }: { org: OrgContext }) {
  return (
    <Document title={`Politique de sécurité — ${org.orgName}`}>
      <PolitiqueSecuriteSection org={org} />
    </Document>
  );
}
