-- Les libellés de checklist_templates (category/title/description) étaient en français en
-- dur. Pour l'internationalisation, on ajoute un identifiant stable (slug) : la structure
-- (id, priorité, ordre, framework) reste en base, le texte affiché vit dans messages/*.json
-- côté app, indexé par ce slug. On préserve les UUID existants (donc les progressions déjà
-- enregistrées dans org_checklist_progress) plutôt que de retronquer/réinsérer la table.
alter table checklist_templates add column if not exists slug text;

update checklist_templates set slug = 'designate-security-officer' where title = 'Désigner un responsable de la sécurité de l''information';
update checklist_templates set slug = 'write-security-policy' where title = 'Rédiger une politique de sécurité de l''information';
update checklist_templates set slug = 'risk-assessment' where title = 'Réaliser une analyse des risques';
update checklist_templates set slug = 'incident-response-procedure' where title = 'Mettre en place une procédure de détection et réponse aux incidents';
update checklist_templates set slug = 'notification-deadlines' where title = 'Connaître les délais de notification obligatoires';
update checklist_templates set slug = 'incident-log' where title = 'Tenir un registre des incidents de sécurité';
update checklist_templates set slug = 'backups' where title = 'Mettre en place des sauvegardes régulières et testées';
update checklist_templates set slug = 'disaster-recovery-plan' where title = 'Rédiger un plan de reprise d''activité (PRA)';
update checklist_templates set slug = 'crisis-management-plan' where title = 'Définir un plan de gestion de crise';
update checklist_templates set slug = 'supplier-inventory' where title = 'Recenser les prestataires et fournisseurs critiques';
update checklist_templates set slug = 'supplier-contract-clauses' where title = 'Intégrer des exigences de sécurité dans les contrats fournisseurs';
update checklist_templates set slug = 'system-updates' where title = 'Maintenir les systèmes et logiciels à jour';
update checklist_templates set slug = 'vulnerability-management' where title = 'Gérer les vulnérabilités connues';
update checklist_templates set slug = 'security-audit' where title = 'Auditer périodiquement les mesures de sécurité en place';
update checklist_templates set slug = 'security-awareness-training' where title = 'Former les équipes aux bonnes pratiques de cybersécurité';
update checklist_templates set slug = 'it-hygiene-rules' where title = 'Définir des règles d''hygiène informatique de base';
update checklist_templates set slug = 'encryption' where title = 'Chiffrer les données sensibles au repos et en transit';
update checklist_templates set slug = 'least-privilege' where title = 'Appliquer le principe du moindre privilège';
update checklist_templates set slug = 'asset-inventory' where title = 'Tenir un inventaire des équipements et comptes actifs';
update checklist_templates set slug = 'offboarding-procedure' where title = 'Procédure de sécurité liée aux départs et arrivées';
update checklist_templates set slug = 'mfa' where title = 'Activer l''authentification à plusieurs facteurs (MFA)';
update checklist_templates set slug = 'emergency-communications' where title = 'Sécuriser les communications d''urgence';

alter table checklist_templates alter column slug set not null;
alter table checklist_templates add constraint checklist_templates_slug_unique unique (slug);

-- category devient elle aussi un slug (governance, incident-management, ...) plutôt que du
-- texte français, pour la même raison.
update checklist_templates set category = 'governance' where category = 'Gouvernance';
update checklist_templates set category = 'incident-management' where category = 'Gestion des incidents';
update checklist_templates set category = 'business-continuity' where category = 'Continuité d''activité';
update checklist_templates set category = 'supply-chain' where category = 'Chaîne d''approvisionnement';
update checklist_templates set category = 'system-security' where category = 'Sécurité des systèmes';
update checklist_templates set category = 'evaluation' where category = 'Évaluation';
update checklist_templates set category = 'awareness' where category = 'Sensibilisation';
update checklist_templates set category = 'encryption' where category = 'Chiffrement';
update checklist_templates set category = 'access-control' where category = 'Contrôle d''accès';
update checklist_templates set category = 'authentication' where category = 'Authentification';
