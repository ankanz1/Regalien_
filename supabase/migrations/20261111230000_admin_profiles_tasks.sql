-- Review and apply manually only after confirming these objects are absent.
-- This migration does not alter the existing admin_roles table or functions.

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  designation text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  assigned_to uuid references auth.users(id) on delete set null,
  created_by uuid not null references auth.users(id),
  related_project_id uuid references public.projects(id) on delete set null,
  related_inquiry_id uuid references public.inquiries(id) on delete set null,
  priority text not null default 'Medium' check (priority in ('High', 'Medium', 'Low')),
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'cancelled')),
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_assigned_to_idx on public.tasks (assigned_to);
create index if not exists tasks_status_due_date_idx on public.tasks (status, due_date);

alter table public.admin_profiles enable row level security;
alter table public.tasks enable row level security;

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

create policy "administrators can read their own profile"
  on public.admin_profiles for select
  to authenticated
  using (
    user_id = auth.uid()
    and (
      public.is_regalien_admin()
    )
  );

create policy "administrators can insert their own profile"
  on public.admin_profiles for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and (
      public.is_regalien_admin()
    )
  );

create policy "administrators can update their own profile"
  on public.admin_profiles for update
  to authenticated
  using (
    user_id = auth.uid()
    and (
      public.is_regalien_admin()
    )
  )
  with check (user_id = auth.uid());

create policy "authorized administrators can manage tasks"
  on public.tasks for all
  to authenticated
  using (
    public.is_regalien_admin()
  )
  with check (
    public.is_regalien_admin()
  );
