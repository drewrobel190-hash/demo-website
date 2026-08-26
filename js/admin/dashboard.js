/* ============================================================
   Admin dashboard — login gate + stats + vehicle list + row actions.
   Requires supabase.js + auth.js. All writes hit Supabase (RLS-protected).
   ============================================================ */
const $ = id => document.getElementById(id);
const show = el => { if (el) el.hidden = false; };
const hide = el => { if (el) el.hidden = true; };
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pesoAdmin = n => '₱' + Math.round(Number(n) || 0).toLocaleString('en-US');
function toast(msg) {
  let t = $('aToast');
  if (!t) { t = document.createElement('div'); t.id = 'aToast'; t.className = 'a-toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2000);
}

(async function initAdmin() {
  if (!AdminAuth.configured()) { show($('notConfigured')); return; }
  const user = await AdminAuth.currentUser();
  if (user) showDash(user); else showLogin();

  $('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const msg = $('loginMsg'); msg.textContent = 'Signing in…'; msg.className = 'form-msg';
    const btn = $('loginBtn'); btn.disabled = true;
    try { const u = await AdminAuth.signIn($('adminEmail').value.trim(), $('adminPassword').value); showDash(u); }
    catch (err) { msg.textContent = err.message || 'Sign in failed'; msg.className = 'form-msg err'; }
    finally { btn.disabled = false; }
  });
  $('logoutBtn') && $('logoutBtn').addEventListener('click', () => AdminAuth.signOut());
})();

function showLogin() { hide($('notConfigured')); hide($('dashView')); show($('loginView')); }
async function showDash(user) {
  hide($('notConfigured')); hide($('loginView')); show($('dashView'));
  if ($('adminWho')) $('adminWho').textContent = user && user.email ? user.email : '';
  await loadDashboard();
}

async function loadDashboard() {
  const list = $('vehicleList');
  list.innerHTML = '<div class="a-empty">Loading…</div>';
  const { data, error } = await SB.client
    .from('vehicles')
    .select('*, vehicle_images(image_url,is_primary,sort_order)')
    .order('created_at', { ascending: false });
  if (error) { list.innerHTML = `<div class="a-empty">Could not load vehicles: ${esc(error.message)}</div>`; return; }
  const rows = data || [];
  const by = s => rows.filter(v => v.status === s).length;
  $('statTotal').textContent = rows.length;
  $('statPublished').textContent = by('published');
  $('statDrafts').textContent = by('draft');
  $('statReserved').textContent = by('reserved');
  if (!rows.length) { list.innerHTML = '<div class="a-empty">No vehicles yet. Click <b>+ Add Vehicle</b> to create one.</div>'; return; }
  list.innerHTML = rows.map(vehRowHTML).join('');
}

function primaryImg(v) {
  const imgs = (v.vehicle_images || []).slice()
    .sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || (a.sort_order || 0) - (b.sort_order || 0));
  return imgs[0] ? imgs[0].image_url : '';
}
function vehRowHTML(v) {
  const img = primaryImg(v);
  const price = v.price_on_request ? 'Price on Request' : pesoAdmin(v.price);
  const km = (v.mileage || 0).toLocaleString('en-US') + ' km';
  const toggle = v.status === 'published'
    ? `<button class="btn btn-ghost btn-sm" data-act="unpublish" data-id="${v.id}">Unpublish</button>`
    : `<button class="btn btn-primary btn-sm" data-act="publish" data-id="${v.id}">Publish</button>`;
  return `<div class="v-row">
    <img class="v-thumb" src="${esc(img)}" onerror="this.style.visibility='hidden'" alt="" />
    <div class="v-info">
      <div class="brandline">${esc(v.brand)}</div>
      <h3>${esc(v.model)}</h3>
      <div class="meta">${esc(v.year || '')} · ${km} · ${esc(v.location || '')}</div>
      <div class="price">${price}</div>
    </div>
    <div class="v-actions">
      <span class="badge ${esc(v.status)}">${esc(v.status)}</span>
      ${v.featured ? '<span class="badge featured">Featured</span>' : ''}
      <a class="btn btn-ghost btn-sm" href="vehicle.html?id=${v.id}">Edit</a>
      ${toggle}
      <button class="btn btn-ghost btn-sm" data-act="delete" data-id="${v.id}">Delete</button>
    </div>
  </div>`;
}

document.addEventListener('click', async e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const id = b.dataset.id, act = b.dataset.act;
  try {
    if (act === 'publish' || act === 'unpublish') {
      const { error } = await SB.client.from('vehicles').update({ status: act === 'publish' ? 'published' : 'draft' }).eq('id', id);
      if (error) throw error; toast(act === 'publish' ? 'Published' : 'Unpublished'); loadDashboard();
    } else if (act === 'delete') {
      if (!confirm('Delete this vehicle? This cannot be undone.')) return;
      const { error } = await SB.client.from('vehicles').delete().eq('id', id);
      if (error) throw error; toast('Deleted'); loadDashboard();
    }
  } catch (err) { toast(err.message || 'Action failed'); }
});
