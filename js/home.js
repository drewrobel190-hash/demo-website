/* ============================================================
   Supercar Philippines — HOME
   Shop by Brand / Shop by Budget carousels. Clicking a card
   navigates to cars.html with the matching filter applied via
   query string (?brand=… / ?budget=…), which cars.js reads.
   Depends on shared.js (inventory, carImages, REAL_PHOTOS, carPhoto).
   ============================================================ */

// "Available now" stat in the hero.
(() => { const hc = document.getElementById('homeCount'); if (hc) hc.textContent = inventory.length; })();

/* ---------- Shop by Brand ---------- */
const BRAND_ORDER = ['Lamborghini', 'Ferrari', 'Porsche', 'McLaren'];

// Best representative image for a brand: prefer a real downloaded photo,
// otherwise the first inventory image for that brand. Reuses existing assets.
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
    return `<a class="brand-card" href="cars.html?brand=${encodeURIComponent(brand)}">
      <span class="brand-card-media">
        <img src="${img}" alt="${brand}" loading="lazy"
             data-fallback="${carPhoto('#181818', 0)}" onerror="photoFallback(this)" />
      </span>
      <span class="brand-card-info">
        <span class="brand-card-name">${brand}</span>
        <span class="brand-card-count">${count} available</span>
      </span>
    </a>`;
  }).join('');
}

/* ---------- Generic carousel: arrows (desktop) + swipe (mobile) + snap ---------- */
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
  const setArrows = pos => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    carousel.classList.toggle('no-scroll', maxScroll <= EDGE);
    if (prev) prev.disabled = pos <= EDGE;
    if (next) next.disabled = pos >= maxScroll - EDGE;
  };
  const update = () => setArrows(track.scrollLeft);
  // Arrow click: scroll to a clamped target and set the arrow state from that
  // target immediately, so it never depends on smooth-scroll event timing.
  const nudge = dir => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    const target = Math.max(0, Math.min(maxScroll, track.scrollLeft + dir * step()));
    track.scrollTo({ left: target, behavior: 'smooth' });
    setArrows(target);
  };
  if (prev) prev.addEventListener('click', () => nudge(-1));
  if (next) next.addEventListener('click', () => nudge(1));
  track.addEventListener('scroll', update, { passive: true });   // keeps arrows in sync during swipe
  window.addEventListener('resize', update, { passive: true });
  update();
}

function initHomeCarousels() {
  renderBrandCarousel();
  document.querySelectorAll('[data-carousel]').forEach(wireCarousel);
}

initHomeCarousels();
