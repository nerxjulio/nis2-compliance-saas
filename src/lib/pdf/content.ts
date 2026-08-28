import type { Locale } from "@/i18n/routing";

type Risk = {
  risque: string;
  probabilite: string;
  impact: string;
  niveau: string;
  mesures: string;
};

export type PdfContent = {
  disclaimer: (date: string) => string;
  documentTypeTitles: {
    politique_securite: string;
    registre_risques: string;
    plan_gestion_incidents: string;
  };
  classificationLabel: Record<string, string>;
  politiqueSecurite: {
    objetTitle: string;
    objetText: (orgName: string, sectorSuffix: string, classificationSuffix: string) => string;
    principesTitle: string;
    principes: string[];
    rolesTitle: string;
    rolesText: (orgName: string) => string;
    accesTitle: string;
    acces: string[];
    incidentsTitle: string;
    incidentsText: string;
    revisionTitle: string;
    revisionText: string;
  };
  registreRisques: {
    intro: (orgName: string) => string;
    colRisque: string;
    colProba: string;
    colImpact: string;
    colNiveau: string;
    colMesures: string;
    risks: Risk[];
  };
  planIncidents: {
    objectifTitle: string;
    objectifText: (orgName: string) => string;
    etapesTitle: string;
    etapes: { label: string; text: string }[];
    delaisTitle: string;
    delaisIntro: string;
    delais: { label: string; text: string }[];
    rolesTitle: string;
    rolesText: string;
  };
  dossier: {
    coverLabel: string;
    statutLabel: string;
    secteurLabel: string;
    avancementLabel: string;
    actionsWord: string;
    checklistTitle: string;
    checklistIntro: (date: string) => string;
    colCategorie: string;
    colAction: string;
    colPriorite: string;
    colStatut: string;
    statusLabel: Record<string, string>;
  };
};

export const PDF_CONTENT: Record<Locale, PdfContent> = {
  en: {
    disclaimer: (date) =>
      `Generated on ${date} with NIS2Ready — working draft to review and approve by a responsible person in the organization.`,
    documentTypeTitles: {
      politique_securite: "Information security policy",
      registre_risques: "Risk register",
      plan_gestion_incidents: "Incident response plan",
    },
    classificationLabel: {
      essentielle: "Essential entity",
      importante: "Important entity",
      hors_champ: "Out of scope for NIS2",
    },
    politiqueSecurite: {
      objetTitle: "1. Purpose and scope",
      objetText: (orgName, sectorSuffix, classificationSuffix) =>
        `This policy defines the information security principles applicable to ${orgName}${sectorSuffix}. It applies to all staff, contractors, and information systems of the organization.${classificationSuffix}`,
      principesTitle: "2. General principles",
      principes: [
        "Information security is a shared responsibility across all staff, not just the IT function.",
        "Access to systems and data is granted on a least-privilege basis: everyone only accesses what their role requires.",
        "All critical or personal data is regularly backed up and, where relevant, encrypted at rest and in transit.",
        "Any security incident, confirmed or suspected, must be reported immediately to the designated officer.",
      ],
      rolesTitle: "3. Roles and responsibilities",
      rolesText: (orgName) =>
        `${orgName}'s management holds ultimate responsibility for information security and allocates the resources needed to implement it. An information security officer (internal or external) is appointed as the operational point of contact and liaison with the competent authorities.`,
      accesTitle: "4. Access management",
      acces: [
        "Multi-factor authentication (MFA) is required for critical access: email, VPN, privileged accounts, cloud tools.",
        "Access rights are reviewed periodically and revoked without delay when a staff member or contractor leaves.",
      ],
      incidentsTitle: "5. Incident management",
      incidentsText:
        "The procedures for detecting, triaging, and notifying security incidents are detailed in the organization's incident response plan, a separate document from this policy.",
      revisionTitle: "6. Review",
      revisionText:
        "This policy is reviewed at least once a year, or following a significant change to the business, information systems, or a major incident.",
    },
    registreRisques: {
      intro: (orgName) =>
        `This register lists generic information security risks for ${orgName}. It's a starting point: each risk should be reviewed, adjusted, and complemented with risks specific to the organization's activity.`,
      colRisque: "Risk",
      colProba: "Probability",
      colImpact: "Impact",
      colNiveau: "Level",
      colMesures: "Measures",
      risks: [
        { risque: "Cyberattack (ransomware, phishing)", probabilite: "High", impact: "High", niveau: "Critical", mesures: "MFA, tested backups, staff awareness" },
        { risque: "Unauthorized access to systems", probabilite: "Medium", impact: "High", niveau: "High", mesures: "Strong authentication, least privilege" },
        { risque: "Hardware failure or data loss", probabilite: "Medium", impact: "High", niveau: "High", mesures: "Regular, tested backups, redundancy" },
        { risque: "Failure of a critical supplier", probabilite: "Medium", impact: "High", niveau: "High", mesures: "Contractual security clauses, continuity plan" },
        { risque: "Extended system unavailability", probabilite: "Low", impact: "High", niveau: "Medium", mesures: "Disaster recovery plan (DRP), redundancy" },
        { risque: "Human error (mishandling, wrong recipient)", probabilite: "High", impact: "Medium", niveau: "Medium", mesures: "Training, access control, dual approval" },
        { risque: "Personal data breach", probabilite: "Medium", impact: "High", niveau: "High", mesures: "Encryption, access control, GDPR compliance" },
      ],
    },
    planIncidents: {
      objectifTitle: "1. Objective",
      objectifText: (orgName) =>
        `This plan describes the procedure to be followed by ${orgName} in the event of a security incident affecting its information systems, in order to limit its impact and comply with the notification obligations set out in the NIS2 directive.`,
      etapesTitle: "2. Handling steps",
      etapes: [
        { label: "Detection", text: "identifying abnormal behavior (technical alert, report from a staff member, customer, or supplier)." },
        { label: "Triage", text: "assessing the nature and severity of the incident by the designated officer." },
        { label: "Containment", text: "immediate measures to limit spread (isolating affected systems, changing compromised credentials)." },
        { label: "Notification", text: "informing the competent authorities and, if necessary, affected individuals, within the regulatory deadlines (see section 3)." },
        { label: "Remediation", text: "fixing the root cause and restoring affected systems." },
        { label: "Post-incident review", text: "post-incident analysis and updating security measures to prevent recurrence." },
      ],
      delaisTitle: "3. NIS2 notification deadlines",
      delaisIntro:
        "For any significant incident, the NIS2 directive requires the following deadlines with the competent authority:",
      delais: [
        { label: "24 hours", text: "early warning reporting the incident and, where applicable, a suspicion of malicious origin." },
        { label: "72 hours", text: "detailed notification including an initial assessment of severity and impact." },
        { label: "1 month", text: "final report including a detailed description, likely cause, mitigation measures taken, and any cross-border impact." },
      ],
      rolesTitle: "4. Roles and contacts",
      rolesText:
        "To be completed with internal contact details: information security officer, management, IT provider if applicable, and the competent authority's contact.",
    },
    dossier: {
      coverLabel: "Compliance audit package",
      statutLabel: "NIS2 status",
      secteurLabel: "Sector",
      avancementLabel: "Checklist progress",
      actionsWord: "actions",
      checklistTitle: "Compliance checklist",
      checklistIntro: (date) => `Progress status as of ${date}.`,
      colCategorie: "Category",
      colAction: "Action",
      colPriorite: "Priority",
      colStatut: "Status",
      statusLabel: { todo: "To do", in_progress: "In progress", done: "Done" },
    },
  },
  fr: {
    disclaimer: (date) =>
      `Généré le ${date} avec NIS2Ready — document de travail à relire et valider par un responsable de l'organisation.`,
    documentTypeTitles: {
      politique_securite: "Politique de sécurité de l'information",
      registre_risques: "Registre des risques",
      plan_gestion_incidents: "Plan de gestion des incidents",
    },
    classificationLabel: {
      essentielle: "Entité essentielle",
      importante: "Entité importante",
      hors_champ: "Hors champ NIS2",
    },
    politiqueSecurite: {
      objetTitle: "1. Objet et périmètre",
      objetText: (orgName, sectorSuffix, classificationSuffix) =>
        `Cette politique définit les principes de sécurité de l'information applicables à ${orgName}${sectorSuffix}. Elle s'applique à l'ensemble des collaborateurs, prestataires et systèmes d'information de l'organisation.${classificationSuffix}`,
      principesTitle: "2. Principes généraux",
      principes: [
        "La sécurité de l'information est une responsabilité partagée par tous les collaborateurs, pas uniquement par la fonction IT.",
        "L'accès aux systèmes et données est accordé selon le principe du moindre privilège : chacun n'accède qu'à ce qui est nécessaire à son rôle.",
        "Toute donnée critique ou personnelle fait l'objet de sauvegardes régulières et, lorsque pertinent, d'un chiffrement au repos et en transit.",
        "Tout incident de sécurité, avéré ou suspecté, doit être signalé immédiatement au responsable désigné.",
      ],
      rolesTitle: "3. Rôles et responsabilités",
      rolesText: (orgName) =>
        `La direction de ${orgName} porte la responsabilité finale de la sécurité de l'information et alloue les moyens nécessaires à sa mise en œuvre. Un responsable de la sécurité de l'information (interne ou prestataire) est désigné comme point de contact opérationnel et référent pour les autorités compétentes.`,
      accesTitle: "4. Gestion des accès",
      acces: [
        "L'authentification à plusieurs facteurs (MFA) est requise sur les accès jugés critiques (messagerie, VPN, comptes à privilèges, outils cloud).",
        "Les droits d'accès sont revus périodiquement et révoqués sans délai au départ d'un collaborateur ou d'un prestataire.",
      ],
      incidentsTitle: "5. Gestion des incidents",
      incidentsText:
        "Les modalités de détection, de qualification et de notification des incidents de sécurité sont détaillées dans le plan de gestion des incidents de l'organisation, document distinct de la présente politique.",
      revisionTitle: "6. Révision",
      revisionText:
        "Cette politique est revue au minimum une fois par an, ou à la suite d'un changement significatif de l'activité, des systèmes d'information, ou d'un incident majeur.",
    },
    registreRisques: {
      intro: (orgName) =>
        `Ce registre recense les risques génériques liés à la sécurité de l'information pour ${orgName}. Il constitue un point de départ : chaque risque doit être revu, ajusté et complété par des risques spécifiques à l'activité de l'organisation.`,
      colRisque: "Risque",
      colProba: "Probabilité",
      colImpact: "Impact",
      colNiveau: "Niveau",
      colMesures: "Mesures",
      risks: [
        { risque: "Cyberattaque (rançongiciel, hameçonnage)", probabilite: "Élevée", impact: "Élevé", niveau: "Critique", mesures: "MFA, sauvegardes testées, sensibilisation des équipes" },
        { risque: "Accès non autorisé aux systèmes", probabilite: "Moyenne", impact: "Élevé", niveau: "Élevé", mesures: "Authentification forte, principe du moindre privilège" },
        { risque: "Panne matérielle ou perte de données", probabilite: "Moyenne", impact: "Élevé", niveau: "Élevé", mesures: "Sauvegardes régulières et testées, redondance" },
        { risque: "Défaillance d'un prestataire critique", probabilite: "Moyenne", impact: "Élevé", niveau: "Élevé", mesures: "Clauses de sécurité contractuelles, plan de continuité" },
        { risque: "Indisponibilité prolongée des systèmes", probabilite: "Faible", impact: "Élevé", niveau: "Moyen", mesures: "Plan de reprise d'activité (PRA), redondance" },
        { risque: "Erreur humaine (manipulation, envoi erroné)", probabilite: "Élevée", impact: "Moyen", niveau: "Moyen", mesures: "Formation régulière, contrôle d'accès, double validation" },
        { risque: "Fuite de données personnelles", probabilite: "Moyenne", impact: "Élevé", niveau: "Élevé", mesures: "Chiffrement, contrôle d'accès, conformité RGPD" },
      ],
    },
    planIncidents: {
      objectifTitle: "1. Objectif",
      objectifText: (orgName) =>
        `Ce plan décrit la procédure à suivre par ${orgName} en cas d'incident de sécurité affectant ses systèmes d'information, afin de limiter son impact et de respecter les obligations de notification prévues par la directive NIS2.`,
      etapesTitle: "2. Étapes de traitement",
      etapes: [
        { label: "Détection", text: "repérage d'un comportement anormal (alerte technique, signalement d'un collaborateur, d'un client ou d'un prestataire)." },
        { label: "Qualification", text: "évaluation de la nature et de la gravité de l'incident par le responsable désigné." },
        { label: "Confinement", text: "mesures immédiates pour limiter la propagation (isolement des systèmes touchés, changement des accès compromis)." },
        { label: "Notification", text: "information des autorités compétentes et, si nécessaire, des personnes concernées, dans les délais réglementaires (voir section 3)." },
        { label: "Remédiation", text: "correction de la cause racine et restauration des systèmes affectés." },
        { label: "Retour d'expérience", text: "analyse post-incident et mise à jour des mesures de sécurité pour éviter la récurrence." },
      ],
      delaisTitle: "3. Délais de notification NIS2",
      delaisIntro:
        "Pour tout incident significatif, la directive NIS2 impose les délais suivants auprès de l'autorité compétente :",
      delais: [
        { label: "24 heures", text: "alerte précoce signalant l'incident et, le cas échéant, une suspicion d'origine malveillante." },
        { label: "72 heures", text: "notification détaillée incluant une première évaluation de la gravité et de l'impact." },
        { label: "1 mois", text: "rapport final incluant une description détaillée, la cause probable, les mesures d'atténuation prises et l'impact transfrontière éventuel." },
      ],
      rolesTitle: "4. Rôles et contacts",
      rolesText:
        "À compléter avec les coordonnées internes : responsable de la sécurité de l'information, direction, prestataire IT le cas échéant, et le contact de l'autorité compétente.",
    },
    dossier: {
      coverLabel: "Dossier d'audit de conformité",
      statutLabel: "Statut NIS2",
      secteurLabel: "Secteur",
      avancementLabel: "Avancement checklist",
      actionsWord: "actions",
      checklistTitle: "Checklist de conformité",
      checklistIntro: (date) => `État d'avancement au ${date}.`,
      colCategorie: "Catégorie",
      colAction: "Action",
      colPriorite: "Priorité",
      colStatut: "Statut",
      statusLabel: { todo: "À faire", in_progress: "En cours", done: "Fait" },
    },
  },
  es: {
    disclaimer: (date) =>
      `Generado el ${date} con NIS2Ready — borrador de trabajo que debe revisar y validar un responsable de la organización.`,
    documentTypeTitles: {
      politique_securite: "Política de seguridad de la información",
      registre_risques: "Registro de riesgos",
      plan_gestion_incidents: "Plan de respuesta a incidentes",
    },
    classificationLabel: {
      essentielle: "Entidad esencial",
      importante: "Entidad importante",
      hors_champ: "Fuera de alcance de NIS2",
    },
    politiqueSecurite: {
      objetTitle: "1. Objeto y alcance",
      objetText: (orgName, sectorSuffix, classificationSuffix) =>
        `Esta política define los principios de seguridad de la información aplicables a ${orgName}${sectorSuffix}. Se aplica a todo el personal, proveedores y sistemas de información de la organización.${classificationSuffix}`,
      principesTitle: "2. Principios generales",
      principes: [
        "La seguridad de la información es una responsabilidad compartida por todo el personal, no solo por el área de TI.",
        "El acceso a los sistemas y datos se concede según el principio de mínimo privilegio: cada persona solo accede a lo necesario para su función.",
        "Todo dato crítico o personal se respalda regularmente y, cuando procede, se cifra en reposo y en tránsito.",
        "Cualquier incidente de seguridad, confirmado o sospechado, debe notificarse de inmediato al responsable designado.",
      ],
      rolesTitle: "3. Roles y responsabilidades",
      rolesText: (orgName) =>
        `La dirección de ${orgName} asume la responsabilidad final de la seguridad de la información y asigna los recursos necesarios para su implementación. Se designa un responsable de seguridad de la información (interno o externo) como punto de contacto operativo y referente ante las autoridades competentes.`,
      accesTitle: "4. Gestión de accesos",
      acces: [
        "La autenticación multifactor (MFA) es obligatoria en los accesos considerados críticos (correo, VPN, cuentas con privilegios, herramientas cloud).",
        "Los permisos de acceso se revisan periódicamente y se revocan sin demora cuando un empleado o proveedor deja la organización.",
      ],
      incidentsTitle: "5. Gestión de incidentes",
      incidentsText:
        "Los procedimientos de detección, clasificación y notificación de incidentes de seguridad se detallan en el plan de respuesta a incidentes de la organización, documento independiente de esta política.",
      revisionTitle: "6. Revisión",
      revisionText:
        "Esta política se revisa como mínimo una vez al año, o tras un cambio significativo en la actividad, los sistemas de información o un incidente grave.",
    },
    registreRisques: {
      intro: (orgName) =>
        `Este registro recoge los riesgos genéricos de seguridad de la información para ${orgName}. Es un punto de partida: cada riesgo debe revisarse, ajustarse y completarse con riesgos específicos de la actividad de la organización.`,
      colRisque: "Riesgo",
      colProba: "Probabilidad",
      colImpact: "Impacto",
      colNiveau: "Nivel",
      colMesures: "Medidas",
      risks: [
        { risque: "Ciberataque (ransomware, phishing)", probabilite: "Alta", impact: "Alto", niveau: "Crítico", mesures: "MFA, copias de seguridad probadas, concienciación del personal" },
        { risque: "Acceso no autorizado a los sistemas", probabilite: "Media", impact: "Alto", niveau: "Alto", mesures: "Autenticación robusta, principio de mínimo privilegio" },
        { risque: "Avería de hardware o pérdida de datos", probabilite: "Media", impact: "Alto", niveau: "Alto", mesures: "Copias de seguridad periódicas y probadas, redundancia" },
        { risque: "Fallo de un proveedor crítico", probabilite: "Media", impact: "Alto", niveau: "Alto", mesures: "Cláusulas de seguridad contractuales, plan de continuidad" },
        { risque: "Indisponibilidad prolongada de los sistemas", probabilite: "Baja", impact: "Alto", niveau: "Medio", mesures: "Plan de recuperación ante desastres (DRP), redundancia" },
        { risque: "Error humano (manipulación, envío erróneo)", probabilite: "Alta", impact: "Medio", niveau: "Medio", mesures: "Formación regular, control de acceso, doble validación" },
        { risque: "Fuga de datos personales", probabilite: "Media", impact: "Alto", niveau: "Alto", mesures: "Cifrado, control de acceso, cumplimiento del RGPD" },
      ],
    },
    planIncidents: {
      objectifTitle: "1. Objetivo",
      objectifText: (orgName) =>
        `Este plan describe el procedimiento que debe seguir ${orgName} ante un incidente de seguridad que afecte a sus sistemas de información, con el fin de limitar su impacto y cumplir con las obligaciones de notificación previstas en la directiva NIS2.`,
      etapesTitle: "2. Etapas de gestión",
      etapes: [
        { label: "Detección", text: "identificación de un comportamiento anómalo (alerta técnica, aviso de un empleado, cliente o proveedor)." },
        { label: "Clasificación", text: "evaluación de la naturaleza y gravedad del incidente por parte del responsable designado." },
        { label: "Contención", text: "medidas inmediatas para limitar la propagación (aislamiento de los sistemas afectados, cambio de accesos comprometidos)." },
        { label: "Notificación", text: "información a las autoridades competentes y, si procede, a las personas afectadas, dentro de los plazos legales (ver sección 3)." },
        { label: "Remediación", text: "corrección de la causa raíz y restauración de los sistemas afectados." },
        { label: "Lecciones aprendidas", text: "análisis posterior al incidente y actualización de las medidas de seguridad para evitar su repetición." },
      ],
      delaisTitle: "3. Plazos de notificación NIS2",
      delaisIntro:
        "Ante cualquier incidente significativo, la directiva NIS2 impone los siguientes plazos ante la autoridad competente:",
      delais: [
        { label: "24 horas", text: "alerta temprana que notifica el incidente y, en su caso, una sospecha de origen malicioso." },
        { label: "72 horas", text: "notificación detallada que incluye una primera evaluación de la gravedad y el impacto." },
        { label: "1 mes", text: "informe final que incluye una descripción detallada, la causa probable, las medidas de mitigación adoptadas y el posible impacto transfronterizo." },
      ],
      rolesTitle: "4. Roles y contactos",
      rolesText:
        "A completar con los datos de contacto internos: responsable de seguridad de la información, dirección, proveedor de TI si procede, y el contacto de la autoridad competente.",
    },
    dossier: {
      coverLabel: "Expediente de auditoría de cumplimiento",
      statutLabel: "Estado NIS2",
      secteurLabel: "Sector",
      avancementLabel: "Progreso de la checklist",
      actionsWord: "acciones",
      checklistTitle: "Checklist de cumplimiento",
      checklistIntro: (date) => `Estado de avance a fecha de ${date}.`,
      colCategorie: "Categoría",
      colAction: "Acción",
      colPriorite: "Prioridad",
      colStatut: "Estado",
      statusLabel: { todo: "Pendiente", in_progress: "En curso", done: "Hecho" },
    },
  },
  de: {
    disclaimer: (date) =>
      `Erstellt am ${date} mit NIS2Ready — Arbeitsentwurf, der von einer verantwortlichen Person der Organisation geprüft und freigegeben werden muss.`,
    documentTypeTitles: {
      politique_securite: "Informationssicherheitsrichtlinie",
      registre_risques: "Risikoregister",
      plan_gestion_incidents: "Vorfallreaktionsplan",
    },
    classificationLabel: {
      essentielle: "Wesentliche Einrichtung",
      importante: "Wichtige Einrichtung",
      hors_champ: "Nicht von NIS2 betroffen",
    },
    politiqueSecurite: {
      objetTitle: "1. Zweck und Geltungsbereich",
      objetText: (orgName, sectorSuffix, classificationSuffix) =>
        `Diese Richtlinie legt die Grundsätze der Informationssicherheit fest, die für ${orgName}${sectorSuffix} gelten. Sie gilt für alle Mitarbeitenden, Dienstleister und Informationssysteme der Organisation.${classificationSuffix}`,
      principesTitle: "2. Allgemeine Grundsätze",
      principes: [
        "Informationssicherheit ist eine gemeinsame Verantwortung aller Mitarbeitenden, nicht nur der IT-Funktion.",
        "Der Zugriff auf Systeme und Daten wird nach dem Prinzip der geringsten Rechte gewährt: Jeder hat nur Zugriff auf das, was für seine Rolle notwendig ist.",
        "Alle kritischen oder personenbezogenen Daten werden regelmäßig gesichert und, wo relevant, im Ruhezustand und bei der Übertragung verschlüsselt.",
        "Jeder bestätigte oder vermutete Sicherheitsvorfall muss unverzüglich der benannten verantwortlichen Person gemeldet werden.",
      ],
      rolesTitle: "3. Rollen und Verantwortlichkeiten",
      rolesText: (orgName) =>
        `Die Geschäftsführung von ${orgName} trägt die letztendliche Verantwortung für die Informationssicherheit und stellt die für ihre Umsetzung erforderlichen Mittel bereit. Ein Informationssicherheitsbeauftragter (intern oder extern) wird als operative Ansprechperson und Kontakt für die zuständigen Behörden benannt.`,
      accesTitle: "4. Zugriffsverwaltung",
      acces: [
        "Für als kritisch eingestufte Zugänge (E-Mail, VPN, privilegierte Konten, Cloud-Tools) ist eine Multi-Faktor-Authentifizierung (MFA) erforderlich.",
        "Zugriffsrechte werden regelmäßig überprüft und beim Ausscheiden eines Mitarbeitenden oder Dienstleisters unverzüglich entzogen.",
      ],
      incidentsTitle: "5. Vorfallmanagement",
      incidentsText:
        "Die Verfahren zur Erkennung, Einstufung und Meldung von Sicherheitsvorfällen sind im Vorfallreaktionsplan der Organisation festgelegt, einem von dieser Richtlinie getrennten Dokument.",
      revisionTitle: "6. Überprüfung",
      revisionText:
        "Diese Richtlinie wird mindestens einmal jährlich überprüft, oder nach einer wesentlichen Änderung der Geschäftstätigkeit, der Informationssysteme oder nach einem schwerwiegenden Vorfall.",
    },
    registreRisques: {
      intro: (orgName) =>
        `Dieses Register erfasst die allgemeinen Informationssicherheitsrisiken für ${orgName}. Es ist ein Ausgangspunkt: Jedes Risiko sollte überprüft, angepasst und um für die Tätigkeit der Organisation spezifische Risiken ergänzt werden.`,
      colRisque: "Risiko",
      colProba: "Wahrscheinlichkeit",
      colImpact: "Auswirkung",
      colNiveau: "Stufe",
      colMesures: "Maßnahmen",
      risks: [
        { risque: "Cyberangriff (Ransomware, Phishing)", probabilite: "Hoch", impact: "Hoch", niveau: "Kritisch", mesures: "MFA, getestete Backups, Sensibilisierung der Mitarbeitenden" },
        { risque: "Unbefugter Zugriff auf Systeme", probabilite: "Mittel", impact: "Hoch", niveau: "Hoch", mesures: "Starke Authentifizierung, Prinzip der geringsten Rechte" },
        { risque: "Hardwareausfall oder Datenverlust", probabilite: "Mittel", impact: "Hoch", niveau: "Hoch", mesures: "Regelmäßige, getestete Backups, Redundanz" },
        { risque: "Ausfall eines kritischen Dienstleisters", probabilite: "Mittel", impact: "Hoch", niveau: "Hoch", mesures: "Vertragliche Sicherheitsklauseln, Kontinuitätsplan" },
        { risque: "Längere Nichtverfügbarkeit von Systemen", probabilite: "Niedrig", impact: "Hoch", niveau: "Mittel", mesures: "Notfallwiederherstellungsplan (DRP), Redundanz" },
        { risque: "Menschlicher Fehler (Fehlbedienung, falscher Empfänger)", probabilite: "Hoch", impact: "Mittel", niveau: "Mittel", mesures: "Regelmäßige Schulung, Zugriffskontrolle, Vier-Augen-Prinzip" },
        { risque: "Verletzung des Schutzes personenbezogener Daten", probabilite: "Mittel", impact: "Hoch", niveau: "Hoch", mesures: "Verschlüsselung, Zugriffskontrolle, DSGVO-Konformität" },
      ],
    },
    planIncidents: {
      objectifTitle: "1. Zielsetzung",
      objectifText: (orgName) =>
        `Dieser Plan beschreibt das Verfahren, das ${orgName} bei einem Sicherheitsvorfall in seinen Informationssystemen befolgen muss, um dessen Auswirkungen zu begrenzen und die in der NIS2-Richtlinie vorgesehenen Meldepflichten einzuhalten.`,
      etapesTitle: "2. Bearbeitungsschritte",
      etapes: [
        { label: "Erkennung", text: "Feststellung eines auffälligen Verhaltens (technischer Alarm, Meldung durch Mitarbeitende, Kunden oder Dienstleister)." },
        { label: "Einstufung", text: "Bewertung von Art und Schwere des Vorfalls durch die benannte verantwortliche Person." },
        { label: "Eindämmung", text: "Sofortmaßnahmen zur Begrenzung der Ausbreitung (Isolierung betroffener Systeme, Änderung kompromittierter Zugangsdaten)." },
        { label: "Meldung", text: "Information der zuständigen Behörden und, falls erforderlich, betroffener Personen innerhalb der gesetzlichen Fristen (siehe Abschnitt 3)." },
        { label: "Behebung", text: "Beseitigung der Grundursache und Wiederherstellung der betroffenen Systeme." },
        { label: "Nachbereitung", text: "Analyse nach dem Vorfall und Aktualisierung der Sicherheitsmaßnahmen, um eine Wiederholung zu vermeiden." },
      ],
      delaisTitle: "3. NIS2-Meldefristen",
      delaisIntro:
        "Bei jedem erheblichen Vorfall schreibt die NIS2-Richtlinie folgende Fristen gegenüber der zuständigen Behörde vor:",
      delais: [
        { label: "24 Stunden", text: "Frühwarnung, die den Vorfall meldet und gegebenenfalls einen Verdacht auf böswilligen Ursprung angibt." },
        { label: "72 Stunden", text: "detaillierte Meldung mit einer ersten Einschätzung von Schwere und Auswirkung." },
        { label: "1 Monat", text: "Abschlussbericht mit einer detaillierten Beschreibung, der wahrscheinlichen Ursache, den ergriffenen Abhilfemaßnahmen und etwaigen grenzüberschreitenden Auswirkungen." },
      ],
      rolesTitle: "4. Rollen und Kontakte",
      rolesText:
        "Zu ergänzen mit internen Kontaktdaten: Informationssicherheitsbeauftragter, Geschäftsführung, IT-Dienstleister falls zutreffend, sowie der Kontakt der zuständigen Behörde.",
    },
    dossier: {
      coverLabel: "Compliance-Audit-Paket",
      statutLabel: "NIS2-Status",
      secteurLabel: "Branche",
      avancementLabel: "Checklisten-Fortschritt",
      actionsWord: "Maßnahmen",
      checklistTitle: "Compliance-Checkliste",
      checklistIntro: (date) => `Fortschrittsstatus zum ${date}.`,
      colCategorie: "Kategorie",
      colAction: "Maßnahme",
      colPriorite: "Priorität",
      colStatut: "Status",
      statusLabel: { todo: "Offen", in_progress: "In Bearbeitung", done: "Erledigt" },
    },
  },
};
