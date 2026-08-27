-- Checklist NIS2 — items dérivés des mesures de gestion des risques de l'article 21(2)
-- de la directive (UE) 2022/2555, reformulés en actions concrètes pour une PME/ETI.
-- Table de référence globale, lue par tous les utilisateurs authentifiés (cf. policy
-- checklist_templates_read_all posée dans 0001_init.sql).

insert into checklist_templates (framework, category, title, description, priority, sort_order) values
-- a) Analyse des risques et politique de sécurité
('NIS2', 'Gouvernance', 'Désigner un responsable de la sécurité de l''information', 'Nomme une personne (interne ou prestataire) responsable de piloter la conformité NIS2 — point de contact unique pour les autorités et en interne.', 'haute', 10),
('NIS2', 'Gouvernance', 'Rédiger une politique de sécurité de l''information', 'Document formalisant les règles de sécurité applicables à l''organisation (accès, mots de passe, usage du matériel, etc.), validé par la direction.', 'haute', 20),
('NIS2', 'Gouvernance', 'Réaliser une analyse des risques', 'Identifier les systèmes critiques, les menaces principales et évaluer leur impact potentiel sur l''activité.', 'haute', 30),

-- b) Gestion des incidents
('NIS2', 'Gestion des incidents', 'Mettre en place une procédure de détection et réponse aux incidents', 'Définir qui fait quoi en cas d''incident de sécurité : détection, qualification, escalade, remédiation.', 'haute', 40),
('NIS2', 'Gestion des incidents', 'Connaître les délais de notification obligatoires', 'Alerte précoce sous 24h, notification sous 72h, rapport final sous 1 mois auprès de l''autorité compétente (ANSSI en France) en cas d''incident significatif.', 'haute', 50),
('NIS2', 'Gestion des incidents', 'Tenir un registre des incidents de sécurité', 'Historique daté des incidents rencontrés, actions prises et enseignements tirés — sert aussi de preuve d''audit.', 'moyenne', 60),

-- c) Continuité d'activité
('NIS2', 'Continuité d''activité', 'Mettre en place des sauvegardes régulières et testées', 'Sauvegardes automatiques des données critiques, stockées séparément du système principal, avec des restaurations testées périodiquement.', 'haute', 70),
('NIS2', 'Continuité d''activité', 'Rédiger un plan de reprise d''activité (PRA)', 'Procédure documentée pour remettre en service les systèmes critiques après un incident majeur (panne, ransomware, sinistre).', 'moyenne', 80),
('NIS2', 'Continuité d''activité', 'Définir un plan de gestion de crise', 'Qui décide, qui communique, avec quels moyens de secours si les outils habituels (email, téléphonie) sont indisponibles.', 'moyenne', 90),

-- d) Chaîne d'approvisionnement
('NIS2', 'Chaîne d''approvisionnement', 'Recenser les prestataires et fournisseurs critiques', 'Liste des tiers ayant accès à tes systèmes ou données (hébergeur, éditeur logiciel, sous-traitant IT).', 'moyenne', 100),
('NIS2', 'Chaîne d''approvisionnement', 'Intégrer des exigences de sécurité dans les contrats fournisseurs', 'Clauses de sécurité minimales (notification d''incident, droit d''audit) dans les contrats avec les prestataires critiques.', 'basse', 110),

-- e) Sécurité des systèmes (acquisition, développement, maintenance)
('NIS2', 'Sécurité des systèmes', 'Maintenir les systèmes et logiciels à jour', 'Politique de mise à jour et de correctifs de sécurité (patchs) sur les postes, serveurs et logiciels utilisés.', 'haute', 120),
('NIS2', 'Sécurité des systèmes', 'Gérer les vulnérabilités connues', 'Processus pour identifier et corriger les failles de sécurité des systèmes exposés (scan de vulnérabilités, veille sécurité).', 'moyenne', 130),

-- f) Évaluation de l'efficacité
('NIS2', 'Évaluation', 'Auditer périodiquement les mesures de sécurité en place', 'Contrôle régulier (interne ou externe) de l''efficacité réelle des mesures mises en œuvre.', 'basse', 140),

-- g) Hygiène informatique et formation
('NIS2', 'Sensibilisation', 'Former les équipes aux bonnes pratiques de cybersécurité', 'Sensibilisation régulière (phishing, mots de passe, usage du matériel pro) pour tous les collaborateurs, pas seulement l''IT.', 'haute', 150),
('NIS2', 'Sensibilisation', 'Définir des règles d''hygiène informatique de base', 'Verrouillage automatique des postes, interdiction d''installer des logiciels non autorisés, gestion des droits administrateur.', 'moyenne', 160),

-- h) Cryptographie
('NIS2', 'Chiffrement', 'Chiffrer les données sensibles au repos et en transit', 'Chiffrement des disques, des sauvegardes et des échanges (HTTPS, VPN) contenant des données critiques ou personnelles.', 'moyenne', 170),

-- i) Sécurité RH, contrôle d'accès, gestion des actifs
('NIS2', 'Contrôle d''accès', 'Appliquer le principe du moindre privilège', 'Chaque utilisateur n''a accès qu''aux systèmes et données nécessaires à son rôle — revue périodique des droits.', 'haute', 180),
('NIS2', 'Contrôle d''accès', 'Tenir un inventaire des équipements et comptes actifs', 'Liste à jour des postes, serveurs et comptes utilisateurs, avec révocation systématique au départ d''un collaborateur.', 'moyenne', 190),
('NIS2', 'Contrôle d''accès', 'Procédure de sécurité liée aux départs et arrivées', 'Désactivation des accès dès le dernier jour d''un salarié, remise du matériel, changement des mots de passe partagés.', 'basse', 200),

-- j) Authentification forte
('NIS2', 'Authentification', 'Activer l''authentification à plusieurs facteurs (MFA)', 'MFA sur tous les accès critiques : messagerie, VPN, comptes administrateur, outils cloud.', 'haute', 210),
('NIS2', 'Authentification', 'Sécuriser les communications d''urgence', 'Prévoir un moyen de communication de secours (hors email/téléphonie habituels) en cas de compromission des outils principaux.', 'basse', 220);
