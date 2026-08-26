/* ============================================================
   Supercar Philippines — CARS
   Inventory, filters, vehicle cards, vehicle detail, inquiry +
   Viber. Reads ?brand= / ?budget= from the Home carousels.
   Vehicle detail routing uses the hash: cars.html#vehicle/<slug>-<id>.
   Depends on shared.js (inventory, formatters, carImages, Viber, copy).
   ============================================================ */

/* ---------- State ---------- */
const PAGE_SIZE = 6;
// Price bounds are in the inventory's base units; displayed in PHP via peso().
const PRICE_MIN = 175000, PRICE_MAX = 880000, PRICE_STEP = 5000;
const MILE_MAX = 30000;
const state = {
  sort: 'featured',
  favorites: new Set(),   // persisted in localStorage (separate from compare)
  compare: new Set(),     // persisted in sessionStorage (max 3, separate from favorites)
  shown: PAGE_SIZE,
  favoritesOnly: false,
  compareMode: false,     // compare checkboxes on cards are hidden until this is on
  activeCat: 'brand',
  filters: {
    brand: new Set(),
    model: new Set(),
    dealer: new Set(),
    exterior: new Set(),
    interior: new Set(),
    condition: new Set(),
    location: new Set(),
    certifiedOnly: false,
    minPrice: 0,
    maxPrice: PRICE_MAX,
    minYear: null,
    maxYear: null,
    maxMileage: MILE_MAX,
    category: null,        // 'luxury' | 'supercar' — set by the nav buttons via ?category=
  },
};

/* ---------- Persistence (Favorites in localStorage, Compare in sessionStorage;
   the two are separate stores and never clear each other) ---------- */
const FAV_KEY = 'sp_favorites', CMP_KEY = 'sp_compare';
function loadJSON(store, key) { try { return JSON.parse(store.getItem(key)) || []; } catch (e) { return []; } }
function saveFavorites() { try { localStorage.setItem(FAV_KEY, JSON.stringify([...state.favorites])); } catch (e) {} }
function saveCompare() { try { sessionStorage.setItem(CMP_KEY, JSON.stringify([...state.compare])); } catch (e) {} }
state.favorites = new Set(loadJSON(localStorage, FAV_KEY).filter(id => inventory.some(c => c.id === id)));
state.compare = new Set(loadJSON(sessionStorage, CMP_KEY).filter(id => inventory.some(c => c.id === id)).slice(0, 3));

/* ---------- Elements ---------- */
const el = {
  grid: document.getElementById('cardGrid'),
  count: document.getElementById('resultCount'),
  heroCount: document.getElementById('heroCount'),
  empty: document.getElementById('emptyState'),
  loadMore: document.getElementById('loadMore'),
  loadMoreWrap: document.getElementById('loadMoreWrap'),
  activeFilters: document.getElementById('activeFilters'),
  clearFromEmpty: document.getElementById('clearFromEmpty'),
  // Filter popup
  filterModal: document.getElementById('filterModal'),
  filterClose: document.getElementById('filterClose'),
  filterBody: document.getElementById('filterBody'),
  filterResultCount: document.getElementById('filterResultCount'),
  filterClear: document.getElementById('filterClear'),
  filterApply: document.getElementById('filterApply'),
  // Inquiry
  inquireModal: document.getElementById('inquireModal'),
  inquireClose: document.getElementById('inquireClose'),
  inquireHead: document.getElementById('inquireHead'),
  inquireForm: document.getElementById('inquireForm'),
  inquireDone: document.getElementById('inquireDone'),
  inquireDoneClose: document.getElementById('inquireDoneClose'),
  // Vehicle detail
  detail: document.getElementById('detailView'),
  detailBack: document.getElementById('detailBack'),
  detailPrev: document.getElementById('detailPrev'),
  detailNext: document.getElementById('detailNext'),
  detailHero: document.getElementById('detailHero'),
  detailThumbs: document.getElementById('detailThumbs'),
  detailTitle: document.getElementById('detailTitle'),
  detailMeta: document.getElementById('detailMeta'),
  detailIds: document.getElementById('detailIds'),
  detailPrice: document.getElementById('detailPrice'),
  detailSpecs: document.getElementById('detailSpecs'),
  detailShowroom: document.getElementById('detailShowroom'),
  detailRelated: document.getElementById('detailRelated'),
  detailFav: document.getElementById('detailFav'),
};

/* ---------- Vehicle segment (Supercar vs Luxury / GT) ----------
   There is no category column in the data, so classify by model: the
   front-engine grand tourers and the luxury/EV models are "luxury"; every
   other car on a supercar lot is a "supercar". New vehicles added via the
   admin therefore default to "supercar" with no database change. */
const LUXURY_MODELS = ['Roma', 'Portofino', 'Taycan', '911'];
const carCategory = c => LUXURY_MODELS.some(k => String(c.model || '').includes(k)) ? 'luxury' : 'supercar';
const CATEGORY_LABEL = { luxury: 'Luxury Cars', supercar: 'Supercars' };

/* ---------- Core: filter + sort ---------- */
function getVisible(f = state.filters) {
  let list = inventory.filter(c =>
    (f.brand.size === 0 || f.brand.has(c.brand)) &&
    (f.model.size === 0 || f.model.has(c.model)) &&
    (f.dealer.size === 0 || f.dealer.has(c.dealer)) &&
    (f.exterior.size === 0 || f.exterior.has(c.color)) &&
    (f.interior.size === 0 || f.interior.has(c.interior)) &&
    (f.condition.size === 0 || f.condition.has(c.isNew ? 'New' : 'Pre-Owned')) &&
    (f.location.size === 0 || f.location.has(c.location)) &&
    (c.priceOnRequest || (c.price >= f.minPrice && c.price <= f.maxPrice)) &&
    (f.minYear == null || c.year >= f.minYear) &&
    (f.maxYear == null || c.year <= f.maxYear) &&
    c.mileage <= f.maxMileage &&
    (!f.certifiedOnly || c.certified) &&
    (!state.favoritesOnly || state.favorites.has(c.id)) &&
    (!f.category || carCategory(c) === f.category)
  );
  const p = c => c.priceOnRequest ? Infinity : c.price;   // "on request" sorts last
  const sorters = {
    'price-asc': (a, b) => p(a) - p(b),
    'price-desc': (a, b) => p(b) - p(a),
    'mileage-asc': (a, b) => a.mileage - b.mileage,
    'year-desc': (a, b) => b.year - a.year,
    'featured': (a, b) => (b.certified - a.certified) || (b.isNew - a.isNew) || (p(a) - p(b)),
  };
  return list.sort(sorters[state.sort] || sorters.featured);
}

/* ---------- Card / gallery rendering ---------- */
function galleryHTML(c) {
  const imgs = carImages(c);
  if (!imgs.length) {
    return `<div class="gallery coming-soon"><span class="cs-mark">S</span><span class="cs-text">Photos Coming Soon</span></div>`;
  }
  // Static single primary image on cards — no dots, no arrows, no carousel.
  // (data-count="1" keeps the swipe handler from engaging.)
  const hex = COLOR_HEX[c.color];
  return `<div class="gallery" data-count="1">
    <img class="slide active" src="${imgs[0]}" data-fallback="${carPhoto(hex, 0)}" onerror="photoFallback(this)" alt="${c.year} ${c.model}" loading="lazy" />
  </div>`;
}

function cardHTML(c) {
  const fav = state.favorites.has(c.id) ? 'active' : '';
  const cmp = state.compare.has(c.id) ? ' active' : '';
  const newBadge = c.isNew ? '<span class="badge badge-new">New</span>' : '';
  const certBadge = c.certified ? '<span class="badge badge-certified">Approved</span>' : '';
  return `
  <article class="card" data-id="${c.id}">
    <div class="card-media">
      ${galleryHTML(c)}
      <div class="card-badges">${newBadge}${certBadge}</div>
      <button class="card-fav ${fav}" data-fav="${c.id}" aria-label="Save vehicle">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" fill="var(--fill)" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
        </svg>
      </button>
      <button class="card-compare${cmp}" data-compare="${c.id}" aria-label="Add to compare"><span class="cc-box"></span>Compare</button>
    </div>
    <div class="card-body">
      <div class="card-meta">${c.year}<span class="dot">·</span>${km(c.mileage)}</div>
      <div class="card-brand">${c.brand}</div>
      <div class="card-model">${c.model}</div>
      <div class="card-price ${c.priceOnRequest ? 'on-request' : ''}">${priceLabel(c)}</div>
      <dl class="card-attrs">
        <div><dt>Exterior Color</dt><dd>${c.color}</dd></div>
        <div><dt>Interior Color</dt><dd>${c.interior}</dd></div>
        <div class="wide"><dt>Available At</dt><dd>${c.dealer}</dd></div>
      </dl>
      <div class="card-actions">
        <button class="btn-inquire" data-id="${c.id}">Inquire</button>
        <button class="btn-details" data-id="${c.id}">More Details</button>
      </div>
    </div>
  </article>`;
}

function promoHTML() {
  return `
  <article class="promo-card">
    <div class="promo-inner">
      <p class="promo-eyebrow">Tailor Made</p>
      <h3>Personalization Programs</h3>
      <p class="promo-text">Configure every detail — paint, hides, stitching, trim — and commission a car built entirely around you.</p>
      <button class="promo-btn">Discover More</button>
    </div>
  </article>`;
}

// Slide the dot strip so the active dot stays centered, shrinking edge dots.
function centerDots(gallery) {
  const vp = gallery.querySelector('.gdots-vp');
  const track = gallery.querySelector('.gdots-track');
  if (!vp || !track) return;
  const dots = [...track.querySelectorAll('.gdot')];
  const idx = +(gallery.dataset.idx || 0);
  const active = dots[idx];
  if (!active) return;
  const shift = vp.clientWidth / 2 - (active.offsetLeft + active.offsetWidth / 2);
  track.style.transform = `translateX(${shift}px)`;
  dots.forEach((d, i) => {
    if (i === idx) { d.style.transform = ''; return; }
    const dist = Math.abs(i - idx);
    d.style.transform = `scale(${dist === 1 ? 1 : dist === 2 ? 0.66 : 0.4})`;
  });
}
function centerAllDots() { el.grid.querySelectorAll('.gallery').forEach(centerDots); }

function setGalleryIndex(gallery, idx) {
  const count = +gallery.dataset.count;
  idx = Math.min(count - 1, Math.max(0, idx));
  gallery.dataset.idx = idx;
  gallery.querySelectorAll('.slide').forEach((s, i) => s.classList.toggle('active', i === idx));
  gallery.querySelectorAll('.gdot').forEach((d, i) => d.classList.toggle('active', i === idx));
  const prev = gallery.querySelector('.gnav.prev'), next = gallery.querySelector('.gnav.next');
  if (prev) prev.classList.toggle('disabled', idx === 0);
  if (next) next.classList.toggle('disabled', idx === count - 1);
  centerDots(gallery);
}

function render() {
  const list = getVisible();
  el.count.textContent = list.length;
  if (el.heroCount) el.heroCount.textContent = inventory.length;
  el.empty.hidden = list.length > 0;

  const page = list.slice(0, state.shown);
  const cards = page.map(cardHTML);
  if (page.length >= 4) cards.splice(4, 0, promoHTML());   // editorial tile
  el.grid.innerHTML = cards.join('');

  el.loadMoreWrap.hidden = state.shown >= list.length;
  renderActiveFilters();
  centerAllDots();
  syncCompareUI();
  updateRefineIndicator();
  syncSortUI();
}

// Count of active filter categories (for the "Refine • N" toolbar indicator).
function activeFilterCount() {
  const f = state.filters;
  let n = 0;
  if (f.brand.size) n++;
  if (f.minPrice > 0 || f.maxPrice < PRICE_MAX) n++;
  if (f.condition.size) n++;
  if (f.minYear != null || f.maxYear != null) n++;
  if (f.location.size) n++;
  return n;
}
function updateRefineIndicator() {
  const n = activeFilterCount();
  document.querySelectorAll('.refine-count').forEach(s => {
    s.textContent = n ? String(n) : '';
    s.hidden = !n;
  });
}

// Chips for each active filter (removable) + a Save-your-search button.
function renderActiveFilters() {
  const f = state.filters;
  const chips = [];
  ['brand', 'model', 'dealer', 'exterior', 'interior', 'condition', 'location'].forEach(k => f[k].forEach(v => chips.push([k, v])));
  if (f.category) chips.push(['category', CATEGORY_LABEL[f.category]]);
  if (f.certifiedOnly) chips.push(['certified', 'Certified only']);
  if (f.minPrice > 0) chips.push(['priceMin', 'From ' + peso(f.minPrice)]);
  if (f.maxPrice < PRICE_MAX) chips.push(['priceMax', 'Up to ' + peso(f.maxPrice)]);
  if (f.minYear != null) chips.push(['minYear', 'Year from ' + f.minYear]);
  if (f.maxYear != null) chips.push(['maxYear', 'Year to ' + f.maxYear]);
  if (f.maxMileage < MILE_MAX) chips.push(['mileage', 'Up to ' + km(f.maxMileage)]);
  const box = el.activeFilters;
  if (!chips.length) { box.hidden = true; box.innerHTML = ''; return; }
  box.hidden = false;
  box.innerHTML = chips.map(([k, v]) =>
    `<button class="afilter-chip" data-remove="${k}" data-val="${v}">${v}<span aria-hidden="true">×</span></button>`
  ).join('') + `<button class="save-search" data-action="save-search">Save your search</button>`;
}

/* ---------- Inquiry form (→ client's Viber with the car link) ---------- */
function openInquire(car) {
  if (!car) return;
  state.inquireCar = car;
  const imgs = carImages(car);
  const hex = COLOR_HEX[car.color];
  el.inquireHead.innerHTML = `
    <div class="inq-head-img">
      <img src="${imgs[0] || ''}" data-fallback="${carPhoto(hex, 0)}" onerror="photoFallback(this)" alt="${car.year} ${car.model}" />
    </div>
    <div class="inq-head-info">
      <h3>${car.model}</h3>
      <p>${car.year} &nbsp;|&nbsp; ${km(car.mileage)}</p>
      <p class="inq-head-dealer">◉ ${car.dealer}</p>
    </div>
    <div class="inq-head-price ${car.priceOnRequest ? 'on-request' : ''}">${priceLabel(car)}</div>`;
  el.inquireForm.reset();
  el.inquireForm.hidden = false;
  el.inquireDone.hidden = true;
  el.inquireModal.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeInquire() { el.inquireModal.hidden = true; document.body.style.overflow = ''; }
el.inquireClose.addEventListener('click', closeInquire);
el.inquireDoneClose.addEventListener('click', closeInquire);
el.inquireModal.addEventListener('click', e => { if (e.target === el.inquireModal) closeInquire(); });

// Build the inquiry text (customer + full vehicle details + DIRECT vehicle URL).
function buildInquiryText() {
  const f = el.inquireForm, car = state.inquireCar;
  const texts = f.querySelectorAll('input[type=text]');   // first, last, city, zip
  const val = e => (e && e.value || '').trim();
  const first = val(texts[0]), last = val(texts[1]), city = val(texts[2]), zip = val(texts[3]);
  const email = val(f.querySelector('input[type=email]'));
  const tel = val(f.querySelector('input[type=tel]'));
  const note = val(f.querySelector('textarea'));
  const contactBy = f.querySelectorAll('input[name=contactBy]')[0].checked ? 'Email' : 'Telephone';
  const link = location.origin + location.pathname + '#vehicle/' + carSlug(car);
  return `Hello Supercar Philippines!\n` +
    `I'm interested in this vehicle:\n` +
    `${car.brand} ${car.model}\n` +
    `Year: ${car.year}\n` +
    `Price: ${priceLabel(car)}\n\n` +
    `Customer:\n` +
    `Name: ${first} ${last}\n` +
    `Phone: ${tel}\n` +
    `Email: ${email}\n` +
    `City: ${city}${zip ? ' ' + zip : ''}\n` +
    `Preferred contact: ${contactBy}\n\n` +
    `Message:\n${note || "I'm interested in this vehicle."}\n\n` +
    `Vehicle link:\n${link}`;
}

// Submit → prepare the inquiry text, auto-copy it, show the "ready" screen,
// and (on mobile) open Viber straight away.
el.inquireForm.addEventListener('submit', e => {
  e.preventDefault();
  const f = el.inquireForm;
  if (!f.checkValidity()) { f.reportValidity(); return; }
  const inquiry = buildInquiryText();
  document.getElementById('inqReadyText').value = inquiry;
  f.hidden = true;
  el.inquireDone.hidden = false;
  copyToClipboard(inquiry);
  if (isMobileDevice()) window.location.href = VIBER_CHAT_LINK;
});
document.getElementById('copyInquiry').addEventListener('click', async e => {
  if (await copyToClipboard(document.getElementById('inqReadyText').value)) flashCopied(e.currentTarget);
});
document.getElementById('copyNumber').addEventListener('click', async e => {
  if (await copyToClipboard('+63 999 937 7194')) flashCopied(e.currentTarget);
});
// Open Viber button: auto-copy the full inquiry, THEN open the exact deep link
// that's in the HTML (viber://chat?number=…) — read straight off the element so
// the working link is never rewritten.
document.getElementById('openViber').addEventListener('click', async e => {
  e.preventDefault();
  const link = e.currentTarget.getAttribute('href');
  const ok = await copyToClipboard(document.getElementById('inqReadyText').value);
  if (!ok) {
    const hint = document.querySelector('.inq-viber-hint');
    if (hint) hint.textContent = 'Couldn’t copy automatically — tap “Copy Inquiry”, then paste it in Viber.';
  }
  window.location.href = link;
});

/* ---------- Vehicle detail view ---------- */
// A vehicle id may be a small integer (static fallback) or a UUID string
// (Supabase). idNum() derives a stable number so VIN/STOCK/phone stay clean for
// both. cidOf() resolves a data-* attribute string back to the real c.id value
// (number for static, string for DB) so Set membership/find comparisons match.
const idNum = c => { const n = Number(c.id); return Number.isFinite(n) ? n : [...String(c.id)].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 0); };
const cidOf = raw => { const c = inventory.find(x => String(x.id) === String(raw)); return c ? c.id : raw; };
const vin = c => `VLC${c.year}${c.model.replace(/\W/g, '').slice(0, 2).toUpperCase()}${String(idNum(c)).padStart(6, '0').slice(-6)}`;
const stock = c => `PM${String(261100 + (idNum(c) % 900000))}`;

function detailThumbsHTML(imgs, dhex, activeIdx, expanded) {
  const MAX = 3;
  const showAll = expanded || imgs.length <= MAX + 1;
  const shown = showAll ? imgs.length : MAX;
  let html = imgs.slice(0, shown).map((src, i) =>
    `<button class="detail-thumb${i === activeIdx ? ' active' : ''}" data-i="${i}" aria-label="Photo ${i + 1}">
       <img src="${src}" data-fallback="${carPhoto(dhex, i)}" onerror="photoFallback(this)" alt="" />
     </button>`).join('');
  if (!showAll) {
    html += `<button class="detail-thumb detail-thumb-more" data-more="1" aria-label="Show all photos">
       <img src="${imgs[MAX]}" data-fallback="${carPhoto(dhex, MAX)}" onerror="photoFallback(this)" alt="" /><span>+${imgs.length - MAX}</span>
     </button>`;
  }
  return html;
}

function setDetailImage(idx) {
  const imgs = state.detailImgs || [];
  if (!imgs.length) return;
  idx = Math.min(imgs.length - 1, Math.max(0, idx));
  state.detailImgIdx = idx;
  el.detailHero.querySelectorAll('.dslide').forEach((s, i) => s.classList.toggle('active', i === idx));
  el.detailHero.querySelectorAll('.ddot').forEach((d, i) => d.classList.toggle('active', i === idx));
  const prev = el.detailHero.querySelector('.dnav.prev'), next = el.detailHero.querySelector('.dnav.next');
  if (prev) prev.classList.toggle('disabled', idx === 0);
  if (next) next.classList.toggle('disabled', idx === imgs.length - 1);
  el.detailThumbs.querySelectorAll('.detail-thumb').forEach(t => {
    if (t.dataset.i != null) t.classList.toggle('active', +t.dataset.i === idx);
  });
}

// Build the detailed spec sheet from ONLY the fields that actually exist on the
// vehicle. Empty / null / missing values are skipped entirely (no "--", no fakes).
const escHtml = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function buildSpecSheet(car) {
  const row = (label, val) => (val == null || val === '') ? '' :
    `<div class="spec-row"><span class="k">${label}</span><span class="v">${escHtml(val)}</span></div>`;
  const group = (title, rowsHtml) => rowsHtml
    ? `<div class="spec-group"><h3 class="spec-group-title">${title}</h3><div class="spec-rows">${rowsHtml}</div></div>` : '';

  // Vehicle Overview
  const overview = [
    row('Year', car.year || ''),
    row('Mileage', (car.mileage != null && car.mileage !== '') ? km(car.mileage) : ''),
    row('Condition', car.isNew ? 'New' : 'Pre-Owned'),
    row('Exterior Color', car.color),
    row('Interior Color', car.interior),
    row('Location', car.location),
    row('Dealer', car.dealer),
    car.certified ? row('Status', 'Certified / Approved') : ''
  ].join('');

  // Performance & Technical — only fields present in the data (no transmission /
  // top-speed / 0–100 columns exist, so they are omitted rather than invented).
  const perf = [
    row('Engine', car.engine),
    row('Horsepower', car.hp ? car.hp + ' hp' : ''),
    row('Drivetrain', car.drivetrain)
  ].join('');

  let html = group('Vehicle Overview', overview) + group('Performance &amp; Technical Specifications', perf);

  // Additional Information — description and any other existing extras.
  const extras = [car.featured ? row('Listing', 'Featured') : ''].join('');
  if (car.description || extras) {
    html += `<div class="spec-group"><h3 class="spec-group-title">Additional Information</h3>`
      + (car.description ? `<p class="spec-desc">${escHtml(car.description)}</p>` : '')
      + (extras ? `<div class="spec-rows">${extras}</div>` : '')
      + `</div>`;
  }
  return html;
}

function renderDetail(car) {
  state.detailCar = car;
  const imgs = carImages(car);
  const dhex = COLOR_HEX[car.color];
  state.detailImgs = imgs;
  state.detailImgIdx = 0;
  const multi = imgs.length > 1;
  el.detailHero.innerHTML = imgs.length
    ? `<div class="detail-main">
         ${imgs.map((src, i) => `<img class="dslide${i === 0 ? ' active' : ''}" src="${src}" data-fallback="${carPhoto(dhex, i)}" onerror="photoFallback(this)" alt="${car.year} ${car.model} photo ${i + 1}" />`).join('')}
         ${multi ? `<button class="dnav prev disabled" data-dir="-1" aria-label="Previous photo">‹</button><button class="dnav next" data-dir="1" aria-label="Next photo">›</button>` : ''}
         ${multi ? `<div class="ddots">${imgs.map((_, i) => `<button class="ddot${i === 0 ? ' active' : ''}" data-i="${i}" aria-label="Photo ${i + 1}"></button>`).join('')}</div>` : ''}
       </div>`
    : `<div class="detail-main coming-soon"><span class="cs-mark">S</span><span class="cs-text">Photos Coming Soon</span></div>`;
  el.detailThumbs.innerHTML = detailThumbsHTML(imgs, dhex, 0, false);

  const db = document.getElementById('detailBrand'); if (db) db.textContent = car.brand;
  el.detailTitle.textContent = car.model;
  el.detailMeta.innerHTML = `${car.year}<span class="sep">|</span>${km(car.mileage)}<span class="sep">|</span>◉ ${car.dealer}`;
  el.detailIds.innerHTML = `VIN# <strong>${vin(car)}</strong><span class="sep">|</span>STOCK# <strong>${stock(car)}</strong>`;
  el.detailPrice.textContent = priceLabel(car);
  el.detailPrice.classList.toggle('on-request', !!car.priceOnRequest);
  el.detailFav.classList.toggle('active', state.favorites.has(car.id));

  el.detailSpecs.innerHTML = buildSpecSheet(car);

  el.detailPrev.classList.toggle('disabled', state.detailIdx <= 0);
  el.detailNext.classList.toggle('disabled', state.detailIdx >= state.detailList.length - 1);

  el.detailShowroom.innerHTML = `
    <div class="showroom-card">
      <p class="showroom-eyebrow">Showroom</p>
      <h3 class="showroom-name">${car.dealer}</h3>
      <div class="showroom-cols">
        <div>
          <p class="showroom-label">Contacts</p>
          <a href="#">(+63) 2 8555 0${String(100 + (idNum(car) % 900))}</a>
          <p>${car.dealer}, ${car.location}</p>
          <a href="#">supercarphilippines.ph</a>
        </div>
        <div>
          <p class="showroom-label">Opening Hours</p>
          <p class="hours"><span>Monday – Friday</span><span>9:00 AM – 6:00 PM</span></p>
          <p class="hours"><span>Saturday</span><span>9:00 AM – 5:00 PM</span></p>
          <p class="hours"><span>Sunday</span><span>Closed</span></p>
        </div>
        <div class="showroom-actions">
          <button class="btn-details">Dealer Stock</button>
          <button class="cta-inquire detail-inquire">Inquire</button>
        </div>
      </div>
    </div>`;

  const related = [
    ...inventory.filter(c => c.model === car.model && c.id !== car.id),
    ...inventory.filter(c => c.model !== car.model),
  ].slice(0, 4);
  el.detailRelated.innerHTML = related.map(cardHTML).join('');
  el.detailRelated.querySelectorAll('.gallery').forEach(centerDots);
}

function showDetail(car) {
  state.detailList = getVisible();
  state.detailIdx = state.detailList.findIndex(c => c.id === car.id);
  if (state.detailIdx < 0) { state.detailList = inventory.slice(); state.detailIdx = state.detailList.findIndex(c => c.id === car.id); }
  renderDetail(car);
  el.detail.hidden = false;
  document.body.classList.add('detail-open');
  window.scrollTo({ top: 0, behavior: 'auto' });
}
function hideDetail() {
  el.detail.hidden = true;
  document.body.classList.remove('detail-open');
}
function openDetail(car) { location.hash = 'vehicle/' + carSlug(car); }
function stepDetail(dir) {
  const i = state.detailIdx + dir;
  if (i < 0 || i > state.detailList.length - 1) return;
  openDetail(state.detailList[i]);
}

// Ensure the listings view is showing (used by nav actions).
function showListings() {
  hideDetail();
  if (location.hash.startsWith('#vehicle')) history.replaceState(null, '', location.pathname + location.search);
}

// Route from the URL hash: a vehicle page, or the listings (optionally Favorites).
// Matches by full slug (works for numeric ids AND Supabase UUIDs), with a
// legacy trailing-number fallback for older links.
function routeFromHash() {
  const h = location.hash;
  const slugMatch = h.match(/^#vehicle\/(.+)$/);
  if (slugMatch) {
    const slug = slugMatch[1];
    let car = inventory.find(c => carSlug(c) === slug);
    if (!car) { const n = slug.match(/-(\d+)$/); if (n) car = inventory.find(c => String(c.id) === n[1]); }
    if (car) { showDetail(car); return; }
  }
  hideDetail();
  if (h === '#favorites') setFavorites(true);
  else if (state.favoritesOnly) setFavorites(false);
}

/* ---------- Events ---------- */
function rerender() { state.shown = PAGE_SIZE; render(); }

document.querySelectorAll('.sort-select').forEach(sel => {
  sel.addEventListener('change', e => {
    state.sort = e.target.value;
    document.querySelectorAll('.sort-select').forEach(s => { s.value = state.sort; });
    rerender();
  });
});
el.loadMore.addEventListener('click', () => { state.shown += PAGE_SIZE; render(); });

/* ===== Filters & Sort drawer — drill-down category list =====
   Main screen lists categories (Brand › Price › Condition › Year › Location ›
   Sort); tapping one opens just that category with a back button. Edits go into
   a draft and only touch the grid on Search, so every selected filter applies
   together (AND logic). */
const FILTER_BRANDS = ['Lamborghini', 'Ferrari', 'Porsche', 'McLaren'];
const SORT_OPTIONS = [
  ['featured', 'Recommended'],
  ['year-desc', 'Newest Listed'],
  ['price-asc', 'Price: Low to High'],
  ['price-desc', 'Price: High to Low'],
  ['mileage-asc', 'Mileage: Low to High'],
];
const CAT_LABEL = { brand: 'Brand', price: 'Price', condition: 'Condition', year: 'Year', location: 'Location', sort: 'Sort' };
const CATS = ['brand', 'price', 'condition', 'year', 'location', 'sort'];
function locationValues() { return uniq(inventory.map(c => c.location)).sort(); }
function phpShort(base) { const m = base * 57 / 1e6; return '₱' + (Number.isInteger(m) ? m : m.toFixed(1)) + 'M'; }

let draft = null;          // working copy of state.filters while the drawer is open
let draftSort = 'featured';
let drawerView = 'menu';   // 'menu' or one of CATS

function cloneFilters(f) {
  return {
    brand: new Set(f.brand), model: new Set(f.model), dealer: new Set(f.dealer),
    exterior: new Set(f.exterior), interior: new Set(f.interior),
    condition: new Set(f.condition), location: new Set(f.location),
    certifiedOnly: f.certifiedOnly, minPrice: f.minPrice, maxPrice: f.maxPrice,
    minYear: f.minYear, maxYear: f.maxYear, maxMileage: f.maxMileage,
    category: f.category || null,
  };
}
function commitDraft() {
  const s = state.filters, d = draft;
  s.brand = new Set(d.brand); s.model = new Set(d.model); s.dealer = new Set(d.dealer);
  s.exterior = new Set(d.exterior); s.interior = new Set(d.interior);
  s.condition = new Set(d.condition); s.location = new Set(d.location);
  s.certifiedOnly = d.certifiedOnly; s.minPrice = d.minPrice; s.maxPrice = d.maxPrice;
  s.minYear = d.minYear; s.maxYear = d.maxYear; s.maxMileage = d.maxMileage;
  s.category = d.category || null;
}
function updateDrawerCount() { if (el.filterResultCount) el.filterResultCount.textContent = getVisible(draft).length; }

// Short active-summary shown beside each category on the menu screen.
function catSummary(cat) {
  const f = draft;
  if (cat === 'brand') return f.brand.size ? `${f.brand.size} selected` : 'All';
  if (cat === 'location') return f.location.size ? `${f.location.size} selected` : 'All';
  if (cat === 'condition') return f.condition.size ? [...f.condition].join(', ') : 'Any';
  if (cat === 'sort') return (SORT_OPTIONS.find(o => o[0] === draftSort) || SORT_OPTIONS[0])[1];
  if (cat === 'price') {
    const lo = f.minPrice > 0, hi = f.maxPrice < PRICE_MAX;
    if (lo && hi) return `${phpShort(f.minPrice)} – ${phpShort(f.maxPrice)}`;
    if (lo) return `From ${phpShort(f.minPrice)}`;
    if (hi) return `Up to ${phpShort(f.maxPrice)}`;
    return 'Any';
  }
  if (cat === 'year') {
    if (f.minYear != null && f.maxYear != null) return `${f.minYear} – ${f.maxYear}`;
    if (f.minYear != null) return `From ${f.minYear}`;
    if (f.maxYear != null) return `Up to ${f.maxYear}`;
    return 'Any';
  }
  return '';
}
const DEFAULT_SUMS = { brand: 'All', location: 'All', condition: 'Any', price: 'Any', year: 'Any', sort: 'Recommended' };

function menuHTML() {
  return CATS.map(cat => {
    const sum = catSummary(cat);
    const active = sum !== DEFAULT_SUMS[cat] ? ' active' : '';
    return `<button class="fcat" data-cat="${cat}">
      <span class="fcat-label">${CAT_LABEL[cat]}</span>
      <span class="fcat-sum${active}">${sum}</span>
      <span class="fcat-chev">›</span>
    </button>`;
  }).join('');
}
function categoryHTML(cat) {
  const f = draft;
  if (cat === 'brand') {
    return `<div class="fchecks fchecks--col">${FILTER_BRANDS.map(v =>
      `<label class="fcheck"><input type="checkbox" data-brand="${v}" ${f.brand.has(v) ? 'checked' : ''} /><span>${v}</span></label>`).join('')}</div>`;
  }
  if (cat === 'location') {
    return `<div class="fchecks fchecks--col">${locationValues().map(v =>
      `<label class="fcheck"><input type="checkbox" data-location="${v}" ${f.location.has(v) ? 'checked' : ''} /><span>${v}</span></label>`).join('')}</div>`;
  }
  if (cat === 'condition') {
    return `<div class="fchecks fchecks--col">${['New', 'Pre-Owned'].map(v =>
      `<label class="fcheck"><input type="radio" name="fcondition" data-condition="${v}" ${f.condition.has(v) ? 'checked' : ''} /><span>${v}</span></label>`).join('')}</div>`;
  }
  if (cat === 'sort') {
    return `<div class="fchecks fchecks--col">${SORT_OPTIONS.map(([val, label]) =>
      `<label class="fcheck"><input type="radio" name="fsort" data-sort="${val}" ${draftSort === val ? 'checked' : ''} /><span>${label}</span></label>`).join('')}</div>`;
  }
  if (cat === 'price') {
    const minPhp = f.minPrice > 0 ? Math.round(f.minPrice * 57) : '';
    const maxPhp = f.maxPrice < PRICE_MAX ? Math.round(f.maxPrice * 57) : '';
    return `<div class="frange frange--col">
      <label class="frange-field"><span class="frange-cap">Minimum</span>
        <span class="frange-input"><i>₱</i><input type="number" id="priceMin" min="0" step="500000" placeholder="0" value="${minPhp}" /></span></label>
      <label class="frange-field"><span class="frange-cap">Maximum</span>
        <span class="frange-input"><i>₱</i><input type="number" id="priceMax" min="0" step="500000" placeholder="Any" value="${maxPhp}" /></span></label>
    </div>`;
  }
  if (cat === 'year') {
    return `<div class="frange frange--col">
      <label class="frange-field"><span class="frange-cap">Minimum Year</span>
        <span class="frange-input"><input type="number" id="yearMin" min="2000" max="2030" placeholder="Any" value="${f.minYear ?? ''}" /></span></label>
      <label class="frange-field"><span class="frange-cap">Maximum Year</span>
        <span class="frange-input"><input type="number" id="yearMax" min="2000" max="2030" placeholder="Any" value="${f.maxYear ?? ''}" /></span></label>
    </div>`;
  }
  return '';
}
// Render either the category menu or a single category, with a slide transition.
function renderDrawer(dir) {
  const back = document.getElementById('filterBack');
  const title = document.getElementById('filterTitle');
  if (drawerView === 'menu') {
    if (back) back.hidden = true;
    if (title) title.textContent = 'Filters & Sort';
    el.filterBody.innerHTML = `<div class="fmenu">${menuHTML()}</div>`;
  } else {
    if (back) back.hidden = false;
    if (title) title.textContent = CAT_LABEL[drawerView];
    el.filterBody.innerHTML = `<div class="fcategory">${categoryHTML(drawerView)}</div>`;
  }
  el.filterBody.classList.remove('slide-next', 'slide-back');
  void el.filterBody.offsetWidth;                       // restart the animation
  el.filterBody.classList.add(dir === 'back' ? 'slide-back' : 'slide-next');
  el.filterBody.scrollTop = 0;
  updateDrawerCount();
}

function openFilters() {
  draft = cloneFilters(state.filters);
  draftSort = state.sort;
  drawerView = 'menu';
  renderDrawer('next');
  el.filterModal.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeFilters() { el.filterModal.hidden = true; document.body.style.overflow = ''; }

function applyFilters() {          // commit every selected filter + sort together
  commitDraft();
  state.sort = draftSort;
  document.querySelectorAll('.sort-select').forEach(s => { s.value = state.sort; });
  state.favoritesOnly = false;
  state.shown = PAGE_SIZE;
  render();
  closeFilters();
}
function clearFilters() {          // clear all → back to the full inventory
  draft.brand.clear(); draft.model.clear(); draft.dealer.clear();
  draft.exterior.clear(); draft.interior.clear(); draft.condition.clear(); draft.location.clear();
  draft.certifiedOnly = false; draft.minPrice = 0; draft.maxPrice = PRICE_MAX;
  draft.minYear = null; draft.maxYear = null; draft.maxMileage = MILE_MAX;
  draft.category = null;
  draftSort = 'featured';
  drawerView = 'menu';
  renderDrawer('back');            // back to the category list, all cleared
}

document.querySelectorAll('.refine-btn').forEach(b => b.addEventListener('click', openFilters));
el.filterClose.addEventListener('click', closeFilters);
el.filterModal.addEventListener('click', e => { if (e.target === el.filterModal) closeFilters(); });
el.filterApply.addEventListener('click', applyFilters);
el.filterClear.addEventListener('click', clearFilters);
const _filterBack = document.getElementById('filterBack');
if (_filterBack) _filterBack.addEventListener('click', () => { drawerView = 'menu'; renderDrawer('back'); });

// Tap a category row → open that category.
el.filterBody.addEventListener('click', e => {
  const row = e.target.closest('.fcat');
  if (!row) return;
  drawerView = row.dataset.cat;
  renderDrawer('next');
});
// Edit an option inside a category → update the draft + live count.
el.filterBody.addEventListener('input', e => {
  const t = e.target, f = draft;
  if (t.dataset.brand != null) { t.checked ? f.brand.add(t.dataset.brand) : f.brand.delete(t.dataset.brand); }
  else if (t.dataset.location != null) { t.checked ? f.location.add(t.dataset.location) : f.location.delete(t.dataset.location); }
  else if (t.dataset.condition != null) { f.condition = new Set([t.dataset.condition]); }
  else if (t.dataset.sort != null) { draftSort = t.dataset.sort; }
  else if (t.id === 'priceMin') { const v = parseFloat(t.value); f.minPrice = (isNaN(v) || v <= 0) ? 0 : v / 57; }
  else if (t.id === 'priceMax') { const v = parseFloat(t.value); f.maxPrice = (isNaN(v) || v <= 0) ? PRICE_MAX : v / 57; }
  else if (t.id === 'yearMin') { const v = parseInt(t.value, 10); f.minYear = isNaN(v) ? null : v; }
  else if (t.id === 'yearMax') { const v = parseInt(t.value, 10); f.maxYear = isNaN(v) ? null : v; }
  updateDrawerCount();
});

// Remove a single filter by clicking its chip.
el.activeFilters.addEventListener('click', e => {
  const chip = e.target.closest('.afilter-chip');
  if (!chip) return;
  const k = chip.dataset.remove, v = chip.dataset.val;
  const f = state.filters;
  if (['brand', 'model', 'dealer', 'exterior', 'interior', 'condition', 'location'].includes(k)) f[k].delete(v);
  else if (k === 'certified') f.certifiedOnly = false;
  else if (k === 'priceMin') f.minPrice = 0;
  else if (k === 'priceMax') f.maxPrice = PRICE_MAX;
  else if (k === 'minYear') f.minYear = null;
  else if (k === 'maxYear') f.maxYear = null;
  else if (k === 'mileage') f.maxMileage = MILE_MAX;
  else if (k === 'category') {
    f.category = null;
    const lt = document.getElementById('listingsTitle');
    if (lt) lt.textContent = state.favoritesOnly ? 'Your Saved Vehicles' : LISTINGS_TITLE;
  }
  state.shown = PAGE_SIZE;
  render();
  if (!el.filterModal.hidden) { draft = cloneFilters(state.filters); draftSort = state.sort; drawerView = 'menu'; renderDrawer('back'); }
});

/* ===== Nav actions handled on the cars page (filters + favorites) ===== */
const LISTINGS_TITLE = 'Available Cars';
function setFavorites(on) {
  state.favoritesOnly = on;
  state.shown = PAGE_SIZE;
  document.querySelectorAll('[data-action="favorites"]').forEach(x => x.classList.toggle('active', on));
  const fb = document.getElementById('favBack'); if (fb) fb.hidden = !on;
  const lt = document.getElementById('listingsTitle'); if (lt) lt.textContent = on ? 'Your Saved Vehicles' : LISTINGS_TITLE;
  render();
}
const CARS_ACTIONS = ['brand-filter', 'budget', 'browse', 'models', 'favorites', 'back-search'];
document.addEventListener('click', e => {
  const a = e.target.closest('[data-action]');
  if (!a) return;
  const action = a.dataset.action;
  if (!CARS_ACTIONS.includes(action)) return;   // INFO actions are handled in shared.js
  e.preventDefault();
  switch (action) {
    case 'browse': resetAll(); showListings(); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 60); break;
    case 'models': resetAll(); showListings(); setTimeout(() => scrollToEl('.results'), 80); break;
    case 'brand-filter': {
      state.filters.brand.clear();
      state.filters.brand.add(a.dataset.brand);
      state.favoritesOnly = false;
      showListings(); state.shown = PAGE_SIZE; render();
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80);
      break;
    }
    case 'budget': {
      state.filters.maxPrice = +a.dataset.max;
      state.favoritesOnly = false;
      showListings(); state.shown = PAGE_SIZE; render();
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80);
      break;
    }
    case 'favorites': showListings(); setFavorites(true); setTimeout(() => scrollToEl('.results'), 80); break;
    case 'back-search': setFavorites(false); scrollToEl('.results'); break;
  }
});

/* ===== Top-nav entry points: always enter a clean section =====
   These run only on cars.html. A plain <a href="cars.html"> click does NOT
   reload when the URL is already bare cars.html (e.g. after filtering via the
   drawer), so in-memory filters would linger. We intercept and reset explicitly,
   and rewrite the URL so no ?brand=/?budget=/#favorites carries over. Favorites
   (localStorage) are never touched — filters and saved cars are separate state. */
function closeMenuIfOpen() {
  const mm = document.getElementById('megaMenu');
  if (mm && !mm.hidden) { mm.hidden = true; document.body.style.overflow = ''; }
}
function goAllCars() {
  closeFilters(); closeMenuIfOpen(); hideDetail();
  resetAll();                                    // clears every vehicle filter + sort; keeps saved favorites
  history.replaceState(null, '', 'cars.html');   // drop ?brand=/?budget=/#favorites from the URL
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function goFavorites() {
  closeFilters(); closeMenuIfOpen(); hideDetail();
  resetAll();                                    // drop vehicle filters (saved favorites untouched)
  history.replaceState(null, '', 'cars.html#favorites');
  setFavorites(true);
  setTimeout(() => scrollToEl('.results'), 60);
}
// Bind AFTER other listeners so our reset wins. Favorites links first so the
// broader cars.html selector doesn't double-handle them.
document.querySelectorAll('a[href="cars.html#favorites"]').forEach(a =>
  a.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); goFavorites(); }));
document.querySelectorAll('a[href="cars.html"]').forEach(a =>
  a.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); goAllCars(); }));

// Directory links (Pre-Owned by Model / by Dealer) → filter the listings.
document.addEventListener('click', e => {
  const link = e.target.closest('.directory-grid a');
  if (!link) return;
  e.preventDefault();
  const val = link.textContent.trim();
  const isModel = !!link.closest('#modelsDir');
  const f = state.filters;
  f.brand.clear(); f.model.clear(); f.dealer.clear(); f.exterior.clear(); f.interior.clear();
  f.condition.clear(); f.location.clear();
  f.certifiedOnly = false; f.minPrice = 0; f.maxPrice = PRICE_MAX; f.minYear = null; f.maxYear = null; f.maxMileage = MILE_MAX;
  state.favoritesOnly = false; state.shown = PAGE_SIZE;
  const fb = document.getElementById('favBack'); if (fb) fb.hidden = true;
  const lt = document.getElementById('listingsTitle'); if (lt) lt.textContent = isModel ? `Used ${val}` : `${val} Inventory`;
  if (isModel) { if (inventory.some(c => c.model === val)) f.model.add(val); }
  else { if (inventory.some(c => c.dealer === val)) f.dealer.add(val); }
  showListings();
  render();
  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80);
});

// View toggles (list / grid).
const VIEW_KEY = 'sp_view';
function applyView(view) {
  document.querySelectorAll('.view-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  el.grid.classList.toggle('list-view', view === 'list');
}
document.addEventListener('click', e => {
  const btn = e.target.closest('.view-btn');
  if (!btn) return;
  const view = btn.dataset.view;
  applyView(view);
  try { sessionStorage.setItem(VIEW_KEY, view); } catch (err) {}
  centerAllDots();
});

// Card clicks: favorite toggle, gallery nav, inquiry, or open the vehicle page.
function onCardAreaClick(e) {
  const favBtn = e.target.closest('[data-fav]');
  if (favBtn) {
    e.stopPropagation();
    const id = cidOf(favBtn.dataset.fav);
    state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
    favBtn.classList.toggle('active');
    saveFavorites();
    return;
  }
  const cmpBtn = e.target.closest('[data-compare]');
  if (cmpBtn) {
    e.stopPropagation();
    toggleCompare(cidOf(cmpBtn.dataset.compare));
    return;
  }
  const dot = e.target.closest('.gdot');
  const nav = e.target.closest('.gnav');
  if (dot || nav) {
    e.stopPropagation();
    const gallery = e.target.closest('.gallery');
    const idx = dot ? +dot.dataset.i : +gallery.dataset.idx + +nav.dataset.dir;
    setGalleryIndex(gallery, idx);
    return;
  }
  if (e.target.closest('.gdots') || e.target.closest('.gnav')) return;
  if (Date.now() - swipeGuard < 350) return;

  const inquireBtn = e.target.closest('.btn-inquire');
  if (inquireBtn) {
    e.stopPropagation();
    const car = inventory.find(c => String(c.id) === inquireBtn.dataset.id);
    if (car) openInquire(car);
    return;
  }
  const detailsBtn = e.target.closest('.btn-details');
  const card = e.target.closest('.card');
  const id = detailsBtn ? detailsBtn.dataset.id : (card ? card.dataset.id : null);
  if (id != null) {
    const car = inventory.find(c => String(c.id) === id);
    if (car) openDetail(car);
  }
}
el.grid.addEventListener('click', onCardAreaClick);
el.detailRelated.addEventListener('click', onCardAreaClick);

// Swipe left/right to change a card's photo (touch), with a guard so the
// swipe-end click doesn't also open the vehicle page.
let swipeGuard = 0;
function addSwipe(container) {
  let x0 = null, y0 = null, gal = null;
  container.addEventListener('touchstart', e => {
    const g = e.target.closest('.gallery');
    if (!g || +g.dataset.count < 2) { gal = null; return; }
    gal = g; x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
  }, { passive: true });
  container.addEventListener('touchend', e => {
    if (!gal || x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    const dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      setGalleryIndex(gal, +gal.dataset.idx + (dx < 0 ? 1 : -1));
      swipeGuard = Date.now();
    }
    gal = null; x0 = null; y0 = null;
  }, { passive: true });
}
addSwipe(el.grid);
addSwipe(el.detailRelated);

// Vehicle-page controls.
el.detailBack.addEventListener('click', () => { if (location.hash) history.back(); else hideDetail(); });
el.detailPrev.addEventListener('click', () => stepDetail(-1));
el.detailNext.addEventListener('click', () => stepDetail(1));
el.detailFav.addEventListener('click', () => {
  const car = state.detailCar; if (!car) return;
  state.favorites.has(car.id) ? state.favorites.delete(car.id) : state.favorites.add(car.id);
  el.detailFav.classList.toggle('active', state.favorites.has(car.id));
  saveFavorites();
});
el.detail.addEventListener('click', e => {
  if (e.target.closest('.detail-inquire')) openInquire(state.detailCar);
});
el.detailThumbs.addEventListener('click', e => {
  if (e.target.closest('.detail-thumb-more')) {
    el.detailThumbs.innerHTML = detailThumbsHTML(state.detailImgs, COLOR_HEX[state.detailCar.color], state.detailImgIdx, true);
    return;
  }
  const t = e.target.closest('.detail-thumb');
  if (t && t.dataset.i != null) setDetailImage(+t.dataset.i);
});
el.detailHero.addEventListener('click', e => {
  const dot = e.target.closest('.ddot'), nav = e.target.closest('.dnav');
  if (dot) setDetailImage(+dot.dataset.i);
  else if (nav) setDetailImage(state.detailImgIdx + +nav.dataset.dir);
});
(() => {
  let x0 = null, y0 = null;
  el.detailHero.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  el.detailHero.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) setDetailImage(state.detailImgIdx + (dx < 0 ? 1 : -1));
    x0 = null; y0 = null;
  }, { passive: true });
})();

function resetAll() {
  const f = state.filters;
  f.brand.clear(); f.model.clear(); f.dealer.clear(); f.exterior.clear(); f.interior.clear();
  f.condition.clear(); f.location.clear();
  f.certifiedOnly = false; f.minPrice = 0; f.maxPrice = PRICE_MAX; f.minYear = null; f.maxYear = null; f.maxMileage = MILE_MAX;
  state.favoritesOnly = false;
  document.querySelectorAll('[data-action="favorites"]').forEach(x => x.classList.remove('active'));
  const fb = document.getElementById('favBack'); if (fb) fb.hidden = true;
  const lt = document.getElementById('listingsTitle'); if (lt) lt.textContent = LISTINGS_TITLE;
  state.sort = 'featured'; state.shown = PAGE_SIZE;
  document.querySelectorAll('.sort-select').forEach(s => { s.value = 'featured'; });
  render();
  if (!el.filterModal.hidden) { draft = cloneFilters(state.filters); draftSort = state.sort; drawerView = 'menu'; renderDrawer('back'); }
}
el.clearFromEmpty.addEventListener('click', resetAll);

/* ===== Compare vehicles (max 3; separate state from Favorites) ===== */
function toggleCompare(id) {
  if (state.compare.has(id)) {
    state.compare.delete(id);
  } else {
    if (state.compare.size >= 3) { showCompareToast('You can compare up to 3 vehicles.'); return; }
    state.compare.add(id);
  }
  saveCompare();
  syncCompareUI();
}
function syncCompareUI() {
  document.querySelectorAll('[data-compare]').forEach(b =>
    b.classList.toggle('active', state.compare.has(cidOf(b.dataset.compare))));
  renderCompareBar();
}
function renderCompareBar() {
  const bar = document.getElementById('compareBar');
  if (!bar) return;
  const n = state.compare.size;
  bar.hidden = !state.compareMode || n === 0;
  const label = document.getElementById('compareLabel');
  if (label) label.textContent = n === 1 ? '1 vehicle selected' : `${n} vehicles selected`;
  const now = document.getElementById('compareNow');
  if (now) now.disabled = n < 2;
}
function showCompareToast(msg) {
  let t = document.getElementById('compareToast');
  if (!t) { t = document.createElement('div'); t.id = 'compareToast'; t.className = 'compare-toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
}
function clearCompare() {
  state.compare.clear();
  saveCompare();
  syncCompareUI();
  closeCompare();
}
// Compare Mode: the main Compare button toggles it. Off = clean cards (no
// checkboxes). On = a Compare control appears on every card. Turning it off
// clears the current selection and hides all compare controls.
function setCompareMode(on) {
  state.compareMode = on;
  document.body.classList.toggle('compare-mode', on);
  document.querySelectorAll('.compare-btn').forEach(b => b.classList.toggle('active', on));
  if (!on) { state.compare.clear(); saveCompare(); closeCompare(); }
  syncCompareUI();
}
function toggleCompareMode() { setCompareMode(!state.compareMode); }
// Main Compare button smart behavior:
//   off            → enter Compare Mode
//   on + selection → reset (uncheck all), stay in Compare Mode
//   on + empty     → exit Compare Mode
function onCompareButton() {
  if (!state.compareMode) { setCompareMode(true); return; }
  if (state.compare.size > 0) { state.compare.clear(); saveCompare(); syncCompareUI(); }
  else { setCompareMode(false); }
}
const COMPARE_ROWS = [
  ['Brand', c => c.brand],
  ['Model', c => c.model],
  ['Year', c => c.year],
  ['Price', c => priceLabel(c)],
  ['Condition', c => c.isNew ? 'New' : 'Pre-Owned'],
  ['Mileage', c => km(c.mileage)],
  ['Location', c => c.location],
  ['Power', c => c.hp + ' hp'],
  ['Drivetrain', c => c.drivetrain],
  ['Engine', c => c.engine],
];
function renderCompareModal() {
  const cars = [...state.compare].map(id => inventory.find(c => c.id === id)).filter(Boolean);
  if (cars.length < 2) { closeCompare(); return; }
  const body = document.getElementById('compareModalBody');
  const headCols = cars.map(c => {
    const img = carImages(c)[0] || '';
    return `<div class="cmp-col">
      <div class="cmp-img"><img src="${img}" data-fallback="${carPhoto(COLOR_HEX[c.color], 0)}" onerror="photoFallback(this)" alt="${c.year} ${c.model}" />
        <button class="cmp-remove" data-cmp-remove="${c.id}" aria-label="Remove from compare">&times;</button></div>
      <div class="cmp-name">${c.brand}<br><strong>${c.model}</strong></div>
    </div>`;
  }).join('');
  const rows = COMPARE_ROWS.map(([label, fn]) =>
    `<div class="cmp-row"><div class="cmp-col cmp-labelcol">${label}</div>${cars.map(c => `<div class="cmp-col">${fn(c)}</div>`).join('')}</div>`
  ).join('');
  body.innerHTML = `<div class="cmp-grid" style="--cmp-cols:${cars.length}">
    <div class="cmp-row cmp-head"><div class="cmp-col cmp-labelcol"></div>${headCols}</div>
    ${rows}
  </div>`;
}
function openCompare() {
  if (state.compare.size < 2) { showCompareToast('Select at least 2 vehicles to compare.'); return; }
  renderCompareModal();
  document.getElementById('compareModal').hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeCompare() {
  const m = document.getElementById('compareModal');
  if (m) m.hidden = true;
  document.body.style.overflow = '';
}
// Wire compare controls (guarded so pages without them don't error).
(() => {
  const bar = document.getElementById('compareBar');
  const now = document.getElementById('compareNow');
  const clearBtn = document.getElementById('compareClear');
  const modal = document.getElementById('compareModal');
  const modalClose = document.getElementById('compareModalClose');
  const modalBody = document.getElementById('compareModalBody');
  const toolbarCompare = document.querySelectorAll('.compare-btn');
  if (now) now.addEventListener('click', openCompare);
  if (clearBtn) clearBtn.addEventListener('click', clearCompare);
  toolbarCompare.forEach(b => b.addEventListener('click', onCompareButton));
  if (modalClose) modalClose.addEventListener('click', closeCompare);
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeCompare(); });
  if (modalBody) modalBody.addEventListener('click', e => {
    const rm = e.target.closest('[data-cmp-remove]');
    if (!rm) return;
    state.compare.delete(cidOf(rm.dataset.cmpRemove));
    saveCompare();
    syncCompareUI();
    renderCompareModal();
  });
})();

// Cars-page modals close on Escape (shared.js handles the info modal + menu).
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (!el.filterModal.hidden) closeFilters();
  if (!el.inquireModal.hidden) closeInquire();
  const cm = document.getElementById('compareModal');
  if (cm && !cm.hidden) closeCompare();
});
window.addEventListener('resize', centerAllDots, { passive: true });
window.addEventListener('hashchange', routeFromHash);

/* ---------- Apply Home carousel selection (?brand= / ?budget=) ---------- */
function applyQueryFilters() {
  const p = new URLSearchParams(location.search);
  const brand = p.get('brand');
  const budget = p.get('budget');
  if (brand && inventory.some(c => c.brand === brand)) {
    state.filters.brand.clear();
    state.filters.brand.add(brand);
  }
  if (budget) {
    if (budget === '15') state.filters.maxPrice = 263000;        // Under ₱15M
    else if (budget === '25') state.filters.maxPrice = 440000;   // Under ₱25M
    else state.filters.maxPrice = PRICE_MAX;                     // Any Budget
  }
  // Category buttons (Luxury Cars / Supercar) from the nav + mega menu.
  const category = p.get('category');
  if (category === 'luxury' || category === 'supercar') {
    state.filters.category = category;
    const lt = document.getElementById('listingsTitle');
    if (lt) lt.textContent = CATEGORY_LABEL[category];
  }
}

/* ===== Custom animated Sort dropdown =====
   Enhances each .sort-control by hiding its native <select> (kept for logic +
   value) and rendering a styled, animated menu that drives it. */
function sortLabel(val) { const o = SORT_OPTIONS.find(o => o[0] === val); return o ? o[1] : SORT_OPTIONS[0][1]; }
function syncSortUI() {
  document.querySelectorAll('.sort-dd').forEach(dd => {
    const valEl = dd.querySelector('.sort-dd-value'); if (valEl) valEl.textContent = sortLabel(state.sort);
    dd.querySelectorAll('.sort-dd-opt').forEach(li => li.classList.toggle('active', li.dataset.val === state.sort));
    const sel = dd.querySelector('select'); if (sel && sel.value !== state.sort) sel.value = state.sort;
  });
}
function enhanceSortControls() {
  document.querySelectorAll('.sort-control').forEach(ctrl => {
    const select = ctrl.querySelector('select');
    if (!select || ctrl.classList.contains('sort-dd')) return;
    ctrl.classList.add('sort-dd');
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'sort-dd-trigger';
    trigger.innerHTML =
      `<span class="sort-dd-value">${sortLabel(state.sort)}</span>` +
      `<svg class="sort-dd-chev" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const menu = document.createElement('ul');
    menu.className = 'sort-dd-menu';
    menu.innerHTML = SORT_OPTIONS.map(([val, label]) => `<li class="sort-dd-opt" data-val="${val}">${label}</li>`).join('');
    ctrl.appendChild(trigger);
    ctrl.appendChild(menu);
    select.classList.add('sort-native-hidden');
    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = ctrl.classList.contains('open');
      document.querySelectorAll('.sort-dd.open').forEach(x => x.classList.remove('open'));
      if (!isOpen) ctrl.classList.add('open');
    });
    menu.addEventListener('click', e => {
      const li = e.target.closest('.sort-dd-opt'); if (!li) return;
      ctrl.classList.remove('open');
      if (li.dataset.val !== state.sort) { select.value = li.dataset.val; select.dispatchEvent(new Event('change', { bubbles: true })); }
    });
  });
  syncSortUI();
}
// Close any open sort menu on outside click or Escape.
document.addEventListener('click', () => document.querySelectorAll('.sort-dd.open').forEach(x => x.classList.remove('open')));
document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.sort-dd.open').forEach(x => x.classList.remove('open')); });

/* ---------- Init ---------- */
(async function initCars() {
  // Try Supabase (published vehicles); on any problem fall back to the built-in
  // static inventory so the page always renders.
  try {
    const dbCars = window.loadPublishedVehicles ? await loadPublishedVehicles() : null;
    if (dbCars && dbCars.length) applyVehicles(dbCars);
  } catch (e) { /* keep static inventory */ }
  applyQueryFilters();
  render();
  enhanceSortControls();
  // Restore the grid/list view choice for this session.
  try { const v = sessionStorage.getItem(VIEW_KEY); if (v) applyView(v); } catch (e) {}
  routeFromHash();   // open a vehicle directly if the URL already points to one
})();
