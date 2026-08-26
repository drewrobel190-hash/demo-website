/* ============================================================
   Data layer — bridges Supabase rows to the internal card shape used by
   cars.js / home.js. Every function returns null / does nothing when Supabase
   isn't configured, so callers fall back to the built-in static `inventory`.
   Load AFTER shared.js (needs `inventory`) and supabase.js.
   ============================================================ */

// Map a Supabase vehicle row (with joined vehicle_images) to a card object.
function _mapDbVehicle(v) {
  const imgs = (v.vehicle_images || [])
    .slice()
    .sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || (a.sort_order || 0) - (b.sort_order || 0))
    .map(i => i.image_url)
    .filter(Boolean);
  return {
    id: v.id,
    brand: v.brand, model: v.model,
    year: v.year,
    // DB stores real pesos + real km; the frontend's peso()/km() use base units
    // (×57 / ×1.609), so convert here to keep displays identical to the static data.
    mileage: Math.round((Number(v.mileage) || 0) / 1.609),
    price: v.price_on_request ? 0 : (Number(v.price) || 0) / 57,
    priceOnRequest: !!v.price_on_request,
    color: v.exterior_color || '', interior: v.interior_color || '',
    dealer: v.dealer || 'Supercar PH Cubao',
    location: v.location || 'Cubao, Quezon City',
    certified: v.certified !== false,
    isNew: String(v.condition || '').toLowerCase() === 'new',
    hp: v.hp || 0, drivetrain: v.drivetrain || '', engine: v.engine || '',
    description: v.description || '',
    featured: !!v.featured,
    status: v.status,
    images: imgs.length ? imgs : undefined,
    photoCount: imgs.length,
    _db: true
  };
}

// Fetch published vehicles (featured first, then newest). null on any problem.
async function loadPublishedVehicles() {
  if (!window.SB || !SB.configured) return null;
  try {
    const { data, error } = await SB.client
      .from('vehicles')
      .select('*, vehicle_images(image_url, sort_order, is_primary)')
      .eq('status', 'published')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) { console.warn('[SB] vehicles fetch error:', error.message); return null; }
    return Array.isArray(data) ? data.map(_mapDbVehicle) : null;
  } catch (e) { console.warn('[SB] vehicles fetch failed:', e); return null; }
}

// Replace the shared `inventory` array in place (keeps existing references).
function applyVehicles(list) {
  if (!Array.isArray(list) || !list.length) return false;
  inventory.length = 0;
  list.forEach(c => { c.photoCount = (c.images || []).length; inventory.push(c); });
  return true;
}

window.loadPublishedVehicles = loadPublishedVehicles;
window.applyVehicles = applyVehicles;
