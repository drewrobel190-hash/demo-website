/* ============================================================
   Admin — Add / Edit vehicle + image uploader (Supabase Storage).
   Requires supabase.js + auth.js. Guards the page (login required).
   ============================================================ */
const $v = id => document.getElementById(id);
const escv = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function vtoast(msg) {
  let t = $v('aToast'); if (!t) { t = document.createElement('div'); t.id = 'aToast'; t.className = 'a-toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2200);
}
const bucket = () => (window.SB && SB.cfg && SB.cfg.vehicleBucket) || 'vehicle-images';
const state = { id: new URLSearchParams(location.search).get('id'), images: [] };

(async function initVehicle() {
  if (!AdminAuth.configured()) { document.body.innerHTML = '<div class="notice"><div class="notice-card"><h2>Connect Supabase first</h2><p>Fill <code>js/supabase-config.js</code> — see <code>supabase/README.md</code>.</p><p style="margin-top:16px"><a class="btn btn-ghost" href="index.html">← Admin</a></p></div></div>'; return; }
  const user = await AdminAuth.currentUser();
  if (!user) { location.href = 'index.html'; return; }

  $v('backLink') && ($v('backLink').onclick = () => { location.href = 'index.html'; });
  $v('logoutBtn') && $v('logoutBtn').addEventListener('click', () => AdminAuth.signOut());
  $v('saveBtn').addEventListener('click', () => save(false));
  $v('publishBtn').addEventListener('click', () => save(true));
  wireUploader();

  if (state.id) { $v('formTitle').textContent = 'Edit Vehicle'; await loadVehicle(state.id); }
  else { $v('formTitle').textContent = 'Add Vehicle'; }
})();

function collectForm() {
  const num = v => { const n = parseInt(v, 10); return isNaN(n) ? null : n; };
  return {
    brand: $v('f_brand').value.trim(),
    model: $v('f_model').value.trim(),
    year: num($v('f_year').value),
    mileage: num($v('f_mileage').value),
    price: parseFloat($v('f_price').value) || 0,
    price_on_request: $v('f_por').checked,
    condition: $v('f_condition').value,
    certified: $v('f_certified').checked,
    location: $v('f_location').value.trim(),
    exterior_color: $v('f_ext').value.trim(),
    interior_color: $v('f_int').value.trim(),
    hp: num($v('f_hp').value),
    drivetrain: $v('f_drivetrain').value.trim(),
    engine: $v('f_engine').value.trim(),
    description: $v('f_desc').value.trim(),
    featured: $v('f_featured').checked,
    status: $v('f_status').value
  };
}
function fillForm(v) {
  $v('f_brand').value = v.brand || ''; $v('f_model').value = v.model || '';
  $v('f_year').value = v.year || ''; $v('f_mileage').value = v.mileage || '';
  $v('f_price').value = v.price || ''; $v('f_por').checked = !!v.price_on_request;
  $v('f_condition').value = v.condition || 'Pre-Owned'; $v('f_certified').checked = v.certified !== false;
  $v('f_location').value = v.location || 'Cubao, Quezon City';
  $v('f_ext').value = v.exterior_color || ''; $v('f_int').value = v.interior_color || '';
  $v('f_hp').value = v.hp || ''; $v('f_drivetrain').value = v.drivetrain || ''; $v('f_engine').value = v.engine || '';
  $v('f_desc').value = v.description || ''; $v('f_featured').checked = !!v.featured;
  $v('f_status').value = v.status || 'draft';
}

// Create the row (draft) if it doesn't exist yet, so images have a vehicle_id.
async function ensureVehicle() {
  if (state.id) return state.id;
  const { data, error } = await SB.client.from('vehicles').insert({ brand: '', model: '', status: 'draft' }).select('id').single();
  if (error) throw error;
  state.id = data.id;
  history.replaceState(null, '', 'vehicle.html?id=' + state.id);
  $v('formTitle').textContent = 'Edit Vehicle';
  return state.id;
}

async function save(publish) {
  try {
    const id = await ensureVehicle();
    const payload = collectForm();
    if (publish) payload.status = 'published';
    if (!payload.brand || !payload.model) { vtoast('Brand and Model are required.'); return; }
    const { error } = await SB.client.from('vehicles').update(payload).eq('id', id);
    if (error) throw error;
    $v('f_status').value = payload.status;
    vtoast(publish ? 'Published ✓' : 'Saved ✓');
  } catch (e) { vtoast(e.message || 'Save failed'); }
}

async function loadVehicle(id) {
  const { data, error } = await SB.client.from('vehicles').select('*, vehicle_images(*)').eq('id', id).single();
  if (error) { vtoast(error.message); return; }
  fillForm(data);
  state.images = (data.vehicle_images || []).slice().sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || (a.sort_order || 0) - (b.sort_order || 0));
  renderImages();
}

/* ---------- Images ---------- */
function wireUploader() {
  const drop = $v('uploader'), input = $v('fileInput');
  drop.addEventListener('click', () => input.click());
  input.addEventListener('change', () => { if (input.files.length) uploadFiles([...input.files]); input.value = ''; });
  ['dragover', 'dragenter'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('drag'); }));
  ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('drag'); }));
  drop.addEventListener('drop', e => { const f = [...(e.dataTransfer.files || [])].filter(x => x.type.startsWith('image/')); if (f.length) uploadFiles(f); });
}
function sanitize(name) { return name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-|-$/g, ''); }
async function uploadFiles(files) {
  try {
    const id = await ensureVehicle();
    vtoast('Uploading…');
    for (const file of files) {
      const path = `${id}/${Date.now()}-${sanitize(file.name)}`;
      const up = await SB.client.storage.from(bucket()).upload(path, file, { cacheControl: '3600', upsert: false });
      if (up.error) { vtoast(up.error.message); continue; }
      const pub = SB.client.storage.from(bucket()).getPublicUrl(path);
      const url = pub.data.publicUrl;
      const isFirst = state.images.length === 0;
      const ins = await SB.client.from('vehicle_images')
        .insert({ vehicle_id: id, image_url: url, sort_order: state.images.length, is_primary: isFirst })
        .select().single();
      if (!ins.error) state.images.push(ins.data);
    }
    renderImages(); vtoast('Photos added ✓');
  } catch (e) { vtoast(e.message || 'Upload failed'); }
}
function renderImages() {
  const grid = $v('imgGrid');
  if (!state.images.length) { grid.innerHTML = '<div class="a-empty" style="grid-column:1/-1;padding:20px">No photos yet.</div>'; return; }
  grid.innerHTML = state.images.map(img => `
    <div class="img-cell ${img.is_primary ? 'primary' : ''}">
      ${img.is_primary ? '<span class="primary-tag">Primary</span>' : ''}
      <img src="${escv(img.image_url)}" alt="" />
      <div class="img-tools">
        ${img.is_primary ? '' : `<button data-img-act="primary" data-id="${img.id}">Set primary</button>`}
        <button data-img-act="delete" data-id="${img.id}">Delete</button>
      </div>
    </div>`).join('');
}
document.addEventListener('click', async e => {
  const b = e.target.closest('[data-img-act]'); if (!b) return;
  const id = b.dataset.id, act = b.dataset.imgAct;
  try {
    if (act === 'primary') {
      await SB.client.from('vehicle_images').update({ is_primary: false }).eq('vehicle_id', state.id);
      await SB.client.from('vehicle_images').update({ is_primary: true }).eq('id', id);
      state.images.forEach(i => i.is_primary = (i.id === id));
      state.images.sort((a, c) => (c.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || (a.sort_order || 0) - (c.sort_order || 0));
      renderImages(); vtoast('Primary photo set');
    } else if (act === 'delete') {
      await SB.client.from('vehicle_images').delete().eq('id', id);
      state.images = state.images.filter(i => i.id !== id);
      if (state.images.length && !state.images.some(i => i.is_primary)) {
        state.images[0].is_primary = true;
        await SB.client.from('vehicle_images').update({ is_primary: true }).eq('id', state.images[0].id);
      }
      renderImages(); vtoast('Photo deleted');
    }
  } catch (err) { vtoast(err.message || 'Failed'); }
});
