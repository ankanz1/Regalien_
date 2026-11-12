-- Review and apply manually after confirming the target project-media bucket
-- is not already configured with different retention or access requirements.

insert into storage.buckets (id, name, public)
values ('project-media', 'project-media', true)
on conflict (id) do update set public = excluded.public;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'public can read project media'
  ) then
    create policy "public can read project media"
      on storage.objects for select
      using (bucket_id = 'project-media');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'administrators can upload project media'
  ) then
    create policy "administrators can upload project media"
      on storage.objects for insert
      to authenticated
      with check (
        bucket_id = 'project-media'
        and public.is_regalien_admin()
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'administrators can update project media'
  ) then
    create policy "administrators can update project media"
      on storage.objects for update
      to authenticated
      using (bucket_id = 'project-media' and public.is_regalien_admin())
      with check (bucket_id = 'project-media' and public.is_regalien_admin());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'administrators can delete project media'
  ) then
    create policy "administrators can delete project media"
      on storage.objects for delete
      to authenticated
      using (bucket_id = 'project-media' and public.is_regalien_admin());
  end if;
end
$$;
