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

// Part inquiry: copy the details, then open the client's Viber chat.
function inquirePart(idx) {
  const p = parts[idx];
  const link = location.origin + location.pathname;
  const msg =
    `Hello Supercar Philippines!\nI'm interested in this part:\n` +
    `${p.brand} — ${p.name} (${p.category})\nPrice: ${peso(p.price)}\n\nLink: ${link}`;
  copyToClipboard(msg);
  window.location.href = VIBER_CHAT_LINK;
}

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
