/* ============================================================
   Supercar Philippines — pre-owned listings
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
  { id: 1,  brand: 'Ferrari',     model: '296 GTB',      year: 2024, price: 389900, mileage: 1240,  color: 'Rosso',  interior: 'Nero',  dealer: 'Supercar PH Makati',       location: 'Makati, Metro Manila',            certified: true,  isNew: true,  hp: 819,  drivetrain: 'RWD', engine: '3.0L V6 Hybrid' },
  { id: 2,  brand: 'Lamborghini', model: 'Huracán EVO',  year: 2023, price: 412500, mileage: 3890,  color: 'Giallo', interior: 'Nero',  dealer: 'Supercar PH BGC',          location: 'Bonifacio Global City, Taguig',   certified: true,  isNew: false, hp: 631,  drivetrain: 'AWD', engine: '5.2L V10' },
  { id: 3,  brand: 'Ferrari',     model: '296 GTS',      year: 2024, price: 0, priceOnRequest: true, mileage: 640,   color: 'Nero',   interior: 'Rosso', dealer: 'Supercar PH Cebu',         location: 'Cebu City, Cebu',                 certified: true,  isNew: true,  hp: 819,  drivetrain: 'RWD', engine: '3.0L V6 Hybrid' },
  { id: 4,  brand: 'Ferrari',     model: 'SF90 Stradale',year: 2022, price: 549000, mileage: 6120,  color: 'Rosso',  interior: 'Nero',  dealer: 'Supercar PH Manila',       location: 'Ortigas, Pasig',                  certified: true,  isNew: false, hp: 986,  drivetrain: 'AWD', engine: '4.0L V8 Hybrid' },
  { id: 5,  brand: 'Porsche',     model: '911 Turbo S',  year: 2023, price: 274900, mileage: 5210,  color: 'Grigio', interior: 'Nero',  dealer: 'Supercar PH Alabang',      location: 'Alabang, Muntinlupa',             certified: true,  isNew: false, hp: 640,  drivetrain: 'AWD', engine: '3.8L Flat-6' },
  { id: 6,  brand: 'Lamborghini', model: 'Aventador SVJ',year: 2021, price: 598000, mileage: 4980,  color: 'Giallo', interior: 'Nero',  dealer: 'Supercar PH Quezon City',  location: 'Quezon City, Metro Manila',       certified: true,  isNew: false, hp: 759,  drivetrain: 'AWD', engine: '6.5L V12' },
  { id: 7,  brand: 'McLaren',     model: '720S',         year: 2022, price: 358000, mileage: 3870,  color: 'Nero',   interior: 'Rosso', dealer: 'Supercar PH Davao',        location: 'Davao City, Davao del Sur',       certified: true,  isNew: false, hp: 710,  drivetrain: 'RWD', engine: '4.0L V8 Twin-Turbo' },
  { id: 8,  brand: 'Ferrari',     model: 'Roma',         year: 2023, price: 244900, mileage: 3980,  color: 'Bianco', interior: 'Crema', dealer: 'Supercar PH Iloilo',       location: 'Iloilo City, Iloilo',             certified: false, isNew: false, hp: 612,  drivetrain: 'RWD', engine: '3.9L V8' },
  { id: 9,  brand: 'Porsche',     model: 'Taycan Turbo', year: 2022, price: 198000, mileage: 8450,  color: 'Grigio', interior: 'Nero',  dealer: 'Supercar PH Pampanga',     location: 'Angeles, Pampanga',               certified: true,  isNew: false, hp: 671,  drivetrain: 'AWD', engine: 'Dual Electric Motor' },
  { id: 10, brand: 'McLaren',     model: 'Artura',       year: 2024, price: 289500, mileage: 780,   color: 'Nero',   interior: 'Cuoio', dealer: 'Supercar PH Makati',       location: 'Makati, Metro Manila',            certified: true,  isNew: true,  hp: 671,  drivetrain: 'RWD', engine: '3.0L V6 Hybrid' },
  { id: 11, brand: 'Lamborghini', model: 'Huracán STO',  year: 2023, price: 0, priceOnRequest: true, mileage: 2010,  color: 'Nero',   interior: 'Rosso', dealer: 'Supercar PH BGC',          location: 'Bonifacio Global City, Taguig',   certified: true,  isNew: false, hp: 631,  drivetrain: 'RWD', engine: '5.2L V10' },
  { id: 12, brand: 'Ferrari',     model: 'Portofino M',  year: 2023, price: 231000, mileage: 3320,  color: 'Bianco', interior: 'Blu',   dealer: 'Supercar PH Cebu',         location: 'Cebu City, Cebu',                 certified: false, isNew: false, hp: 612,  drivetrain: 'RWD', engine: '3.9L V8' },
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
// Real downloaded photos, keyed by model. encodeURI handles spaces/accents in
// the filenames so they load correctly.
const REAL_PHOTOS = {
  '296 GTB':       'img/296 GTB.jpeg',
  'Huracán EVO':   'img/Huracán EVO.jpeg',
  'Huracán STO':   'img/Huracán STO.jpeg',
  '911 Turbo S':   'img/911 Turbo.jpeg',
  'Aventador SVJ': 'img/Aventador SVJ.jpeg',
};
inventory.forEach(c => {
  if (REAL_PHOTOS[c.model]) c.images = [encodeURI(REAL_PHOTOS[c.model])];
});

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

// --- Supercar Parts (basic catalogue; extend/replace with a real feed later) ---
// Prices are in the same base units as cars (displayed in PHP via peso()).
const parts = [
  { name: 'Carbon Fibre Rear Wing',        brand: 'Lamborghini', category: 'Exterior', price: 9800 },
  { name: 'Forged Alloy Wheel Set',        brand: 'Ferrari',     category: 'Wheels',   price: 12500 },
  { name: 'Titanium Sport Exhaust',        brand: 'McLaren',     category: 'Exhaust',  price: 8600 },
  { name: 'Carbon Ceramic Brake Kit',      brand: 'Porsche',     category: 'Brakes',   price: 11200 },
  { name: 'Alcantara Steering Wheel',      brand: 'Ferrari',     category: 'Interior', price: 3400 },
  { name: 'Carbon Fibre Side Skirts',      brand: 'Lamborghini', category: 'Exterior', price: 5200 },
  { name: 'High-Flow Air Intake',          brand: 'McLaren',     category: 'Engine',   price: 2900 },
  { name: 'Sport Bucket Seats (Pair)',     brand: 'Porsche',     category: 'Interior', price: 7400 },
  { name: 'Forged Wheel Set — Matte',      brand: 'Lamborghini', category: 'Wheels',   price: 13800 },
  { name: 'Front Splitter — Carbon',       brand: 'Ferrari',     category: 'Exterior', price: 6100 },
  { name: 'Performance Brake Pads',        brand: 'McLaren',     category: 'Brakes',   price: 1800 },
  { name: 'Valved Titanium Exhaust',       brand: 'Porsche',     category: 'Exhaust',  price: 9200 },
];
let partsBrand = 'All';
function partCardHTML(p, idx) {
  return `<article class="part-card">
    <div class="part-media"><span class="part-cat">${p.category}</span></div>
    <div class="part-body">
      <div class="card-brand">${p.brand}</div>
      <h3 class="part-name">${p.name}</h3>
      <div class="part-price">${peso(p.price)}</div>
      <button class="btn-inquire part-inquire" data-part="${idx}">Inquire via Viber</button>
    </div>
  </article>`;
}
function renderParts() {
  const brands = ['All', ...[...new Set(parts.map(p => p.brand))].sort()];
  el.partsFilters.innerHTML = brands.map(b =>
    `<button class="parts-chip${b === partsBrand ? ' active' : ''}" data-pbrand="${b}">${b}</button>`).join('');
  const list = partsBrand === 'All' ? parts : parts.filter(p => p.brand === partsBrand);
  el.partsGrid.innerHTML = list.map(p => partCardHTML(p, parts.indexOf(p))).join('');
  el.partsCount.textContent = list.length;
}
function inquirePart(idx) {
  const p = parts[idx];
  const link = location.origin + location.pathname + '#parts';
  const msg =
    `Hello Supercar Philippines!\nI'm interested in this part:\n` +
    `${p.brand} — ${p.name} (${p.category})\nPrice: ${peso(p.price)}\n\nLink: ${link}`;
  // Copy the details before opening the client's Viber chat.
  if (navigator.clipboard) navigator.clipboard.writeText(msg).catch(() => {});
  window.location.href = VIBER_CHAT_LINK;
}

// --- State ---
const PAGE_SIZE = 6;
// Price bounds are in the inventory's base units; displayed in PHP via peso().
// PRICE_MIN ≈ ₱10M, PRICE_MAX ≈ ₱50M.
const PRICE_MIN = 175000, PRICE_MAX = 880000, PRICE_STEP = 5000;
const MILE_MAX = 30000;
const state = {
  sort: 'featured',
  favorites: new Set(),
  shown: PAGE_SIZE,   // how many cards are currently revealed
  favoritesOnly: false, // "Favorites" nav filter
  activeCat: 'model', // selected filter category in the popup
  filters: {
    brand: new Set(),
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
  partsFilters: document.getElementById('partsFilters'),
  partsGrid: document.getElementById('partsGrid'),
  partsCount: document.getElementById('partsCount'),
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
  inquireModal: document.getElementById('inquireModal'),
  inquireClose: document.getElementById('inquireClose'),
  inquireHead: document.getElementById('inquireHead'),
  inquireForm: document.getElementById('inquireForm'),
  inquireDone: document.getElementById('inquireDone'),
  inquireDoneClose: document.getElementById('inquireDoneClose'),
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
    (f.brand.size === 0 || f.brand.has(c.brand)) &&
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

// Move a gallery to a photo index (clamped) and sync slides/dots/arrows.
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
  ['brand', 'model', 'dealer', 'exterior', 'interior'].forEach(k => f[k].forEach(v => chips.push([k, v])));
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

// --- Inquire form (sends to the dealer's Viber with the car link) ---
const VIBER_NUMBER = '+639999377194';   // Supercar Philippines
const VIBER_CHAT_LINK = `viber://chat?number=${encodeURIComponent(VIBER_NUMBER)}`;

function isMobileDevice() {
  return navigator.userAgentData?.mobile || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

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
// Build the inquiry text (customer + full vehicle details + direct link).
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
async function copyToClipboard(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch (err) {
    const ta = document.getElementById('inqReadyText');
    if (ta) { ta.focus(); ta.select(); try { document.execCommand('copy'); return true; } catch (e) {} }
    return false;
  }
}
function flashCopied(btn) {
  const old = btn.textContent;
  btn.textContent = 'Copied ✓';
  setTimeout(() => { btn.textContent = old; }, 1600);
}

// Submit → prepare the inquiry text, then show the "ready" screen.
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
// Open Viber button: auto-copy the full inquiry, THEN open the exact deep
// link that's in the HTML (viber://chat?number=…). We never rewrite the link —
// we read it straight off the element so it stays whatever the markup says.
document.getElementById('openViber').addEventListener('click', async e => {
  e.preventDefault();                                   // hold navigation until the copy runs
  const link = e.currentTarget.getAttribute('href');   // exact working viber:// deep link from HTML
  const ok = await copyToClipboard(document.getElementById('inqReadyText').value);
  if (!ok) {
    const hint = document.querySelector('.inq-viber-hint');
    if (hint) hint.textContent = 'Couldn’t copy automatically — tap “Copy Inquiry”, then paste it in Viber.';
  }
  window.location.href = link;                          // open the existing Viber chat
});

// --- Vehicle detail view ---
const vin = c => `VLC${c.year}${c.model.replace(/\W/g, '').slice(0, 2).toUpperCase()}${String(c.id).padStart(6, '0')}`;
const stock = c => `PM${String(261100 + c.id * 7)}`;

// Thumbnail rail: first 3 + a "+N" tile; expanded=true shows all.
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

// Switch the single main image (also syncs dots, arrows, active thumbnail).
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
    : `<div class="detail-main coming-soon">
         <span class="cs-mark">T</span><span class="cs-text">Photos Coming Soon</span>
       </div>`;
  el.detailThumbs.innerHTML = detailThumbsHTML(imgs, dhex, 0, false);

  const db = document.getElementById('detailBrand'); if (db) db.textContent = car.brand;
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
  document.body.classList.remove('home-view', 'parts-view');
  if (location.hash !== '#browse' && !location.hash.startsWith('#vehicle')) {
    history.replaceState(null, '', '#browse');
  }
}
function routeFromHash() {
  const h = location.hash;
  const m = h.match(/^#vehicle\/.*-(\d+)$/);
  if (m) {
    const car = inventory.find(c => c.id === +m[1]);
    if (car) { document.body.classList.remove('home-view', 'parts-view'); showDetail(car); return; }
  }
  hideDetail();
  const isParts = h === '#parts';
  document.body.classList.toggle('parts-view', isParts);
  document.body.classList.toggle('home-view', !isParts && (h === '' || h === '#' || h === '#home'));
  if (isParts) renderParts();
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
  { key: 'brand',    label: 'Brand',          type: 'list', vals: () => uniq(inventory.map(c => c.brand)).sort() },
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
      <input type="range" id="filterRange" min="${PRICE_MIN}" max="${PRICE_MAX}" step="${PRICE_STEP}" value="${f.maxPrice}" />
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
  if (t.classList.contains('dr-min') || t.classList.contains('dr-max')) return; // handled by wireDualRange
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

// Parts: brand chips filter the grid; each card inquires via Viber.
el.partsFilters.addEventListener('click', e => {
  const chip = e.target.closest('.parts-chip');
  if (!chip) return;
  partsBrand = chip.dataset.pbrand;
  renderParts();
});
el.partsGrid.addEventListener('click', e => {
  const btn = e.target.closest('.part-inquire');
  if (btn) inquirePart(+btn.dataset.part);
});

// Remove a single filter by clicking its chip.
el.activeFilters.addEventListener('click', e => {
  const chip = e.target.closest('.afilter-chip');
  if (!chip) return;
  const k = chip.dataset.remove, v = chip.dataset.val;
  const f = state.filters;
  if (['brand', 'model', 'dealer', 'exterior', 'interior'].includes(k)) f[k].delete(v);
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
  why: ['Why Supercar Approved', `<p>Every Supercar Philippines vehicle passes a rigorous <strong>142-point inspection</strong> and comes with a <strong>24-month warranty</strong>. Full service history, verified mileage, and a certificate of authenticity — so you buy with total confidence.</p>`],
  value: ['Value Your Car', `<p>Thinking of selling or trading in? Share the model, year, and mileage and our specialists return a competitive valuation within 24 hours.</p><p>Call <strong>+63 999 937 7194 (Viber)</strong> or email <strong>sell@supercarphilippines.ph</strong>.</p>`],
  sell: ['Sell Your Car', `<p>Consign or sell your performance car through Supercar Philippines — we handle photography, listing, and qualified buyers.</p><p>Email <strong>sell@supercarphilippines.ph</strong> to get started.</p>`],
  book: ['Book a Viewing', `<p>Arrange a private viewing at any Supercar Philippines showroom.</p><p>Call <strong>+63 999 937 7194 (Viber)</strong> or email <strong>viewings@supercarphilippines.ph</strong> with the vehicle and a preferred time.</p>`],
  contact: ['Contact', `<p><strong>Supercar Philippines — Makati</strong><br>Ayala Avenue, Makati, Metro Manila</p><p>+63 999 937 7194 (Viber)<br>hello@supercarphilippines.ph</p><p>Mon–Fri 9:00–18:00 · Sat 9:00–17:00 · Sun closed</p>`],
  dealer: ['Dealer Login', `<p>The dealer portal is available to authorised Supercar Philippines partners.</p><p>Contact <strong>partners@supercarphilippines.ph</strong> for access.</p>`],
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
    case 'parts': location.hash = 'parts'; window.scrollTo({ top: 0 }); break;
    case 'browse': showListings(); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 60); break;
    case 'models': showListings(); setTimeout(() => scrollToEl('.results'), 80); break;
    case 'brand-filter': {
      // Replace the brand selection but keep other active filters (e.g. budget)
      // so "Lamborghini + Under ₱25M" combine.
      state.filters.brand.clear();
      state.filters.brand.add(a.dataset.brand);
      state.favoritesOnly = false;
      showListings(); state.shown = PAGE_SIZE; render();
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80);
      break;
    }
    case 'budget': {
      // Set the max budget but keep other active filters (e.g. brand).
      state.filters.maxPrice = +a.dataset.max;
      state.favoritesOnly = false;
      showListings(); state.shown = PAGE_SIZE; render();
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80);
      break;
    }
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
  f.brand.clear(); f.model.clear(); f.dealer.clear(); f.exterior.clear(); f.interior.clear();
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
    const idx = dot ? +dot.dataset.i : +gallery.dataset.idx + +nav.dataset.dir;
    setGalleryIndex(gallery, idx);
    return;
  }
  // Any click within the gallery controls, or right after a swipe, must never
  // open the vehicle page.
  if (e.target.closest('.gdots') || e.target.closest('.gnav')) return;
  if (Date.now() - swipeGuard < 350) return;

  // Inquire → open the inquiry form. More Details / the card → vehicle page.
  const inquireBtn = e.target.closest('.btn-inquire');
  if (inquireBtn) {
    e.stopPropagation();
    const car = inventory.find(c => c.id === +inquireBtn.dataset.id);
    if (car) openInquire(car);
    return;
  }
  const detailsBtn = e.target.closest('.btn-details');
  const card = e.target.closest('.card');
  const id = detailsBtn ? +detailsBtn.dataset.id : (card ? +card.dataset.id : null);
  if (id != null) {
    const car = inventory.find(c => c.id === id);
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
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {   // horizontal swipe
      setGalleryIndex(gal, +gal.dataset.idx + (dx < 0 ? 1 : -1));
      swipeGuard = Date.now();
    }
    gal = null; x0 = null; y0 = null;
  }, { passive: true });
}
addSwipe(el.grid);
addSwipe(el.detailRelated);

// Vehicle-page controls
el.detailBack.addEventListener('click', () => { if (location.hash) history.back(); else hideDetail(); });
el.detailPrev.addEventListener('click', () => stepDetail(-1));
el.detailNext.addEventListener('click', () => stepDetail(1));
el.detailFav.addEventListener('click', () => {
  const car = state.detailCar; if (!car) return;
  state.favorites.has(car.id) ? state.favorites.delete(car.id) : state.favorites.add(car.id);
  el.detailFav.classList.toggle('active', state.favorites.has(car.id));
});
el.detail.addEventListener('click', e => {
  if (e.target.closest('.detail-inquire')) openInquire(state.detailCar);
});
// Thumbnails: click a thumb to switch the main image; "+N" expands the rail.
el.detailThumbs.addEventListener('click', e => {
  if (e.target.closest('.detail-thumb-more')) {
    el.detailThumbs.innerHTML = detailThumbsHTML(state.detailImgs, COLOR_HEX[state.detailCar.color], state.detailImgIdx, true);
    return;
  }
  const t = e.target.closest('.detail-thumb');
  if (t && t.dataset.i != null) setDetailImage(+t.dataset.i);
});
// Main image: arrows + dots + swipe.
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
window.addEventListener('hashchange', routeFromHash);

function resetAll() {
  const f = state.filters;
  f.brand.clear(); f.model.clear(); f.dealer.clear(); f.exterior.clear(); f.interior.clear();
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
  if (!el.inquireModal.hidden) closeInquire();
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

// --- Home carousels (Shop by Brand / Shop by Budget) ---
const BRAND_ORDER = ['Lamborghini', 'Ferrari', 'Porsche', 'McLaren'];

// Best representative image for a brand: prefer a real downloaded photo,
// otherwise the first inventory image for that brand. Reuses existing assets —
// no external URLs.
function brandHeroImage(brand) {
  const cars = inventory.filter(c => c.brand === brand);
  const withReal = cars.find(c => REAL_PHOTOS[c.model]);
  const car = withReal || cars[0];
  return car ? carImages(car)[0] : '';
}

function renderBrandCarousel() {
  const track = document.getElementById('brandTrack');
  if (!track) return;
  track.innerHTML = BRAND_ORDER.map(brand => {
    const count = inventory.filter(c => c.brand === brand).length;
    const img = brandHeroImage(brand);
    return `<button class="brand-card" data-action="brand-filter" data-brand="${brand}">
      <span class="brand-card-media">
        <img src="${img}" alt="${brand}" loading="lazy"
             data-fallback="${carPhoto('#181818', 0)}" onerror="photoFallback(this)" />
      </span>
      <span class="brand-card-info">
        <span class="brand-card-name">${brand}</span>
        <span class="brand-card-count">${count} available</span>
      </span>
    </button>`;
  }).join('');
}

// Generic carousel: arrow nav on desktop, native swipe on mobile, snap, and
// arrows that disable at the ends / hide when nothing overflows.
function wireCarousel(carousel) {
  const track = carousel.querySelector('.carousel-track');
  const prev = carousel.querySelector('.carousel-arrow.prev');
  const next = carousel.querySelector('.carousel-arrow.next');
  if (!track) return;

  const step = () => {
    const card = track.querySelector('*');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 18;
    const cardW = card ? card.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
    const perView = Math.max(1, Math.floor(track.clientWidth / cardW));
    return cardW * perView;   // advance one full "page" of cards
  };
  const EDGE = 4;   // tolerance for sub-pixel / padding offsets at the ends
  const update = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    const overflows = maxScroll > EDGE;
    carousel.classList.toggle('no-scroll', !overflows);
    if (prev) prev.disabled = track.scrollLeft <= EDGE;
    if (next) next.disabled = track.scrollLeft >= maxScroll - EDGE;
  };

  if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  if (next) next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}

function initHomeCarousels() {
  renderBrandCarousel();
  document.querySelectorAll('[data-carousel]').forEach(wireCarousel);
}

// --- Init ---
render();
initHomeCarousels();
routeFromHash();   // open a vehicle directly if the URL already points to one
