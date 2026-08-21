/* ============================================================
   Teshi SportsC — pre-owned listings
   Self-contained: sample inventory + filtering/sorting/modal.
   Swap `inventory` with a real API fetch when ready.
   ============================================================ */

// --- Placeholder car photo (SVG data-URI) so the demo needs no assets ---
// Draws a sleek studio-lit supercar tinted to `hex` (the listing's colour).
// `variant` flips the car left/right so carousel slides look distinct.
// Drop real photo URLs into a car's `images` array to override this.
function carPhoto(hex, variant = 0) {
  const flip = variant % 2 ? 'transform="translate(1200,0) scale(-1,1)"' : '';
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'>
    <defs>
      <radialGradient id='bg' cx='50%' cy='32%' r='82%'>
        <stop offset='0' stop-color='#fdfdfe'/><stop offset='.55' stop-color='#e9eaee'/><stop offset='1' stop-color='#c6c8ce'/>
      </radialGradient>
      <linearGradient id='paint' x1='0' y1='0' x2='0' y2='1'>
        <stop offset='0' stop-color='${hex}'/><stop offset='.5' stop-color='${hex}'/><stop offset='1' stop-color='#000' stop-opacity='.4'/>
      </linearGradient>
      <linearGradient id='glass' x1='0' y1='0' x2='0' y2='1'>
        <stop offset='0' stop-color='#454b54'/><stop offset='1' stop-color='#11141a'/>
      </linearGradient>
      <radialGradient id='rim' cx='42%' cy='38%' r='62%'>
        <stop offset='0' stop-color='#eceef1'/><stop offset='.7' stop-color='#9c9ea4'/><stop offset='1' stop-color='#4e5056'/>
      </radialGradient>
    </defs>
    <rect width='1200' height='800' fill='url(#bg)'/>
    <ellipse cx='612' cy='628' rx='475' ry='34' fill='#000' opacity='.18'/>
    <g ${flip}>
      <path d='M118 560 C150 495 208 470 300 464 L468 456 C518 400 585 370 700 370 C816 370 902 404 970 452 L1062 470 C1092 480 1098 514 1086 550 C1081 563 1069 567 1050 567 L150 567 C130 567 116 561 118 560 Z' fill='url(#paint)'/>
      <path d='M150 567 L1050 567 C1026 586 972 592 892 592 L300 592 C222 592 174 583 150 567 Z' fill='#000' opacity='.26'/>
      <path d='M505 452 C560 398 606 378 700 378 C793 378 858 402 903 450 Z' fill='url(#glass)'/>
      <path d='M842 470 L946 470 L980 502 L848 502 Z' fill='#16181e' opacity='.75'/>
      <path d='M180 502 C262 470 384 458 520 456 L520 467 C384 469 272 482 202 510 Z' fill='#fff' opacity='.28'/>
      <circle cx='316' cy='567' r='93' fill='#101216'/><circle cx='316' cy='567' r='53' fill='url(#rim)'/>
      <g stroke='#5b5d63' stroke-width='7' stroke-linecap='round'>
        <line x1='316' y1='567' x2='316' y2='520' transform='rotate(0 316 567)'/>
        <line x1='316' y1='567' x2='316' y2='520' transform='rotate(72 316 567)'/>
        <line x1='316' y1='567' x2='316' y2='520' transform='rotate(144 316 567)'/>
        <line x1='316' y1='567' x2='316' y2='520' transform='rotate(216 316 567)'/>
        <line x1='316' y1='567' x2='316' y2='520' transform='rotate(288 316 567)'/>
      </g>
      <circle cx='316' cy='567' r='14' fill='#33353b'/>
      <circle cx='906' cy='567' r='93' fill='#101216'/><circle cx='906' cy='567' r='53' fill='url(#rim)'/>
      <g stroke='#5b5d63' stroke-width='7' stroke-linecap='round'>
        <line x1='906' y1='567' x2='906' y2='520' transform='rotate(0 906 567)'/>
        <line x1='906' y1='567' x2='906' y2='520' transform='rotate(72 906 567)'/>
        <line x1='906' y1='567' x2='906' y2='520' transform='rotate(144 906 567)'/>
        <line x1='906' y1='567' x2='906' y2='520' transform='rotate(216 906 567)'/>
        <line x1='906' y1='567' x2='906' y2='520' transform='rotate(288 906 567)'/>
      </g>
      <circle cx='906' cy='567' r='14' fill='#33353b'/>
      <path d='M132 512 L188 506 L192 524 L138 532 Z' fill='#e9f2ff' opacity='.9'/>
    </g>
  </svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg.trim());
}

const COLOR_HEX = {
  Rosso: '#c1121f', Giallo: '#f2c200', Nero: '#141416',
  Bianco: '#e8e8e8', Grigio: '#7d7f83'
};

// --- Sample inventory ---
// priceOnRequest: true → show "Price on Request" instead of a figure.
const inventory = [
  { id: 1, model: '296 GTB', year: 2024, price: 389900, mileage: 1240, color: 'Rosso', interior: 'Nero', dealer: 'Teshi Makati', location: 'Makati, Metro Manila', certified: true, isNew: true, hp: 819, drivetrain: 'RWD', engine: '3.0L V6 Hybrid' },
  { id: 2, model: '296 GTB', year: 2023, price: 352500, mileage: 4890, color: 'Giallo', interior: 'Cuoio', dealer: 'Teshi BGC', location: 'Bonifacio Global City, Taguig', certified: true, isNew: false, hp: 819, drivetrain: 'RWD', engine: '3.0L V6 Hybrid' },
  { id: 3, model: '296 GTS', year: 2024, price: 0, priceOnRequest: true, mileage: 640, color: 'Nero', interior: 'Rosso', dealer: 'Teshi Cebu', location: 'Cebu City, Cebu', certified: true, isNew: true, hp: 819, drivetrain: 'RWD', engine: '3.0L V6 Hybrid' },
  { id: 4, model: 'SF90 Stradale', year: 2022, price: 549000, mileage: 6120, color: 'Rosso', interior: 'Nero', dealer: 'Teshi Manila', location: 'Ortigas, Pasig', certified: true, isNew: false, hp: 986, drivetrain: 'AWD', engine: '4.0L V8 Hybrid' },
  { id: 5, model: 'F8 Tributo', year: 2021, price: 298500, mileage: 11240, color: 'Grigio', interior: 'Nero', dealer: 'Teshi Alabang', location: 'Alabang, Muntinlupa', certified: false, isNew: false, hp: 710, drivetrain: 'RWD', engine: '3.9L V8' },
  { id: 6, model: 'Roma', year: 2023, price: 244900, mileage: 3980, color: 'Grigio', interior: 'Crema', dealer: 'Teshi Quezon City', location: 'Quezon City, Metro Manila', certified: true, isNew: false, hp: 612, drivetrain: 'RWD', engine: '3.9L V8' },
  { id: 7, model: '296 GTB', year: 2023, price: 368000, mileage: 2870, color: 'Nero', interior: 'Rosso', dealer: 'Teshi Davao', location: 'Davao City, Davao del Sur', certified: true, isNew: false, hp: 819, drivetrain: 'RWD', engine: '3.0L V6 Hybrid' },
  { id: 8, model: 'Portofino M', year: 2022, price: 231000, mileage: 8450, color: 'Bianco', interior: 'Blu', dealer: 'Teshi Iloilo', location: 'Iloilo City, Iloilo', certified: false, isNew: false, hp: 612, drivetrain: 'RWD', engine: '3.9L V8' },
  { id: 9, model: 'F8 Tributo', year: 2022, price: 315000, mileage: 5210, color: 'Giallo', interior: 'Nero', dealer: 'Teshi Pampanga', location: 'Angeles, Pampanga', certified: true, isNew: false, hp: 710, drivetrain: 'RWD', engine: '3.9L V8' },
  { id: 10, model: 'Roma', year: 2024, price: 262500, mileage: 780, color: 'Nero', interior: 'Cuoio', dealer: 'Teshi Makati', location: 'Makati, Metro Manila', certified: true, isNew: true, hp: 612, drivetrain: 'RWD', engine: '3.9L V8' },
  { id: 11, model: 'SF90 Stradale', year: 2023, price: 0, priceOnRequest: true, mileage: 2010, color: 'Nero', interior: 'Rosso', dealer: 'Teshi BGC', location: 'Bonifacio Global City, Taguig', certified: true, isNew: false, hp: 986, drivetrain: 'AWD', engine: '4.0L V8 Hybrid' },
  { id: 12, model: '296 GTS', year: 2023, price: 398500, mileage: 3320, color: 'Bianco', interior: 'Blu', dealer: 'Teshi Cebu', location: 'Cebu City, Cebu', certified: false, isNew: false, hp: 819, drivetrain: 'RWD', engine: '3.0L V6 Hybrid' },
];

// Photo slots. Every car loads these image files from the local `img/` folder.
// Drop your own licensed photos in as img/1.jpg … img/6.jpg and they appear on
// every listing automatically. Any file that's missing falls back to a tinted
// placeholder (see photoFallback + carPhoto), so the site never shows broken
// images. To give one car its own photos, set its `images` array directly.
// Real photos: drop your own 1.jpg … 6.jpg into the img/ folder and every car
// shows them automatically — no code changes. Any photo that isn't there yet
// falls back to a colour-matched supercar illustration, so nothing looks broken.
// (Give one car its own set by assigning its `images` array to file paths.)
// One car (id 1) is shown from 6 angles; every other car gets a single photo.
// The six matching-angle shots:
const SIX_ANGLE = [
  'img/4dbab45a522b417e916eda2e494ee0e1.jpg',
  'img/828c4b25e8f94dbc9203a9a41b9ae20c.jpg',
  'img/b836707854bc41b69751bd1032c12b29.jpg',
  'img/c01af77cab7f43a789595438e41e8e53.jpg',
  'img/eec1d6eed4c34ecbb038bca937588e89.jpg',
  'img/fa15a74959954c36bc28ed2d6459c0a0.jpg',
];
// One distinct photo per car for everyone else.
const SINGLES = [
  'img/gettyimages-2232400795-612x612.jpg',
  'img/gettyimages-182185108-612x612.jpg',
  'img/gettyimages-1277770032-612x612.jpg',
  'img/gettyimages-157330801-612x612.jpg',
  'img/gettyimages-157333521-612x612.jpg',
];
// One car (id 1) shows the real 6 angles; every other car has a single photo
// duplicated across 6 slots, so each card gets a full 6-slot gallery.
const SIX_ANGLE_CAR = 1;
inventory.forEach((c, idx) => {
  if (!(c.images && c.images.length)) {
    c.images = c.id === SIX_ANGLE_CAR ? SIX_ANGLE.slice() : Array(6).fill(SINGLES[idx % SINGLES.length]);
  }
  c.photoCount = c.images.length;
});

// Inline error handler: swap a failed <img> for its tinted placeholder.
function photoFallback(img) { img.onerror = null; img.src = img.dataset.fallback; }
window.photoFallback = photoFallback;

// --- State ---
const PAGE_SIZE = 6;
const PRICE_MAX = 600000, MILE_MAX = 30000;
const state = {
  sort: 'featured',
  favorites: new Set(),
  shown: PAGE_SIZE,   // how many cards are currently revealed
  favoritesOnly: false, // "Favorites" nav filter
  activeCat: 'model', // selected filter category in the popup
  filters: {
    model: new Set(),
    dealer: new Set(),
    exterior: new Set(),
    interior: new Set(),
    certifiedOnly: false,
    maxPrice: PRICE_MAX,
    maxMileage: MILE_MAX,
  },
};

// --- Elements ---
const el = {
  grid: document.getElementById('cardGrid'),
  count: document.getElementById('resultCount'),
  heroCount: document.getElementById('heroCount'),
  empty: document.getElementById('emptyState'),
  sort: document.getElementById('sortBy'),
  viewToggle: document.querySelector('.view-toggle'),
  refineBtn: document.getElementById('refineBtn'),
  loadMore: document.getElementById('loadMore'),
  loadMoreWrap: document.getElementById('loadMoreWrap'),
  activeFilters: document.getElementById('activeFilters'),
  clearFromEmpty: document.getElementById('clearFromEmpty'),
  // Filter popup
  filterModal: document.getElementById('filterModal'),
  filterClose: document.getElementById('filterClose'),
  filterCatList: document.getElementById('filterCatList'),
  filterOptions: document.getElementById('filterOptions'),
  filterResultCount: document.getElementById('filterResultCount'),
  filterClear: document.getElementById('filterClear'),
  filterSearch: document.getElementById('filterSearch'),
  // Slide-out menu
  menuBtn: document.getElementById('menuBtn'),
  megaMenu: document.getElementById('megaMenu'),
  megaClose: document.getElementById('megaClose'),
  megaNav: document.getElementById('megaNav'),
  megaImg: document.getElementById('megaImg'),
  modal: document.getElementById('modal'),
  modalBody: document.getElementById('modalBody'),
  modalClose: document.getElementById('modalClose'),
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

// --- Formatters (Philippines: PHP + kilometres) ---
const peso = n => '₱' + Math.round(n * 57).toLocaleString('en-US');
const km = n => Math.round(n * 1.609).toLocaleString('en-US') + ' km';
const priceLabel = c => c.priceOnRequest ? 'Price on Request' : peso(c.price);

// --- Core: filter + sort ---
function getVisible() {
  const f = state.filters;
  let list = inventory.filter(c =>
    (f.model.size === 0 || f.model.has(c.model)) &&
    (f.dealer.size === 0 || f.dealer.has(c.dealer)) &&
    (f.exterior.size === 0 || f.exterior.has(c.color)) &&
    (f.interior.size === 0 || f.interior.has(c.interior)) &&
    (c.priceOnRequest || c.price <= f.maxPrice) &&
    c.mileage <= f.maxMileage &&
    (!f.certifiedOnly || c.certified) &&
    (!state.favoritesOnly || state.favorites.has(c.id))
  );

  // "Price on Request" cars sort to the end of price sorts.
  const p = c => c.priceOnRequest ? Infinity : c.price;
  const sorters = {
    'price-asc': (a, b) => p(a) - p(b),
    'price-desc': (a, b) => p(b) - p(a),
    'mileage-asc': (a, b) => a.mileage - b.mileage,
    'year-desc': (a, b) => b.year - a.year,
    'featured': (a, b) => (b.certified - a.certified) || (b.isNew - a.isNew) || (p(a) - p(b)),
  };
  return list.sort(sorters[state.sort] || sorters.featured);
}

// --- Render ---
// Returns the list of image URLs for a car: real photos if present,
// otherwise generated demo placeholders, otherwise [] (→ Photos Coming Soon).
function carImages(c) {
  if (c.images && c.images.length) return c.images;
  return Array.from({ length: c.photoCount || 0 }, (_, i) => carPhoto(COLOR_HEX[c.color], i));
}

function galleryHTML(c) {
  const imgs = carImages(c);
  if (!imgs.length) {
    return `
    <div class="gallery coming-soon">
      <span class="cs-mark">T</span>
      <span class="cs-text">Photos Coming Soon</span>
    </div>`;
  }
  const hex = COLOR_HEX[c.color];
  const slides = imgs.map((src, i) =>
    `<img class="slide${i === 0 ? ' active' : ''}" src="${src}" data-fallback="${carPhoto(hex, i)}" onerror="photoFallback(this)" alt="${c.year} ${c.model} photo ${i + 1}" loading="lazy" />`
  ).join('');
  // Only cars with more than one photo get dots + arrows.
  const multi = imgs.length > 1;
  const dots = imgs.map((_, i) =>
    `<button class="gdot${i === 0 ? ' active' : ''}" data-i="${i}" aria-label="Photo ${i + 1}"></button>`
  ).join('');
  const nav = multi
    ? `<button class="gnav prev disabled" data-dir="-1" aria-label="Previous photo">‹</button>
       <button class="gnav next" data-dir="1" aria-label="Next photo">›</button>`
    : '';
  const dotsBlock = multi
    ? `<div class="gdots"><div class="gdots-vp"><div class="gdots-track">${dots}</div></div></div>`
    : '';
  return `
    <div class="gallery" data-idx="0" data-count="${imgs.length}">
      ${slides}
      ${nav}
      ${dotsBlock}
    </div>`;
}

function cardHTML(c) {
  const fav = state.favorites.has(c.id) ? 'active' : '';
  const newBadge = c.isNew ? '<span class="badge badge-new">New</span>' : '';
  const certBadge = c.certified ? '<span class="badge badge-certified">Approved</span>' : '';

  return `
  <article class="card" data-id="${c.id}">
    <div class="card-media">
      ${galleryHTML(c)}
      <div class="card-badges">${newBadge}${certBadge}</div>
      <button class="card-fav ${fav}" data-fav="${c.id}" aria-label="Save vehicle">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"
                fill="var(--fill)" stroke="currentColor" stroke-width="1.6"
                stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <div class="card-body">
      <div class="card-meta">${c.year}<span class="dot">·</span>${km(c.mileage)}</div>
      <div class="card-brand">Teshi</div>
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

// Editorial promo tile mixed into the grid (like Ferrari's Tailor Made card).
function promoHTML() {
  return `
  <article class="promo-card">
    <div class="promo-inner">
      <p class="promo-eyebrow">Tailor Made</p>
      <h3>Personalization Programs</h3>
      <p class="promo-text">Configure every detail — paint, hides, stitching, trim — and
        commission a car built entirely around you.</p>
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
    if (i === idx) { d.style.transform = ''; return; }   // active handled by CSS
    const dist = Math.abs(i - idx);
    d.style.transform = `scale(${dist === 1 ? 1 : dist === 2 ? 0.66 : 0.4})`;
  });
}
function centerAllDots() {
  el.grid.querySelectorAll('.gallery').forEach(centerDots);
}

function render() {
  const list = getVisible();
  el.count.textContent = list.length;
  el.heroCount.textContent = inventory.length;
  const hc = document.getElementById('homeCount');
  if (hc) hc.textContent = inventory.length;
  el.empty.hidden = list.length > 0;

  const page = list.slice(0, state.shown);
  const cards = page.map(cardHTML);
  // Drop the promo tile in after the 4th card when there's room.
  if (page.length >= 4) cards.splice(4, 0, promoHTML());
  el.grid.innerHTML = cards.join('');

  el.loadMoreWrap.hidden = state.shown >= list.length;
  renderActiveFilters();
  centerAllDots();
}

// Chips for each active filter (removable) + a Save-your-search button.
function renderActiveFilters() {
  const f = state.filters;
  const chips = [];
  ['model', 'dealer', 'exterior', 'interior'].forEach(k => f[k].forEach(v => chips.push([k, v])));
  if (f.certifiedOnly) chips.push(['certified', 'Certified only']);
  if (f.maxPrice < PRICE_MAX) chips.push(['price', 'Up to ' + peso(f.maxPrice)]);
  if (f.maxMileage < MILE_MAX) chips.push(['mileage', 'Up to ' + km(f.maxMileage)]);
  const box = el.activeFilters;
  if (!chips.length) { box.hidden = true; box.innerHTML = ''; return; }
  box.hidden = false;
  box.innerHTML = chips.map(([k, v]) =>
    `<button class="afilter-chip" data-remove="${k}" data-val="${v}">${v}<span aria-hidden="true">×</span></button>`
  ).join('') + `<button class="save-search" data-action="save-search">Save your search</button>`;
}

// --- Modal ---
function openModal(c) {
  el.modalBody.innerHTML = `
    <div class="modal-hero">
      <img class="photo" src="${carPhoto(COLOR_HEX[c.color])}" alt="${c.year} ${c.model}" />
    </div>
    <div class="modal-content">
      <h2>${c.year} ${c.model}</h2>
      <div class="card-location">◉ ${c.dealer} · ${c.location} ${c.certified ? '· Approved' : ''}</div>
      <div class="modal-price">${priceLabel(c)}</div>
      <div class="modal-spec-grid">
        <div class="cell"><span>Mileage</span><strong>${km(c.mileage)}</strong></div>
        <div class="cell"><span>Power</span><strong>${c.hp} hp</strong></div>
        <div class="cell"><span>Drivetrain</span><strong>${c.drivetrain}</strong></div>
        <div class="cell"><span>Engine</span><strong>${c.engine}</strong></div>
        <div class="cell"><span>Exterior</span><strong>${c.color}</strong></div>
        <div class="cell"><span>Interior</span><strong>${c.interior}</strong></div>
      </div>
      <div class="modal-actions">
        <button class="btn-primary">Request Details</button>
        <button class="btn-ghost">Estimate Financing</button>
      </div>
    </div>`;
  el.modal.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  el.modal.hidden = true;
  document.body.style.overflow = '';
}

// --- Vehicle detail view ---
const vin = c => `VLC${c.year}${c.model.replace(/\W/g, '').slice(0, 2).toUpperCase()}${String(c.id).padStart(6, '0')}`;
const stock = c => `PM${String(261100 + c.id * 7)}`;

function renderDetail(car) {
  state.detailCar = car;
  const imgs = carImages(car);

  const dhex = COLOR_HEX[car.color];
  el.detailHero.innerHTML = imgs.length
    ? `<div class="detail-pane">
         <img class="photo" src="${imgs[0]}" data-fallback="${carPhoto(dhex, 0)}" onerror="photoFallback(this)" alt="${car.year} ${car.model} — front" />       </div>
       <div class="detail-pane">
         <img class="photo" src="${imgs[1] || imgs[0]}" data-fallback="${carPhoto(dhex, 1)}" onerror="photoFallback(this)" alt="${car.year} ${car.model} — side" />       </div>`
    : `<div class="detail-pane detail-pane--full">
         <div class="gallery coming-soon" style="position:relative">
           <span class="cs-mark">T</span><span class="cs-text">Photos Coming Soon</span>
         </div>
       </div>`;

  const MAX_THUMBS = 3;
  let thumbs = imgs.slice(0, MAX_THUMBS).map((src, i) =>
    `<button class="detail-thumb${i === 0 ? ' active' : ''}" data-i="${i}" aria-label="Photo ${i + 1}">
       <img src="${src}" data-fallback="${carPhoto(dhex, i)}" onerror="photoFallback(this)" alt="" />
     </button>`).join('');
  if (imgs.length > MAX_THUMBS) {
    thumbs += `<button class="detail-thumb detail-thumb-more" data-i="${MAX_THUMBS}">
       <img src="${imgs[MAX_THUMBS]}" data-fallback="${carPhoto(dhex, MAX_THUMBS)}" onerror="photoFallback(this)" alt="" /><span>+${imgs.length - MAX_THUMBS}</span>
     </button>`;
  }
  el.detailThumbs.innerHTML = thumbs;

  el.detailTitle.textContent = car.model;
  el.detailMeta.innerHTML = `${car.year}<span class="sep">|</span>${km(car.mileage)}<span class="sep">|</span>◉ ${car.dealer}`;
  el.detailIds.innerHTML = `VIN# <strong>${vin(car)}</strong><span class="sep">|</span>STOCK# <strong>${stock(car)}</strong>`;
  el.detailPrice.textContent = priceLabel(car);
  el.detailPrice.classList.toggle('on-request', !!car.priceOnRequest);
  el.detailFav.classList.toggle('active', state.favorites.has(car.id));

  el.detailSpecs.innerHTML = `
    <div class="cell"><span>Exterior Color</span><strong>${car.color}</strong></div>
    <div class="cell"><span>Interior Color</span><strong>${car.interior}</strong></div>
    <div class="cell"><span>Mileage</span><strong>${km(car.mileage)}</strong></div>
    <div class="cell"><span>Power</span><strong>${car.hp} hp</strong></div>
    <div class="cell"><span>Drivetrain</span><strong>${car.drivetrain}</strong></div>
    <div class="cell"><span>Engine</span><strong>${car.engine}</strong></div>`;

  el.detailPrev.classList.toggle('disabled', state.detailIdx <= 0);
  el.detailNext.classList.toggle('disabled', state.detailIdx >= state.detailList.length - 1);

  // Showroom / dealer block
  el.detailShowroom.innerHTML = `
    <div class="showroom-card">
      <p class="showroom-eyebrow">Showroom</p>
      <h3 class="showroom-name">${car.dealer}</h3>
      <div class="showroom-cols">
        <div>
          <p class="showroom-label">Contacts</p>
          <a href="#">(+63) 2 8555 0${String(100 + car.id)}</a>
          <p>${car.dealer}, ${car.location}</p>
          <a href="#">veloce-selezione.ph</a>
        </div>
        <div>
          <p class="showroom-label">Opening Hours</p>
          <p class="hours"><span>Monday – Friday</span><span>9:00 AM – 6:00 PM</span></p>
          <p class="hours"><span>Saturday</span><span>9:00 AM – 5:00 PM</span></p>
          <p class="hours"><span>Sunday</span><span>Closed</span></p>
        </div>
        <div class="showroom-actions">
          <button class="btn-details">Dealer Stock</button>
          <button class="cta-inquire">Inquire</button>
        </div>
      </div>
    </div>`;

  // Related vehicles — same model first, then fill with others.
  const related = [
    ...inventory.filter(c => c.model === car.model && c.id !== car.id),
    ...inventory.filter(c => c.model !== car.model),
  ].slice(0, 4);
  el.detailRelated.innerHTML = related.map(cardHTML).join('');
  el.detailRelated.querySelectorAll('.gallery').forEach(centerDots);
}

// Show/hide are driven by the URL hash so each car gets its own link and the
// browser back button returns to the search results.
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

// URL helpers — a slug keeps the link readable, the id is what we route on.
const carSlug = c => `${c.model}-${c.id}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
function openDetail(car) { location.hash = 'vehicle/' + carSlug(car); }
function stepDetail(dir) {
  const i = state.detailIdx + dir;
  if (i < 0 || i > state.detailList.length - 1) return;
  openDetail(state.detailList[i]);
}
// Distinct views via the URL hash: home ('' / #home), listings (#browse),
// and the vehicle page (#vehicle/...). Home is a separate screen, never merged
// with the listings.
function showListings() {
  document.body.classList.remove('home-view');
  if (location.hash !== '#browse' && !location.hash.startsWith('#vehicle')) {
    history.replaceState(null, '', '#browse');
  }
}
function routeFromHash() {
  const h = location.hash;
  const m = h.match(/^#vehicle\/.*-(\d+)$/);
  if (m) {
    const car = inventory.find(c => c.id === +m[1]);
    if (car) { document.body.classList.remove('home-view'); showDetail(car); return; }
  }
  hideDetail();
  document.body.classList.toggle('home-view', h === '' || h === '#' || h === '#home');
}

// --- Events ---
// Any filter/sort change resets pagination back to the first page.
function rerender() { state.shown = PAGE_SIZE; render(); }

// Sort selects live in both the toolbar and the sticky sub-header — keep synced.
document.querySelectorAll('.sort-select').forEach(sel => {
  sel.addEventListener('change', e => {
    state.sort = e.target.value;
    document.querySelectorAll('.sort-select').forEach(s => { s.value = state.sort; });
    rerender();
  });
});
el.loadMore.addEventListener('click', () => { state.shown += PAGE_SIZE; render(); });

/* ===== Filter popup ===== */
const uniq = arr => [...new Set(arr)];
const FILTER_CATS = [
  { key: 'model',    label: 'Model',          type: 'list', vals: () => uniq(inventory.map(c => c.model)) },
  { key: 'dealer',   label: 'Dealer',         type: 'list', vals: () => uniq(inventory.map(c => c.dealer)).sort() },
  { key: 'price',    label: 'Price',          type: 'price' },
  { key: 'mileage',  label: 'Mileage',        type: 'mileage' },
  { key: 'exterior', label: 'Exterior Color', type: 'list', vals: () => uniq(inventory.map(c => c.color)) },
  { key: 'interior', label: 'Interior Color', type: 'list', vals: () => uniq(inventory.map(c => c.interior)) },
  { key: 'certified',label: 'Certifications', type: 'toggle' },
];
function catCount(cat) {
  const f = state.filters;
  if (cat.type === 'list') return f[cat.key].size;
  if (cat.key === 'price') return f.maxPrice < PRICE_MAX ? 1 : 0;
  if (cat.key === 'mileage') return f.maxMileage < MILE_MAX ? 1 : 0;
  if (cat.key === 'certified') return f.certifiedOnly ? 1 : 0;
  return 0;
}
function renderFilterCats() {
  el.filterCatList.innerHTML = FILTER_CATS.map(cat => {
    const n = catCount(cat);
    return `<button class="filter-cat${cat.key === state.activeCat ? ' active' : ''}" data-cat="${cat.key}">
      <span>${cat.label}${n ? ` <em>${n}</em>` : ''}</span><span class="chev">›</span></button>`;
  }).join('');
}
function renderFilterOptions() {
  const cat = FILTER_CATS.find(c => c.key === state.activeCat);
  const f = state.filters;
  let html = '';
  if (cat.type === 'list') {
    const set = f[cat.key];
    const vals = cat.vals();
    html = `${vals.length > 7 ? `<div class="filter-search-box"><input type="text" id="filterTypeFilter" placeholder="Type to filter" /></div>` : ''}
      <label class="filter-check"><input type="checkbox" data-all="1" ${set.size === 0 ? 'checked' : ''} /><span>All</span></label>
      <div class="filter-optlist">${vals.map(v =>
        `<label class="filter-check" data-row="${v.toLowerCase()}"><input type="checkbox" data-val="${v}" ${set.has(v) ? 'checked' : ''} /><span>${v}</span></label>`
      ).join('')}</div>`;
  } else if (cat.type === 'price') {
    html = `<label class="filter-label">Max Price</label>
      <input type="range" id="filterRange" min="150000" max="${PRICE_MAX}" step="10000" value="${f.maxPrice}" />
      <div class="range-value">Up to <span>${peso(f.maxPrice)}</span></div>`;
  } else if (cat.type === 'mileage') {
    html = `<label class="filter-label">Max Mileage</label>
      <input type="range" id="filterRange" min="0" max="${MILE_MAX}" step="1000" value="${f.maxMileage}" />
      <div class="range-value">Up to <span>${km(f.maxMileage)}</span></div>`;
  } else if (cat.type === 'toggle') {
    html = `<label class="filter-check"><input type="checkbox" id="filterCertToggle" ${f.certifiedOnly ? 'checked' : ''} /><span>Certified / Approved only</span></label>`;
  }
  el.filterOptions.innerHTML = html;
}
function updateFilterCount() { el.filterResultCount.textContent = getVisible().length; }
function refreshFilterUI() { renderFilterCats(); updateFilterCount(); }

function openFilters() {
  el.filterModal.hidden = false;
  document.body.style.overflow = 'hidden';
  renderFilterCats(); renderFilterOptions(); updateFilterCount();
}
function closeFilters() { el.filterModal.hidden = true; document.body.style.overflow = ''; }

document.querySelectorAll('.refine-btn').forEach(b => b.addEventListener('click', openFilters));
el.filterClose.addEventListener('click', closeFilters);
el.filterSearch.addEventListener('click', closeFilters);
el.filterModal.addEventListener('click', e => { if (e.target === el.filterModal) closeFilters(); });

el.filterCatList.addEventListener('click', e => {
  const btn = e.target.closest('.filter-cat'); if (!btn) return;
  state.activeCat = btn.dataset.cat;
  renderFilterCats(); renderFilterOptions();
});

el.filterOptions.addEventListener('input', e => {
  const cat = FILTER_CATS.find(c => c.key === state.activeCat);
  const f = state.filters;
  const t = e.target;
  if (t.id === 'filterTypeFilter') {                       // type-to-filter
    const q = t.value.toLowerCase();
    el.filterOptions.querySelectorAll('.filter-optlist .filter-check').forEach(row =>
      row.style.display = row.dataset.row.includes(q) ? '' : 'none');
    return;
  }
  if (t.dataset.all) { f[cat.key].clear(); renderFilterOptions(); }
  else if (t.dataset.val) {
    t.checked ? f[cat.key].add(t.dataset.val) : f[cat.key].delete(t.dataset.val);
    const all = el.filterOptions.querySelector('[data-all]');
    if (all) all.checked = f[cat.key].size === 0;
  }
  else if (t.id === 'filterRange') {
    if (cat.key === 'price') { f.maxPrice = +t.value; el.filterOptions.querySelector('.range-value span').textContent = peso(f.maxPrice); }
    else { f.maxMileage = +t.value; el.filterOptions.querySelector('.range-value span').textContent = km(f.maxMileage); }
  }
  else if (t.id === 'filterCertToggle') { f.certifiedOnly = t.checked; }
  rerender(); refreshFilterUI();
});

el.filterClear.addEventListener('click', () => { resetAll(); renderFilterOptions(); });

// Remove a single filter by clicking its chip.
el.activeFilters.addEventListener('click', e => {
  const chip = e.target.closest('.afilter-chip');
  if (!chip) return;
  const k = chip.dataset.remove, v = chip.dataset.val;
  const f = state.filters;
  if (['model', 'dealer', 'exterior', 'interior'].includes(k)) f[k].delete(v);
  else if (k === 'certified') f.certifiedOnly = false;
  else if (k === 'price') f.maxPrice = PRICE_MAX;
  else if (k === 'mileage') f.maxMileage = MILE_MAX;
  state.shown = PAGE_SIZE;
  render();
  if (!el.filterModal.hidden) refreshFilterUI();
});

/* ===== Slide-out menu ===== */
function openMenu() { el.megaMenu.hidden = false; document.body.style.overflow = 'hidden'; }
function closeMenu() { el.megaMenu.hidden = true; document.body.style.overflow = ''; }
el.menuBtn.addEventListener('click', openMenu);
el.megaClose.addEventListener('click', closeMenu);
el.megaMenu.addEventListener('click', e => { if (e.target === el.megaMenu) closeMenu(); });
el.megaNav.addEventListener('mouseover', e => {
  const a = e.target.closest('a[data-img]'); if (!a) return;
  el.megaNav.querySelectorAll('a').forEach(x => x.classList.remove('active'));
  a.classList.add('active');
  if (el.megaImg.getAttribute('src') !== a.dataset.img) {
    el.megaImg.style.opacity = '0';
    setTimeout(() => { el.megaImg.src = a.dataset.img; el.megaImg.style.opacity = '1'; }, 120);
  }
});

/* ===== Nav actions (Home, Models, Favorites, info dialogs) ===== */
function openInfo(title, body) {
  el.modalBody.innerHTML = `<div class="info-modal"><h2>${title}</h2>${body}</div>`;
  el.modal.hidden = false;
  document.body.style.overflow = 'hidden';
}
const INFO = {
  why: ['Why Teshi Approved', `<p>Every Teshi SportsC vehicle passes a rigorous <strong>142-point inspection</strong> and comes with a <strong>24-month warranty</strong>. Full service history, verified mileage, and a certificate of authenticity — so you buy with total confidence.</p>`],
  value: ['Value Your Car', `<p>Thinking of selling or trading in? Share the model, year, and mileage and our specialists return a competitive valuation within 24 hours.</p><p>Call <strong>(+63) 2 8555 0100</strong> or email <strong>sell@teshi-sportsc.ph</strong>.</p>`],
  sell: ['Sell Your Car', `<p>Consign or sell your performance car through Teshi SportsC — we handle photography, listing, and qualified buyers.</p><p>Email <strong>sell@teshi-sportsc.ph</strong> to get started.</p>`],
  book: ['Book a Viewing', `<p>Arrange a private viewing at any Teshi SportsC showroom.</p><p>Call <strong>(+63) 2 8555 0100</strong> or email <strong>viewings@teshi-sportsc.ph</strong> with the vehicle and a preferred time.</p>`],
  contact: ['Contact', `<p><strong>Teshi SportsC — Makati</strong><br>Ayala Avenue, Makati, Metro Manila</p><p>(+63) 2 8555 0100<br>hello@teshi-sportsc.ph</p><p>Mon–Fri 9:00–18:00 · Sat 9:00–17:00 · Sun closed</p>`],
  dealer: ['Dealer Login', `<p>The dealer portal is available to authorised Teshi SportsC partners.</p><p>Contact <strong>partners@teshi-sportsc.ph</strong> for access.</p>`],
  'save-search': ['Search Saved', `<p>We'll notify you the moment a car matching your filters becomes available.</p><p>Add your email in <strong>Account → Saved Searches</strong> to receive alerts.</p>`],
};
const scrollToEl = sel => { const t = document.querySelector(sel); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
const LISTINGS_TITLE = 'Used Performance Cars for Sale in the Philippines';
function setFavorites(on) {
  state.favoritesOnly = on;
  state.shown = PAGE_SIZE;
  document.querySelectorAll('[data-action="favorites"]').forEach(x => x.classList.toggle('active', on));
  document.getElementById('favBack').hidden = !on;
  document.getElementById('listingsTitle').textContent = on ? 'Your Saved Vehicles' : LISTINGS_TITLE;
  render();
}

document.addEventListener('click', e => {
  const a = e.target.closest('[data-action]');
  if (!a) return;
  e.preventDefault();
  const action = a.dataset.action;
  if (!el.megaMenu.hidden) closeMenu();
  switch (action) {
    case 'home': location.hash = 'home'; window.scrollTo({ top: 0 }); break;
    case 'browse': showListings(); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 60); break;
    case 'models': showListings(); setTimeout(() => scrollToEl('.results'), 80); break;
    case 'favorites':
      showListings(); setFavorites(true);
      setTimeout(() => scrollToEl('.results'), 80);
      break;
    case 'back-search':
      setFavorites(false);
      scrollToEl('.results');
      break;
    default:
      if (INFO[action]) openInfo(INFO[action][0], INFO[action][1]);
  }
});

// Directory links (Pre-Owned by Model / by Dealer) → filter the listings.
document.addEventListener('click', e => {
  const link = e.target.closest('.directory-grid a');
  if (!link) return;
  e.preventDefault();
  const val = link.textContent.trim();
  const isModel = !!link.closest('#modelsDir');
  const f = state.filters;
  f.model.clear(); f.dealer.clear(); f.exterior.clear(); f.interior.clear();
  f.certifiedOnly = false; f.maxPrice = PRICE_MAX; f.maxMileage = MILE_MAX;
  state.favoritesOnly = false; state.shown = PAGE_SIZE;
  document.getElementById('favBack').hidden = true;
  document.getElementById('listingsTitle').textContent = isModel ? `Used ${val}` : `${val} Inventory`;
  // Apply the filter only if that model/dealer actually exists in inventory.
  if (isModel) { if (inventory.some(c => c.model === val)) f.model.add(val); }
  else { if (inventory.some(c => c.dealer === val)) f.dealer.add(val); }
  showListings();
  render();
  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80);
});

// View toggles live in both toolbars — delegate so either one drives the grid
// and both stay in sync.
document.addEventListener('click', e => {
  const btn = e.target.closest('.view-btn');
  if (!btn) return;
  const view = btn.dataset.view;
  document.querySelectorAll('.view-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  el.grid.classList.toggle('list-view', view === 'list');
  centerAllDots();
});

// Card clicks: favorite toggle, gallery nav, or open the vehicle page.
// Bound to both the main grid and the Related Vehicles grid.
function onCardAreaClick(e) {
  const favBtn = e.target.closest('[data-fav]');
  if (favBtn) {
    e.stopPropagation();
    const id = +favBtn.dataset.fav;
    state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
    favBtn.classList.toggle('active');
    return;
  }

  // Gallery navigation (dots + arrows) — never opens the vehicle page.
  const dot = e.target.closest('.gdot');
  const nav = e.target.closest('.gnav');
  if (dot || nav) {
    e.stopPropagation();
    const gallery = e.target.closest('.gallery');
    const count = +gallery.dataset.count;
    let idx = +gallery.dataset.idx;
    // Clamp at the ends — no wrap-around past the last/first image.
    idx = dot ? +dot.dataset.i
              : Math.min(count - 1, Math.max(0, idx + +nav.dataset.dir));
    gallery.dataset.idx = idx;
    gallery.querySelectorAll('.slide').forEach((s, i) => s.classList.toggle('active', i === idx));
    gallery.querySelectorAll('.gdot').forEach((d, i) => d.classList.toggle('active', i === idx));
    gallery.querySelector('.gnav.prev').classList.toggle('disabled', idx === 0);
    gallery.querySelector('.gnav.next').classList.toggle('disabled', idx === count - 1);
    centerDots(gallery);
    return;
  }
  // Any click within the gallery controls must never open the vehicle page
  // (covers mis-clicks between the small dots or on a disabled arrow).
  if (e.target.closest('.gdots') || e.target.closest('.gnav')) return;

  // Inquire, More Details, or the card itself open the vehicle page.
  const actionBtn = e.target.closest('.btn-inquire, .btn-details');
  const card = e.target.closest('.card');
  const id = actionBtn ? +actionBtn.dataset.id : (card ? +card.dataset.id : null);
  if (id != null) {
    const car = inventory.find(c => c.id === id);
    if (car) openDetail(car);
  }
}
el.grid.addEventListener('click', onCardAreaClick);
el.detailRelated.addEventListener('click', onCardAreaClick);

// Vehicle-page controls
el.detailBack.addEventListener('click', () => { if (location.hash) history.back(); else hideDetail(); });
el.detailPrev.addEventListener('click', () => stepDetail(-1));
el.detailNext.addEventListener('click', () => stepDetail(1));
el.detailFav.addEventListener('click', () => {
  const car = state.detailCar; if (!car) return;
  state.favorites.has(car.id) ? state.favorites.delete(car.id) : state.favorites.add(car.id);
  el.detailFav.classList.toggle('active', state.favorites.has(car.id));
});
el.detailThumbs.addEventListener('click', e => {
  const t = e.target.closest('.detail-thumb'); if (!t) return;
  const imgs = carImages(state.detailCar);
  const leftPane = el.detailHero.querySelector('.detail-pane .photo');   // big left image
  if (leftPane) leftPane.src = imgs[+t.dataset.i];
  el.detailThumbs.querySelectorAll('.detail-thumb').forEach(x => x.classList.remove('active'));
  t.classList.add('active');
});
window.addEventListener('hashchange', routeFromHash);

function resetAll() {
  const f = state.filters;
  f.model.clear(); f.dealer.clear(); f.exterior.clear(); f.interior.clear();
  f.certifiedOnly = false; f.maxPrice = PRICE_MAX; f.maxMileage = MILE_MAX;
  state.favoritesOnly = false;
  document.querySelectorAll('[data-action="favorites"]').forEach(x => x.classList.remove('active'));
  document.getElementById('favBack').hidden = true;
  document.getElementById('listingsTitle').textContent = LISTINGS_TITLE;
  state.sort = 'featured'; state.shown = PAGE_SIZE;
  document.querySelectorAll('.sort-select').forEach(s => { s.value = 'featured'; });
  render();
  if (!el.filterModal.hidden) refreshFilterUI();
}
el.clearFromEmpty.addEventListener('click', resetAll);

el.modalClose.addEventListener('click', closeModal);
el.modal.addEventListener('click', e => { if (e.target === el.modal) closeModal(); });
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  closeModal();
  if (!el.filterModal.hidden) closeFilters();
  if (!el.megaMenu.hidden) closeMenu();
});

// --- Header: solidifies on scroll; sticky sub-header slides in further down ---
const subHeader = document.getElementById('subHeader');
const toTop = document.getElementById('toTop');
const onScroll = () => {
  const y = window.scrollY;
  document.body.classList.toggle('scrolled', y > 24);
  subHeader.classList.toggle('show', y > 360 && !document.body.classList.contains('home-view'));
  toTop.classList.toggle('show', y > 500);
};
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Keep dots centered after layout changes.
window.addEventListener('resize', centerAllDots, { passive: true });

// --- Init ---
render();
routeFromHash();   // open a vehicle directly if the URL already points to one
