-- ============================================================
-- Supercar Philippines — database schema + Row Level Security
-- Run this in: Supabase dashboard → SQL Editor → New query → Run
-- Safe to re-run (uses IF NOT EXISTS / CREATE OR REPLACE where possible).
-- ============================================================

-- ---------- VEHICLES ----------
create table if not exists public.vehicles (
  id               uuid primary key default gen_random_uuid(),
  brand            text not null,
  model            text not null,
  year             int,
  mileage          int  default 0,          -- real kilometres
  price            numeric default 0,        -- real pesos (ignored when price_on_request)
  price_on_request boolean default false,
  condition        text default 'Pre-Owned', -- 'New' | 'Pre-Owned'
  certified        boolean default true,     -- shows the "Approved" badge
  location         text default 'Cubao, Quezon City',
  dealer           text default 'Supercar PH Cubao',
  exterior_color   text,
  interior_color   text,
  hp               int,                      -- power (hp) — detail spec
  drivetrain       text,                     -- RWD/AWD — detail spec
  engine           text,                     -- detail spec
  description      text,
  featured         boolean default false,
  status           text default 'draft',     -- 'draft' | 'published' | 'sold' | 'reserved'
  created_at       timestamptz default now(),
  updated_at       timestamptz default now(),
  constraint vehicles_status_chk check (status in ('draft','published','sold','reserved')),
  constraint vehicles_condition_chk check (condition in ('New','Pre-Owned'))
);
create index if not exists vehicles_status_idx   on public.vehicles(status);
create index if not exists vehicles_featured_idx on public.vehicles(featured);
create index if not exists vehicles_brand_idx    on public.vehicles(brand);

-- ---------- VEHICLE IMAGES ----------
create table if not exists public.vehicle_images (
  id         uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  image_url  text not null,
  sort_order int default 0,
  is_primary boolean default false,
  created_at timestamptz default now()
);
create index if not exists vehicle_images_vehicle_idx on public.vehicle_images(vehicle_id);

-- ---------- PARTS (structured now, wired to the site later) ----------
create table if not exists public.parts (
  id          uuid primary key default gen_random_uuid(),
  brand       text,
  name        text not null,
  category    text,
  price       numeric default 0,
  description text,
  featured    boolean default false,
  status      text default 'draft',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  constraint parts_status_chk check (status in ('draft','published','sold','reserved'))
);
create table if not exists public.part_images (
  id         uuid primary key default gen_random_uuid(),
  part_id    uuid not null references public.parts(id) on delete cascade,
  image_url  text not null,
  sort_order int default 0,
  is_primary boolean default false,
  created_at timestamptz default now()
);

-- ---------- updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists vehicles_updated on public.vehicles;
create trigger vehicles_updated before update on public.vehicles
  for each row execute function public.set_updated_at();

drop trigger if exists parts_updated on public.parts;
create trigger parts_updated before update on public.parts
  for each row execute function public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- Public (anon): may READ only published rows.
-- Authenticated (your admin login): full read/write.
-- Writes are impossible for the public — enforced by the database, not the UI.
-- ============================================================
alter table public.vehicles       enable row level security;
alter table public.vehicle_images enable row level security;
alter table public.parts          enable row level security;
alter table public.part_images    enable row level security;

-- vehicles
drop policy if exists "public read published vehicles" on public.vehicles;
create policy "public read published vehicles" on public.vehicles
  for select using (status = 'published');
drop policy if exists "admin all vehicles" on public.vehicles;
create policy "admin all vehicles" on public.vehicles
  for all to authenticated using (true) with check (true);

-- vehicle_images
drop policy if exists "public read images of published vehicles" on public.vehicle_images;
create policy "public read images of published vehicles" on public.vehicle_images
  for select using (
    exists (select 1 from public.vehicles v where v.id = vehicle_id and v.status = 'published')
  );
drop policy if exists "admin all vehicle_images" on public.vehicle_images;
create policy "admin all vehicle_images" on public.vehicle_images
  for all to authenticated using (true) with check (true);

-- parts
drop policy if exists "public read published parts" on public.parts;
create policy "public read published parts" on public.parts
  for select using (status = 'published');
drop policy if exists "admin all parts" on public.parts;
create policy "admin all parts" on public.parts
  for all to authenticated using (true) with check (true);

-- part_images
drop policy if exists "public read images of published parts" on public.part_images;
create policy "public read images of published parts" on public.part_images
  for select using (
    exists (select 1 from public.parts p where p.id = part_id and p.status = 'published')
  );
drop policy if exists "admin all part_images" on public.part_images;
create policy "admin all part_images" on public.part_images
  for all to authenticated using (true) with check (true);
