-- NIS2Ready — schéma initial (MVP)
-- Multi-tenant strict : chaque table métier porte un org_id, isolée par RLS.
-- Convention : gen_random_uuid() (pgcrypto, activé par défaut sur Supabase).

-- ─────────────────────────────────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────────────────────────────────
create type membership_role as enum ('owner', 'member');
create type compliance_framework as enum ('NIS2', 'DORA');
create type nis2_classification as enum ('essentielle', 'importante', 'hors_champ');
create type checklist_priority as enum ('haute', 'moyenne', 'basse');
create type checklist_status as enum ('todo', 'in_progress', 'done');
create type document_type as enum ('politique_securite', 'registre_risques', 'plan_gestion_incidents');
create type subscription_plan as enum ('free', 'starter', 'pro');

-- ─────────────────────────────────────────────────────────────────────────
-- TABLES
-- ─────────────────────────────────────────────────────────────────────────

-- Un profil par utilisateur Supabase Auth (créé automatiquement, cf. trigger plus bas).
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text not null,
  created_at timestamptz not null default now()
);

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sector text,
  size_band text, -- ex: '1-49', '50-249', '250-999', '1000+'
  created_by uuid not null references profiles (id),
  created_at timestamptz not null default now()
);

-- Appartenance d'un utilisateur à une organisation (base du multi-tenant).
create table memberships (
  org_id uuid not null references organizations (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  role membership_role not null default 'member',
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);

-- Réponses brutes au questionnaire de diagnostic.
create table diagnostic_responses (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  question_key text not null,
  answer jsonb not null,
  created_at timestamptz not null default now(),
  unique (org_id, question_key)
);

-- Résultat calculé du diagnostic (un par org et par référentiel).
create table diagnostic_results (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  framework compliance_framework not null,
  classification nis2_classification not null,
  score int not null default 0,
  details jsonb not null default '{}'::jsonb,
  computed_at timestamptz not null default now(),
  unique (org_id, framework)
);

-- Référentiel global des items de checklist (indépendant des organisations).
-- Rempli par seed, jamais modifié par les utilisateurs finaux.
create table checklist_templates (
  id uuid primary key default gen_random_uuid(),
  framework compliance_framework not null,
  category text not null,
  title text not null,
  description text,
  priority checklist_priority not null default 'moyenne',
  sort_order int not null default 0
);

-- Avancement d'une organisation sur chaque item de checklist.
create table org_checklist_progress (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  template_id uuid not null references checklist_templates (id) on delete cascade,
  status checklist_status not null default 'todo',
  evidence_url text,
  updated_by uuid references profiles (id),
  updated_at timestamptz not null default now(),
  unique (org_id, template_id)
);

-- Documents générés (PDF stockés dans Supabase Storage, bucket "documents").
create table documents (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  type document_type not null,
  title text not null,
  storage_path text not null,
  version int not null default 1,
  generated_by uuid references profiles (id),
  generated_at timestamptz not null default now()
);

-- Un abonnement Stripe par organisation.
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null unique references organizations (id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan subscription_plan not null default 'free',
  status text not null default 'active',
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

-- Journal d'audit (traçabilité pour le dossier de conformité).
create table audit_log (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations (id) on delete cascade,
  actor_id uuid references profiles (id),
  action text not null,
  target text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────────────────────────────────
create index idx_memberships_user on memberships (user_id);
create index idx_diagnostic_responses_org on diagnostic_responses (org_id);
create index idx_org_checklist_progress_org on org_checklist_progress (org_id);
create index idx_documents_org on documents (org_id);
create index idx_audit_log_org on audit_log (org_id);

-- ─────────────────────────────────────────────────────────────────────────
-- FONCTIONS UTILITAIRES
-- ─────────────────────────────────────────────────────────────────────────

-- Vrai si l'utilisateur courant appartient à l'organisation donnée.
-- SECURITY DEFINER + search_path fixe pour éviter le hijack de search_path,
-- STABLE pour permettre au planner de la traiter comme une sous-requête.
create or replace function is_org_member(target_org_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from memberships
    where org_id = target_org_id and user_id = auth.uid()
  );
$$;

-- Vrai si l'utilisateur courant est owner de l'organisation donnée.
create or replace function is_org_owner(target_org_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from memberships
    where org_id = target_org_id and user_id = auth.uid() and role = 'owner'
  );
$$;

-- Crée une organisation et son membership 'owner' de façon atomique,
-- pour éviter le problème d'œuf-et-poule avec les policies RLS à l'insert.
create or replace function create_organization(org_name text, org_sector text default null, org_size_band text default null)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
begin
  insert into organizations (name, sector, size_band, created_by)
  values (org_name, org_sector, org_size_band, auth.uid())
  returning id into new_org_id;

  insert into memberships (org_id, user_id, role)
  values (new_org_id, auth.uid(), 'owner');

  insert into subscriptions (org_id, plan, status)
  values (new_org_id, 'free', 'active');

  return new_org_id;
end;
$$;

-- Crée automatiquement un profil à l'inscription d'un utilisateur Auth.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────────────────
alter table profiles enable row level security;
alter table organizations enable row level security;
alter table memberships enable row level security;
alter table diagnostic_responses enable row level security;
alter table diagnostic_results enable row level security;
alter table checklist_templates enable row level security;
alter table org_checklist_progress enable row level security;
alter table documents enable row level security;
alter table subscriptions enable row level security;
alter table audit_log enable row level security;

-- profiles : chacun ne voit / modifie que son propre profil.
create policy "profiles_select_own" on profiles for select using (id = auth.uid());
create policy "profiles_update_own" on profiles for update using (id = auth.uid());

-- organizations : visibles/modifiables par les membres ; insert géré par create_organization().
create policy "organizations_select_member" on organizations for select using (is_org_member(id));
create policy "organizations_update_owner" on organizations for update using (is_org_owner(id));

-- memberships : un membre voit les autres membres de ses organisations.
create policy "memberships_select_same_org" on memberships for select using (is_org_member(org_id));
create policy "memberships_owner_manage" on memberships for all using (is_org_owner(org_id)) with check (is_org_owner(org_id));

-- diagnostic_responses / diagnostic_results : lecture/écriture réservées aux membres de l'org.
create policy "diagnostic_responses_member" on diagnostic_responses for all using (is_org_member(org_id)) with check (is_org_member(org_id));
create policy "diagnostic_results_member" on diagnostic_results for all using (is_org_member(org_id)) with check (is_org_member(org_id));

-- checklist_templates : référentiel public en lecture pour tout utilisateur connecté, pas d'écriture cliente.
create policy "checklist_templates_read_all" on checklist_templates for select using (auth.role() = 'authenticated');

-- org_checklist_progress : membres de l'org uniquement.
create policy "org_checklist_progress_member" on org_checklist_progress for all using (is_org_member(org_id)) with check (is_org_member(org_id));

-- documents : membres de l'org uniquement.
create policy "documents_member" on documents for all using (is_org_member(org_id)) with check (is_org_member(org_id));

-- subscriptions : lecture pour les membres, écriture réservée au service role (webhooks Stripe) donc pas de policy insert/update cliente.
create policy "subscriptions_select_member" on subscriptions for select using (is_org_member(org_id));

-- audit_log : lecture pour les membres ; écriture faite côté serveur (service role ou fonctions SECURITY DEFINER).
create policy "audit_log_select_member" on audit_log for select using (is_org_member(org_id));
