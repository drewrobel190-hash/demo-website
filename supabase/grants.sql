-- ============================================================
-- grants.sql — REQUIRED one-time fix.
-- schema.sql created RLS *policies* but not the table GRANTs.
-- In Postgres, a role must have table privileges BEFORE row-level
-- policies apply. Without these grants, the anon role gets
-- "permission denied for table vehicles" and the public site can't read.
--
-- This is ADDITIVE and SAFE:
--   • It changes NO table structure and NO data.
--   • RLS still restricts anon to published rows only (see schema.sql).
--   • It does NOT re-run schema.sql / seed.sql / storage.sql.
--
-- Run this ONCE in Supabase → SQL Editor.
-- ============================================================

grant usage on schema public to anon, authenticated;

-- Public (unauthenticated) — read only. RLS limits rows to status='published'.
grant select on
  public.vehicles,
  public.vehicle_images,
  public.parts,
  public.part_images
to anon;

-- Admin (logged in via Supabase Auth) — full CRUD. RLS policy "admin all" allows it.
grant select, insert, update, delete on
  public.vehicles,
  public.vehicle_images,
  public.parts,
  public.part_images
to authenticated;
