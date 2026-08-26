/* ============================================================
   Supabase configuration — PUBLIC values only.
   The project URL and the ANON (public) key are safe to expose in a static
   site: your data is protected by Row Level Security, not by hiding the key.
   NEVER put the service_role key here (it bypasses RLS).

   After you create your Supabase project:
     Supabase dashboard → Project Settings → API
     - Project URL      → url
     - anon public key  → anonKey
   Replace the two placeholders below and reload. Until then the site runs on
   the built-in static inventory (graceful fallback), so nothing breaks.
   ============================================================ */
window.SUPABASE_CONFIG = {
  url: 'YOUR_SUPABASE_URL',
  anonKey: 'YOUR_SUPABASE_ANON_KEY',
  // Storage bucket that holds uploaded vehicle photos (created via the SQL/steps).
  vehicleBucket: 'vehicle-images'
};
