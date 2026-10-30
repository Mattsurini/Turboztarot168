-- ============================================================================
-- Turboztarot — Supabase schema
-- Run this whole file in the Supabase SQL Editor (Dashboard > SQL Editor).
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------- Categories ----------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz not null default now()
);

-- ---------- Services ----------
create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  short_desc text,
  description text,
  price text,
  duration_min int,
  "order" int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- Articles ----------
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text,
  cover_image text,
  category_id uuid references public.categories(id) on delete set null,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- ---------- Bookings (admin-managed queue log; NOT public) ----------
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  service_name text,
  scheduled_at timestamptz,
  status text not null default 'รอ',
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Row Level Security
-- Content tables: anyone may SELECT (public reading on the site).
-- All writes go through the server-side admin layer, which uses the
-- SUPABASE_SERVICE_ROLE_KEY and therefore bypasses RLS (server-only key,
-- never exposed to the browser). The policies below are defense-in-depth:
-- an anonymous client can never insert/update/delete.
-- bookings has no public policy at all -> invisible to anon clients.
-- ============================================================================

alter table public.services  enable row level security;
alter table public.articles  enable row level security;
alter table public.categories enable row level security;
alter table public.bookings  enable row level security;

-- Public read
create policy "public read services"  on public.services  for select using (true);
create policy "public read articles"  on public.articles  for select using (true);
create policy "public read categories" on public.categories for select using (true);

-- Admin writes (authenticated session; service role also permitted by bypass)
create policy "admin write services"  on public.services  for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write articles"  on public.articles  for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write categories" on public.categories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write bookings"  on public.bookings  for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin write availability_slots" on public.availability_slots for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================================
-- Create a seed admin login (do in Dashboard > Authentication > Users > Add user,
-- email must match ADMIN_EMAIL in .env.local). No passwords are stored here.
-- ============================================================================
