-- Un seul document "courant" par organisation et par type (le stockage écrase le même
-- chemin à chaque régénération ; "version" trace le nombre de générations passées).
alter table documents add constraint documents_org_type_unique unique (org_id, type);

-- Bucket privé pour les documents générés (PDF). Chemin des objets : "<org_id>/<type>.pdf".
-- L'isolation multi-tenant est assurée en comparant le premier segment du chemin
-- (le org_id) aux organisations dont l'utilisateur courant est membre.
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

create policy "documents_storage_select_member"
on storage.objects for select
using (
  bucket_id = 'documents'
  and (storage.foldername(name))[1]::uuid in (
    select org_id from memberships where user_id = auth.uid()
  )
);

create policy "documents_storage_insert_member"
on storage.objects for insert
with check (
  bucket_id = 'documents'
  and (storage.foldername(name))[1]::uuid in (
    select org_id from memberships where user_id = auth.uid()
  )
);

create policy "documents_storage_update_member"
on storage.objects for update
using (
  bucket_id = 'documents'
  and (storage.foldername(name))[1]::uuid in (
    select org_id from memberships where user_id = auth.uid()
  )
);
