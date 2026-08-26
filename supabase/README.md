# Supercar Philippines — Supabase setup (one-time)

The website runs on a **static** architecture (no build tool). Supabase's **anon
key is public by design** — your data is protected by Row Level Security, not by
hiding the key. **Never** put the `service_role` key anywhere in the frontend.

## 1. Create the project
1. Go to https://supabase.com → **New project** (free tier is fine). Pick a name
   and a strong database password. Wait ~2 min for it to provision.

## 2. Run the SQL (in order)
Supabase dashboard → **SQL Editor** → **New query** → paste each file → **Run**:
1. `schema.sql`  — tables, indexes, `updated_at` triggers, **RLS policies**
2. `storage.sql` — the `vehicle-images` bucket + storage policies
3. `seed.sql`    — inserts your current **12 vehicles** (published) + a primary image each

## 3. Create the admin user
Dashboard → **Authentication → Users → Add user** → enter the admin email +
password (this is your login). Then **Authentication → Providers → Email**:
turn **"Confirm email" OFF** (optional, simpler) and **disable public sign-ups**
so only you can create admins:
- **Authentication → Sign In / Providers → Email → "Allow new users to sign up" = OFF.**

Any authenticated user is treated as an admin by the RLS policies, so keeping
sign-ups closed is what limits admin access.

## 4. Wire the site to the project
Dashboard → **Project Settings → API**, copy:
- **Project URL**
- **anon public** key

Paste them into **`js/supabase-config.js`**:
```js
window.SUPABASE_CONFIG = {
  url: 'https://YOURPROJECT.supabase.co',
  anonKey: 'eyJhbGci...your anon key...',
  vehicleBucket: 'vehicle-images'
};
```
Reload the site. The public Cars/Home pages now read **published** vehicles from
Supabase; the admin dashboard (`/admin/`) can log in and manage inventory.

> Until you paste real values, the site keeps using the built-in static
> inventory (graceful fallback) — nothing breaks.

## What enforces security
- **Public visitors** can only `SELECT` rows where `status = 'published'`
  (vehicles + their images). They cannot insert/update/delete anything.
- **Authenticated admins** (your login) have full read/write.
- This is enforced by the **database (RLS)** — not by hiding the admin page.

## Files
- `schema.sql`  — vehicles, vehicle_images, parts, part_images + RLS
- `storage.sql` — vehicle-images bucket + policies
- `seed.sql`    — the current 12 cars (run once; guarded)
