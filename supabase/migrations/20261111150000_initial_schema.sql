-- Review and apply manually in Supabase SQL Editor.
-- This migration is intentionally not executed by the application.

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  location text not null default '',
  year integer not null,
  area_sq_ft integer not null default 0,
  client text not null default '',
  description text not null default '',
  materials jsonb not null default '[]'::jsonb,
  features jsonb not null default '[]'::jsonb,
  cover_image text not null,
  gallery jsonb not null default '[]'::jsonb,
  videos jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  published boolean not null default false,
  completion_weeks integer not null default 0,
  before_after jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  question text not null,
  answer text not null,
  highlight text,
  display_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  role text not null default '',
  project text not null default '',
  location text not null default '',
  rating integer not null check (rating between 1 and 5),
  quote text not null,
  outcome text not null default '',
  avatar_url text,
  year integer not null,
  approved boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  project_scope text not null,
  property_type text not null,
  estimated_sq_ft text not null default '',
  location text not null,
  target_timeline text not null,
  message text not null,
  budget_range text not null default '',
  status text not null default 'New',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_email text not null,
  client_phone text not null,
  consultation_type text not null,
  date date not null,
  time_slot text not null,
  project_type text not null,
  estimated_sq_ft integer,
  budget text,
  notes text,
  status text not null default 'Pending',
  created_at timestamptz not null default now(),
  google_calendar_event_url text
);

create table if not exists public.business_settings (
  id boolean primary key default true,
  name text not null,
  tagline text not null default '',
  phone text not null default '',
  whatsapp_number text not null default '',
  email text not null default '',
  address text not null default '',
  google_maps_url text not null default '',
  instagram_url text not null default '',
  facebook_url text not null default '',
  youtube_url text not null default '',
  office_hours text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;
alter table public.faqs enable row level security;
alter table public.testimonials enable row level security;
alter table public.inquiries enable row level security;
alter table public.appointments enable row level security;
alter table public.business_settings enable row level security;

create policy "published projects are public"
  on public.projects for select using (published = true);
create policy "published faqs are public"
  on public.faqs for select using (published = true);
create policy "approved published testimonials are public"
  on public.testimonials for select using (approved = true and published = true);
create policy "public can submit inquiries"
  on public.inquiries for insert with check (true);
create policy "public can submit appointments"
  on public.appointments for insert with check (true);
create policy "business settings are public"
  on public.business_settings for select using (true);

-- Add authenticated-admin policies only after the project’s administrator role
-- and authorization mechanism have been verified. Do not use client claims alone.
