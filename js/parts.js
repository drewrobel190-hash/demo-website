/* ============================================================
   Supercar Philippines — PARTS
   Genuine & performance parts, organised by brand, each with a
   Viber inquiry. Depends on shared.js (peso, Viber, copy helper).
   ============================================================ */

// Demonstration / placeholder parts photos (files live in img/parts, kept as-is).
// Relative paths so they work on GitHub Pages, not tied to any local machine path.
// NOTE: the supplied batch only covers Brakes, Carbon Fibre, Wheels and Exhaust —
// Interior / Engine parts reuse the closest premium image as a stand-in for now.
const PART_PHOTOS = [
  'img/parts/0CM6DjextjihvS83PUA0f5__hwwhKKfTvEOZWTCigsq1a4bxPG9JQGWtijXAVBldfbsP2XuIcRmW9F4Pw8Ya7wCptzcAndZGTX9UJ3IASsJtABb2_CvSxNMH_xUNOk-B1Db35Tv49ROGf4aRVs2k_Ps.jfif',  // 0: engine bay / brake
  'img/parts/4eBQvIlJi6jilmHqGm-RKJeShkikuS2Y25kGWV-A6dRGCIgsOioNsrUbuFM2FgSP6bkv5mSoGLoMcKE9K44fKtiAFt00V6sL5UHXp1oyN-MOjCTtVq9OMAMMkjOsdI_VN_vuJSBZSH_8OV-oUux70n.jfif',  // 1: carbon aero panels
  'img/parts/5iFkZn6HWuehHu-7oriE2oMqJx-NzGvLAFJ3G61xJkDDXRDqLuyyC_cMJWPIdOjjbTPqNU65kNHnEMxxAXKYNbbOEd_k9iQGHH7KDYaC2deOIa_rXol2Jh1EjGIQXyGOtkZdwzeyIwcjiLg69CtjB2.jfif',  // 2: Porsche carbon-ceramic brake
  'img/parts/EuMRjm6ElyHmPyaeS8hCWBOweFaBfH34aatQRI8GhhNde4azmWbmpG0Rlf3uWRSpg9yKfMlTfqjkuHsFS294s-P5WJEYWGedu6TS_x-tQ05P4yzH-iHMMKFVaPzGjD21-MUA9tTyU64N86RT3tlPEp.jfif',  // 3: Ferrari carbon-ceramic brake
  'img/parts/gj8yxHBVfRe8nxwXyvwZ-bRaxdxT3GohKka2eyC4bEX6o8Vjc3DlEgIrBn76sCoIrrh7Svb2ykW9rjmApT1C0VmFs9Ss0k7_EkNyjQCUjXa-P5hRct53wGUXFAeRF-J1IT3sabjfVySu5OUd_eWtVP.jfif',  // 4: carbon aero kit (studio)
  'img/parts/h9QV9eM0Eklwo3p0THDd9xspPwoVT_OI3bgu4kdbwUFfg-OMQGmwgPQh-JBEfbU0OQuC9SyfymEbBEY_ohXknKMcLtqo7n715E3hrkLrbpaWGp7MNgeyv1iV-fQoR7uaXdO5rz2b2OgJgIHGXSuW--.jfif',  // 5: forged wheel
  'img/parts/lAl0jAWciTTiBEqGFXyCvGEVHzLXmjK9xVDEA3p6XXZCkJ61tGYXuMEFG0qBzUOO-7pWomYtP-Uumli6Vbn-zGlz9cSgNzI8h9HacnOeojCSED7dMSRGNPC2ALgSmu-zHoGMHoZpvgJHGVy787QWwg.jfif',  // 6: carbon spoiler + skirts
  'img/parts/oAHGXy536lUl7tZ6j0_axtVOOZNzcdf_w-I-3_gaNmaRTg8DJRhlP2SgoxPU_uYjyQYzNSZ5U8pIhvdQ47MRF7spiiFMHzxUG9dvF1uKIZcJ5iAat30oFx5xsidbuz5BOZ1QyvOBjPi6Bs5JHY7wS4.jfif',  // 7: titanium exhaust (white)
  'img/parts/yk_9DywA9rNyfzZq7Is6eHWoYEHBkVQV2gjeyDvESnu0TQhU2IEkLXhRalhCbrHWeJ0W1kNT7BWGEDOTWixdA4JR9p7fNyWTgrxUEJH_adMVnPXaQ5OUGYaon9Prw6HFIv0HfLVNfq4gxApIOf9Lpk.jfif',  // 8: titanium exhaust (burnt tips)
];

// Prices are in the same base units as cars (displayed in PHP via peso()).
const parts = [
  { name: 'Carbon Fibre Rear Wing',        brand: 'Lamborghini', category: 'Exterior', price: 9800,  img: PART_PHOTOS[6] },
  { name: 'Forged Alloy Wheel Set',        brand: 'Ferrari',     category: 'Wheels',   price: 12500, img: PART_PHOTOS[5] },
  { name: 'Titanium Sport Exhaust',        brand: 'McLaren',     category: 'Exhaust',  price: 8600,  img: PART_PHOTOS[7] },
  { name: 'Carbon Ceramic Brake Kit',      brand: 'Porsche',     category: 'Brakes',   price: 11200, img: PART_PHOTOS[2] },
  { name: 'Alcantara Steering Wheel',      brand: 'Ferrari',     category: 'Interior', price: 3400,  img: PART_PHOTOS[4] },
  { name: 'Carbon Fibre Side Skirts',      brand: 'Lamborghini', category: 'Exterior', price: 5200,  img: PART_PHOTOS[1] },
  { name: 'High-Flow Air Intake',          brand: 'McLaren',     category: 'Engine',   price: 2900,  img: PART_PHOTOS[0] },
  { name: 'Sport Bucket Seats (Pair)',     brand: 'Porsche',     category: 'Interior', price: 7400,  img: PART_PHOTOS[4] },
  { name: 'Forged Wheel Set — Matte',      brand: 'Lamborghini', category: 'Wheels',   price: 13800, img: PART_PHOTOS[5] },
  { name: 'Front Splitter — Carbon',       brand: 'Ferrari',     category: 'Exterior', price: 6100,  img: PART_PHOTOS[1] },
  { name: 'Performance Brake Pads',        brand: 'McLaren',     category: 'Brakes',   price: 1800,  img: PART_PHOTOS[3] },
  { name: 'Valved Titanium Exhaust',       brand: 'Porsche',     category: 'Exhaust',  price: 9200,  img: PART_PHOTOS[8] },
];

const partsEl = {
  filters: document.getElementById('partsFilters'),
  grid: document.getElementById('partsGrid'),
  count: document.getElementById('partsCount'),
};
let partsBrand = 'All';

function partCardHTML(p, idx) {
  return `<article class="part-card">
    <div class="part-media">
      ${p.img ? `<img class="part-img" src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.remove()" />` : ''}
      <span class="part-cat">${p.category}</span>
    </div>
    <div class="part-body">
      <div class="card-brand">${p.brand}</div>
      <h3 class="part-name">${p.name}</h3>
      <div class="part-price">${peso(p.price)}</div>
      <button class="btn-inquire part-inquire" data-part="${idx}">Inquire via Viber</button>
    </div>
  </article>`;
}
function renderParts() {
  const brands = ['All', ...uniq(parts.map(p => p.brand)).sort()];
  partsEl.filters.innerHTML = brands.map(b =>
    `<button class="parts-chip${b === partsBrand ? ' active' : ''}" data-pbrand="${b}">${b}</button>`).join('');
  const list = partsBrand === 'All' ? parts : parts.filter(p => p.brand === partsBrand);
  partsEl.grid.innerHTML = list.map(p => partCardHTML(p, parts.indexOf(p))).join('');
  partsEl.count.textContent = list.length;
}

// Part inquiry — mirrors the cars flow: build the message (part + type + price +
// direct link), auto-copy it, show the "ready" screen with Copy Inquiry + Open
// Viber; on mobile, open Viber straight away too.
const partModal = document.getElementById('partInquireModal');
function buildPartText(p) {
  const link = location.origin + location.pathname;
  return `Hello Supercar Philippines!\n` +
    `I'm interested in this part:\n` +
    `${p.brand} ${p.name}\n` +
    `Type: ${p.category}\n` +
    `Price: ${peso(p.price)}\n\n` +
    `Part link:\n${link}`;
}
function inquirePart(idx) {
  const p = parts[idx];
  const text = buildPartText(p);
  document.getElementById('partReadyText').value = text;
  partModal.hidden = false;
  document.body.style.overflow = 'hidden';
  copyToClipboard(text);
  if (isMobileDevice()) window.location.href = VIBER_CHAT_LINK;
}
function closePartInquire() { partModal.hidden = true; document.body.style.overflow = ''; }
document.getElementById('partInquireClose').addEventListener('click', closePartInquire);
document.getElementById('partInquireDoneClose').addEventListener('click', closePartInquire);
partModal.addEventListener('click', e => { if (e.target === partModal) closePartInquire(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !partModal.hidden) closePartInquire(); });
document.getElementById('partCopyInquiry').addEventListener('click', async e => {
  if (await copyToClipboard(document.getElementById('partReadyText').value)) flashCopied(e.currentTarget);
});
document.getElementById('partCopyNumber').addEventListener('click', async e => {
  if (await copyToClipboard('+63 999 937 7194')) flashCopied(e.currentTarget);
});
// Open Viber button: auto-copy the inquiry, THEN open the exact working deep link.
document.getElementById('partOpenViber').addEventListener('click', async e => {
  e.preventDefault();
  const link = e.currentTarget.getAttribute('href');
  const ok = await copyToClipboard(document.getElementById('partReadyText').value);
  if (!ok) {
    const hint = document.querySelector('#partInquireModal .inq-viber-hint');
    if (hint) hint.textContent = 'Couldn’t copy automatically — tap “Copy Inquiry”, then paste it in Viber.';
  }
  window.location.href = link;
});

partsEl.filters.addEventListener('click', e => {
  const chip = e.target.closest('.parts-chip');
  if (!chip) return;
  partsBrand = chip.dataset.pbrand;
  renderParts();
});
partsEl.grid.addEventListener('click', e => {
  const btn = e.target.closest('.part-inquire');
  if (btn) inquirePart(+btn.dataset.part);
});

/* ---------- Init ---------- */
renderParts();
