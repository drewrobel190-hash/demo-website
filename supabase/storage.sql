-- ============================================================
-- Supabase Storage — vehicle-images bucket (public read, admin write)
-- Run in SQL Editor AFTER schema.sql. (You can also create the bucket in the
-- Storage UI: New bucket → name "vehicle-images" → Public = ON.)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('vehicle-images', 'vehicle-images', true)
on conflict (id) do nothing;

-- Anyone can view the images (public bucket)
drop policy if exists "public read vehicle images" on storage.objects;
create policy "public read vehicle images" on storage.objects
  for select using (bucket_id = 'vehicle-images');

-- Only authenticated admins can upload / replace / delete
drop policy if exists "admin insert vehicle images" on storage.objects;
create policy "admin insert vehicle images" on storage.objects
  for insert to authenticated with check (bucket_id = 'vehicle-images');

drop policy if exists "admin update vehicle images" on storage.objects;
create policy "admin update vehicle images" on storage.objects
  for update to authenticated using (bucket_id = 'vehicle-images') with check (bucket_id = 'vehicle-images');

drop policy if exists "admin delete vehicle images" on storage.objects;
create policy "admin delete vehicle images" on storage.objects
  for delete to authenticated using (bucket_id = 'vehicle-images');
