/* ============================================================
   Supercar Philippines — SHARED
   Data + helpers + common UI (header, slide-out menu, info dialogs).
   Loaded first on every page (index / cars / parts).
   ============================================================ */

/* ---------- Placeholder car photo (SVG data-URI) ---------- */
// Draws a sleek studio-lit supercar tinted to `hex` (the listing's colour).
// `variant` flips the car left/right so gallery slides look distinct.
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

/* ---------- Sample inventory (shared by Home + Cars) ---------- */
// priceOnRequest: true → show "Price on Request" instead of a figure.
const inventory = [
  { id: 1,  brand: 'Ferrari',     model: '296 GTB',      year: 2024, price: 389900, mileage: 1240,  color: 'Rosso',  interior: 'Nero',  dealer: 'Supercar PH Cubao', location: 'Cubao, Quezon City', certified: true,  isNew: true,  hp: 819,  drivetrain: 'RWD', engine: '3.0L V6 Hybrid' },
  { id: 2,  brand: 'Lamborghini', model: 'Huracán EVO',  year: 2023, price: 412500, mileage: 3890,  color: 'Giallo', interior: 'Nero',  dealer: 'Supercar PH Cubao', location: 'Cubao, Quezon City', certified: true,  isNew: false, hp: 631,  drivetrain: 'AWD', engine: '5.2L V10' },
  { id: 3,  brand: 'Ferrari',     model: '296 GTS',      year: 2024, price: 0, priceOnRequest: true, mileage: 640,   color: 'Nero',   interior: 'Rosso', dealer: 'Supercar PH Cubao', location: 'Cubao, Quezon City', certified: true,  isNew: true,  hp: 819,  drivetrain: 'RWD', engine: '3.0L V6 Hybrid' },
  { id: 4,  brand: 'Ferrari',     model: 'SF90 Stradale',year: 2022, price: 549000, mileage: 6120,  color: 'Rosso',  interior: 'Nero',  dealer: 'Supercar PH Cubao', location: 'Cubao, Quezon City', certified: true,  isNew: false, hp: 986,  drivetrain: 'AWD', engine: '4.0L V8 Hybrid' },
  { id: 5,  brand: 'Porsche',     model: '911 Turbo S',  year: 2023, price: 274900, mileage: 5210,  color: 'Grigio', interior: 'Nero',  dealer: 'Supercar PH Cubao', location: 'Cubao, Quezon City', certified: true,  isNew: false, hp: 640,  drivetrain: 'AWD', engine: '3.8L Flat-6' },
  { id: 6,  brand: 'Lamborghini', model: 'Aventador SVJ',year: 2021, price: 598000, mileage: 4980,  color: 'Giallo', interior: 'Nero',  dealer: 'Supercar PH Cubao', location: 'Cubao, Quezon City', certified: true,  isNew: false, hp: 759,  drivetrain: 'AWD', engine: '6.5L V12' },
  { id: 7,  brand: 'McLaren',     model: '720S',         year: 2022, price: 358000, mileage: 3870,  color: 'Nero',   interior: 'Rosso', dealer: 'Supercar PH Cubao', location: 'Cubao, Quezon City', certified: true,  isNew: false, hp: 710,  drivetrain: 'RWD', engine: '4.0L V8 Twin-Turbo' },
  { id: 8,  brand: 'Ferrari',     model: 'Roma',         year: 2023, price: 244900, mileage: 3980,  color: 'Bianco', interior: 'Crema', dealer: 'Supercar PH Cubao', location: 'Cubao, Quezon City', certified: false, isNew: false, hp: 612,  drivetrain: 'RWD', engine: '3.9L V8' },
  { id: 9,  brand: 'Porsche',     model: 'Taycan Turbo', year: 2022, price: 198000, mileage: 8450,  color: 'Grigio', interior: 'Nero',  dealer: 'Supercar PH Cubao', location: 'Cubao, Quezon City', certified: true,  isNew: false, hp: 671,  drivetrain: 'AWD', engine: 'Dual Electric Motor' },
  { id: 10, brand: 'McLaren',     model: 'Artura',       year: 2024, price: 289500, mileage: 780,   color: 'Nero',   interior: 'Cuoio', dealer: 'Supercar PH Cubao', location: 'Cubao, Quezon City', certified: true,  isNew: true,  hp: 671,  drivetrain: 'RWD', engine: '3.0L V6 Hybrid' },
  { id: 11, brand: 'Lamborghini', model: 'Huracán STO',  year: 2023, price: 0, priceOnRequest: true, mileage: 2010,  color: 'Nero',   interior: 'Rosso', dealer: 'Supercar PH Cubao', location: 'Cubao, Quezon City', certified: true,  isNew: false, hp: 631,  drivetrain: 'RWD', engine: '5.2L V10' },
  { id: 12, brand: 'Ferrari',     model: 'Portofino M',  year: 2023, price: 231000, mileage: 3320,  color: 'Bianco', interior: 'Blu',   dealer: 'Supercar PH Cubao', location: 'Cubao, Quezon City', certified: false, isNew: false, hp: 612,  drivetrain: 'RWD', engine: '3.9L V8' },
];

// One car (id 1) is shown from 6 matching angles; every other car gets a single photo.
const SIX_ANGLE = [
  'img/4dbab45a522b417e916eda2e494ee0e1.jpg',
  'img/828c4b25e8f94dbc9203a9a41b9ae20c.jpg',
  'img/b836707854bc41b69751bd1032c12b29.jpg',
  'img/c01af77cab7f43a789595438e41e8e53.jpg',
  'img/eec1d6eed4c34ecbb038bca937588e89.jpg',
  'img/fa15a74959954c36bc28ed2d6459c0a0.jpg',
];
const SINGLES = [
  'img/gettyimages-2232400795-612x612.jpg',
  'img/gettyimages-182185108-612x612.jpg',
  'img/gettyimages-1277770032-612x612.jpg',
  'img/gettyimages-157330801-612x612.jpg',
  'img/gettyimages-157333521-612x612.jpg',
];
// Real downloaded photos, keyed by model. encodeURI handles spaces/accents.
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

// Inline <img> error handler: swap a failed photo for its tinted placeholder.
function photoFallback(img) { img.onerror = null; img.src = img.dataset.fallback; }
window.photoFallback = photoFallback;

/* ---------- Formatters (Philippines: PHP + kilometres) ---------- */
const peso = n => '₱' + Math.round(n * 57).toLocaleString('en-US');
const km = n => Math.round(n * 1.609).toLocaleString('en-US') + ' km';
const priceLabel = c => c.priceOnRequest ? 'Price on Request' : peso(c.price);

// Image list for a car: real photos if present, else generated placeholders.
function carImages(c) {
  if (c.images && c.images.length) return c.images;
  return Array.from({ length: c.photoCount || 0 }, (_, i) => carPhoto(COLOR_HEX[c.color], i));
}

// URL helper — a slug keeps the vehicle link readable; the id is what we route on.
const carSlug = c => `${c.model}-${c.id}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const uniq = arr => [...new Set(arr)];
function isMobileDevice() {
  return navigator.userAgentData?.mobile || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/* ---------- Viber (client's working deep link — DO NOT CHANGE) ---------- */
const VIBER_NUMBER = '+639999377194';   // Supercar Philippines
const VIBER_CHAT_LINK = `viber://chat?number=${encodeURIComponent(VIBER_NUMBER)}`;

// Copy helper: Clipboard API with a self-contained textarea fallback so it
// works on any page (no dependency on a specific element being present).
async function copyToClipboard(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch (err) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.focus(); ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (_) { return false; }
  }
}
function flashCopied(btn) {
  const old = btn.textContent;
  btn.textContent = 'Copied ✓';
  setTimeout(() => { btn.textContent = old; }, 1600);
}

/* ============================================================
   Shared UI — info dialogs, slide-out menu, header scroll
   ============================================================ */
const scrollToEl = sel => { const t = document.querySelector(sel); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

// Quick info dialogs (Why Approved, Value Your Car, Contact, etc.)
const INFO = {
  why: ['Why Supercar Philippines', `<p>Supercar Philippines curates an exclusive selection of performance and luxury vehicles from leading automotive brands, and guides every buyer personally from first enquiry to handover.</p><p>Message us on Viber at <strong>+63 999 937 7194</strong> to learn more.</p>`],
  value: ['Value Your Car', `<p>Thinking of selling or trading in? Share the model, year, and mileage and our specialists return a competitive valuation within 24 hours.</p><p>Call <strong>+63 999 937 7194 (Viber)</strong> or email <strong>sell@supercarphilippines.ph</strong>.</p>`],
  sell: ['Sell Your Car', `<p>Consign or sell your performance car through Supercar Philippines — we handle photography, listing, and qualified buyers.</p><p>Email <strong>sell@supercarphilippines.ph</strong> to get started.</p>`],
  book: ['Book a Viewing', `<p>Arrange a private viewing at any Supercar Philippines showroom.</p><p>Call <strong>+63 999 937 7194 (Viber)</strong> or email <strong>viewings@supercarphilippines.ph</strong> with the vehicle and a preferred time.</p>`],
  contact: ['Contact', `<p><strong>Supercar Philippines — Makati</strong><br>Ayala Avenue, Makati, Metro Manila</p><p>+63 999 937 7194 (Viber)<br>hello@supercarphilippines.ph</p><p>Mon–Fri 9:00–18:00 · Sat 9:00–17:00 · Sun closed</p>`],
  dealer: ['Dealer Login', `<p>The dealer portal is available to authorised Supercar Philippines partners.</p><p>Contact <strong>partners@supercarphilippines.ph</strong> for access.</p>`],
  'save-search': ['Search Saved', `<p>We'll notify you the moment a car matching your filters becomes available.</p><p>Add your email in <strong>Account → Saved Searches</strong> to receive alerts.</p>`],
};
const _modal = document.getElementById('modal');
const _modalBody = document.getElementById('modalBody');
function openInfo(title, body) {
  if (!_modal || !_modalBody) return;
  _modalBody.innerHTML = `<div class="info-modal"><h2>${title}</h2>${body}</div>`;
  _modal.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  if (!_modal) return;
  _modal.hidden = true;
  document.body.style.overflow = '';
}
if (_modal) {
  const mc = document.getElementById('modalClose');
  if (mc) mc.addEventListener('click', closeModal);
  _modal.addEventListener('click', e => { if (e.target === _modal) closeModal(); });
}

/* ---------- Slide-out menu ---------- */
const _menuBtn = document.getElementById('menuBtn');
const _megaMenu = document.getElementById('megaMenu');
const _megaClose = document.getElementById('megaClose');
const _megaNav = document.getElementById('megaNav');
// Two stacked <video> layers in the menu's right panel: the active one is
// visible, the other is idle. Hovering a nav item loads its clip into the idle
// layer, plays it, and crossfades — so there's no leftover poster image and a
// smooth transition between videos.
const _megaRight = document.getElementById('megaRight');
const _megaVideos = _megaRight ? [..._megaRight.querySelectorAll('.mega-video')] : [];
const _activeVid = () => _megaVideos.find(v => v.classList.contains('is-active')) || _megaVideos[0];
function playMegaVideo(src) {
  if (_megaVideos.length < 2 || !src) return;
  const cur = _activeVid();
  if (cur && cur.getAttribute('src') === src) { cur.play().catch(() => {}); return; }
  const next = _megaVideos.find(v => v !== cur) || _megaVideos[0];
  next.setAttribute('src', src);
  next.load();
  next.play().catch(() => {});
  next.classList.add('is-active');
  if (cur) { cur.classList.remove('is-active'); setTimeout(() => { try { cur.pause(); } catch (e) {} }, 600); }
}
function openMenu() {
  if (!_megaMenu) return;
  _megaMenu.hidden = false; document.body.style.overflow = 'hidden';
  const v = _activeVid(); if (v) v.play().catch(() => {});
}
function closeMenu() {
  if (!_megaMenu) return;
  _megaMenu.hidden = true; document.body.style.overflow = '';
  _megaVideos.forEach(v => { try { v.pause(); } catch (e) {} });
}
if (_menuBtn) _menuBtn.addEventListener('click', openMenu);
if (_megaClose) _megaClose.addEventListener('click', closeMenu);
if (_megaMenu) _megaMenu.addEventListener('click', e => { if (e.target === _megaMenu) closeMenu(); });
if (_megaNav) _megaNav.addEventListener('mouseover', e => {
  const a = e.target.closest('a[data-video]'); if (!a) return;
  _megaNav.querySelectorAll('a').forEach(x => x.classList.remove('active'));
  a.classList.add('active');
  playMegaVideo(a.dataset.video);
});

/* ---------- Shared [data-action]: close menu + open info dialogs ---------- */
// Page-specific actions (filters on cars.js, carousels on home.js) are handled
// in their own files; here we only own the INFO dialog keys, so we never call
// preventDefault on actions that belong to another script.
document.addEventListener('click', e => {
  const a = e.target.closest('[data-action]');
  if (!a) return;
  const action = a.dataset.action;
  if (_megaMenu && !_megaMenu.hidden) closeMenu();
  // Dealer Login goes to the real admin sign-in (Supabase Auth).
  if (action === 'dealer') { e.preventDefault(); window.location.href = 'admin/index.html'; return; }
  if (INFO[action]) { e.preventDefault(); openInfo(INFO[action][0], INFO[action][1]); }
});

/* ---------- Header solidify on scroll + sticky sub-header + back-to-top ---------- */
const _subHeader = document.getElementById('subHeader');
const _toTop = document.getElementById('toTop');
function sharedOnScroll() {
  const y = window.scrollY;
  document.body.classList.toggle('scrolled', y > 24);
  if (_subHeader) _subHeader.classList.toggle('show', y > 360 && !document.body.classList.contains('home-view'));
  if (_toTop) _toTop.classList.toggle('show', y > 500);
}
if (_toTop) _toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
window.addEventListener('scroll', sharedOnScroll, { passive: true });
sharedOnScroll();

// Close overlays on Escape (modal + menu; page scripts add their own modals).
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  closeModal();
  if (_megaMenu && !_megaMenu.hidden) closeMenu();
});
