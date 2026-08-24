/* ============================================================
   Supercar Philippines — PARTS
   Genuine & performance parts, organised by brand, each with a
   Viber inquiry. Depends on shared.js (peso, Viber, copy helper).
   ============================================================ */

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

const partsEl = {
  filters: document.getElementById('partsFilters'),
  grid: document.getElementById('partsGrid'),
  count: document.getElementById('partsCount'),
};
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
