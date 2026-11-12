-- Review and apply manually after confirming the existing role function and
-- admin_roles policies in the target Supabase project.
-- This migration does not create or alter application tables.

alter table public.admin_roles enable row level security;
alter table public.projects enable row level security;
alter table public.inquiries enable row level security;
alter table public.appointments enable row level security;
alter table public.faqs enable row level security;
alter table public.testimonials enable row level security;
alter table public.business_settings enable row level security;

create or replace function public.is_regalien_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_regalien_super_admin()
    or exists (
      select 1
      from public.admin_roles
      where user_id = auth.uid()
        and role in ('super_admin', 'admin', 'project_manager', 'enquiry_manager', 'content_manager')
    );
$$;

revoke all on function public.is_regalien_admin() from public;
grant execute on function public.is_regalien_admin() to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'admin_roles'
      and policyname = 'administrators can read their own role'
  ) then
    create policy "administrators can read their own role"
      on public.admin_roles for select
      to authenticated
      using (
        user_id = auth.uid()
        and public.is_regalien_admin()
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'projects'
      and policyname = 'administrators can manage projects'
  ) then
    create policy "administrators can manage projects"
      on public.projects for all
      to authenticated
      using (
        public.is_regalien_admin()
      )
      with check (
        public.is_regalien_admin()
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'inquiries'
      and policyname = 'administrators can manage inquiries'
  ) then
    create policy "administrators can manage inquiries"
      on public.inquiries for all
      to authenticated
      using (
        public.is_regalien_admin()
      )
      with check (
        public.is_regalien_admin()
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'appointments'
      and policyname = 'administrators can manage appointments'
  ) then
    create policy "administrators can manage appointments"
      on public.appointments for all
      to authenticated
      using (
        public.is_regalien_admin()
      )
      with check (
        public.is_regalien_admin()
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'faqs'
      and policyname = 'administrators can manage faqs'
  ) then
    create policy "administrators can manage faqs"
      on public.faqs for all
      to authenticated
      using (
        public.is_regalien_admin()
      )
      with check (
        public.is_regalien_admin()
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'testimonials'
      and policyname = 'administrators can manage testimonials'
  ) then
    create policy "administrators can manage testimonials"
      on public.testimonials for all
      to authenticated
      using (
        public.is_regalien_admin()
      )
      with check (
        public.is_regalien_admin()
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'business_settings'
      and policyname = 'administrators can manage business settings'
  ) then
    create policy "administrators can manage business settings"
      on public.business_settings for all
      to authenticated
      using (
        public.is_regalien_admin()
      )
      with check (
        public.is_regalien_admin()
      );
  end if;
end
$$;
