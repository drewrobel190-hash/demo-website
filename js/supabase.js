/* ============================================================
   Supabase client bootstrap (shared by public pages + admin).
   Requires, loaded BEFORE this file:
     1) https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2   (window.supabase)
     2) js/supabase-config.js                                 (window.SUPABASE_CONFIG)
   Exposes window.SB = { configured, client, cfg }.
   If not configured (placeholders left in), configured=false and the site
   falls back to the built-in static inventory — nothing breaks.
   ============================================================ */
window.SB = (function () {
  const cfg = window.SUPABASE_CONFIG || {};
  // Normalize the URL: the JS client needs the base project origin only, so
  // strip a trailing "/rest/v1/" (the REST endpoint) or any trailing slash if
  // one was pasted in by mistake.
  const url = (cfg.url || '').trim().replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
  const key = (cfg.anonKey || '').trim();
  const looksReal = url && key &&
    !/YOUR_/i.test(url) && !/YOUR_/i.test(key) &&
    /^https?:\/\//i.test(url);
  let client = null;
  if (looksReal && window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      client = window.supabase.createClient(url, key, {
        auth: { persistSession: true, autoRefreshToken: true }
      });
    } catch (e) {
      console.warn('[SB] Failed to create Supabase client:', e);
    }
  }
  const configured = !!client;
  if (!configured) {
    console.info('[SB] Supabase not configured — using built-in static inventory (fallback).');
  }
  return { configured, client, cfg };
})();
