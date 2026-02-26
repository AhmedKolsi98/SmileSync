// ══════════════════════════════════════════════════════════
// HELPERS & UTILITIES
// ══════════════════════════════════════════════════════════

// DOM helpers
const $ = id => document.getElementById(id);

const el = (tag, cls, html = '') => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
};

function qs(sel, ctx = document) {
  return ctx.querySelector(sel);
}

function qsa(sel, ctx = document) {
  return [...ctx.querySelectorAll(sel)];
}

// Patient helpers
function getPatient(id) {
  return PATIENTS.find(p => p.id === id);
}

function getPatientName(id) {
  const p = getPatient(id);
  return p ? `${p.prenom} ${p.nom}` : 'Inconnu';
}

function avatarColor(str) {
  const colors = ['#3dffa0', '#00e5ff', '#9f7aea', '#f472b6', '#ffb830', '#4d9fff'];
  let h = 0;
  for (let c of str) h = (h * 31 + c.charCodeAt(0)) % colors.length;
  return colors[h];
}

function initials(p) {
  return (p.prenom[0] + p.nom[0]).toUpperCase();
}

// Date helpers
function formatDate(d) {
  if (!d) return '';
  const [y, m, dd] = d.split('-');
  return `${dd}/${m}/${y}`;
}

function todayStr() {
  return `${APP.today.getFullYear()}-${String(APP.today.getMonth() + 1).padStart(2, '0')}-${String(APP.today.getDate()).padStart(2, '0')}`;
}

// Tooth type helpers
function gtt(n) {
  const d = n % 10;
  if (d >= 6) return 'molar';
  if (d >= 4) return 'premolar';
  if (d === 3) return 'canine';
  return 'incisor';
}

function gtd(n) {
  const t = gtt(n);
  if (t === 'molar') return { w: 34, h: 28 };
  if (t === 'premolar') return { w: 24, h: 25 };
  if (t === 'canine') return { w: 20, h: 28 };
  return { w: 18, h: 26 };
}

// SVG path generator for tooth shapes
function tpath(cx, cy, w, h, t) {
  const hw = w / 2, hh = h / 2;
  if (t === 'molar') return `M${cx - hw + 3},${cy - hh + 7} Q${cx - hw},${cy - hh} ${cx - hw + 5},${cy - hh - 2} Q${cx},${cy - hh - 4} ${cx + hw - 5},${cy - hh - 2} Q${cx + hw},${cy - hh} ${cx + hw - 3},${cy - hh + 7} Q${cx + hw + 2},${cy} ${cx + hw - 2},${cy + hh - 4} Q${cx + hw / 2},${cy + hh + 2} ${cx},${cy + hh + 2} Q${cx - hw / 2},${cy + hh + 2} ${cx - hw + 2},${cy + hh - 4} Q${cx - hw - 2},${cy} ${cx - hw + 3},${cy - hh + 7}Z`;
  if (t === 'premolar') return `M${cx - hw + 2},${cy - hh + 5} Q${cx - hw},${cy - hh} ${cx - hw + 4},${cy - hh - 1} Q${cx},${cy - hh - 3} ${cx + hw - 4},${cy - hh - 1} Q${cx + hw},${cy - hh} ${cx + hw - 2},${cy - hh + 5} Q${cx + hw + 1},${cy} ${cx + hw - 1},${cy + hh - 2} Q${cx + hw / 2},${cy + hh + 1} ${cx},${cy + hh + 1} Q${cx - hw / 2},${cy + hh + 1} ${cx - hw + 1},${cy + hh - 2} Q${cx - hw - 1},${cy} ${cx - hw + 2},${cy - hh + 5}Z`;
  if (t === 'canine') return `M${cx - hw + 2},${cy - hh + 3} Q${cx - hw},${cy - hh} ${cx - hw + 4},${cy - hh - 2} Q${cx},${cy - hh - 7} ${cx + hw - 4},${cy - hh - 2} Q${cx + hw},${cy - hh} ${cx + hw - 2},${cy - hh + 3} L${cx},${cy + hh + 3} L${cx - hw + 2},${cy - hh + 3}Z`;
  return `M${cx - hw + 2},${cy - hh + 2} Q${cx - hw},${cy - hh - 1} ${cx},${cy - hh - 2} Q${cx + hw},${cy - hh - 1} ${cx + hw - 2},${cy - hh + 2} L${cx + hw - 1},${cy + hh} Q${cx},${cy + hh + 2} ${cx - hw + 1},${cy + hh} L${cx - hw + 2},${cy - hh + 2}Z`;
}

// Create SVG element
function svgE(tag, attrs) {
  const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  return e;
}

// Probe color based on depth
function probeColor(v) {
  if (v <= 3) return { bg: 'rgba(61,255,160,.15)', color: '#3dffa0' };
  if (v <= 5) return { bg: 'rgba(255,184,48,.15)', color: '#ffb830' };
  if (v <= 7) return { bg: 'rgba(255,140,66,.15)', color: '#ff8c42' };
  return { bg: 'rgba(255,77,109,.2)', color: '#ff4d6d' };
}

// Toast notification
function toast(msg, type = 'success') {
  const t = el('div', `toast toast-${type}`);
  t.innerHTML = `<span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span><span class="toast-msg">${msg}</span>`;
  $('toast-container').appendChild(t);
  setTimeout(() => { t.classList.add('hide'); setTimeout(() => t.remove(), 300); }, 3000);
}

// Tooltip
function showTip(e, html) {
  const tp = $('tooltip');
  tp.innerHTML = html;
  tp.style.display = 'block';
  moveTip(e);
}

function moveTip(e) {
  const tp = $('tooltip');
  tp.style.left = (e.clientX + 14) + 'px';
  tp.style.top = (e.clientY - 10) + 'px';
}

function hideTip() {
  $('tooltip').style.display = 'none';
}

// Modal helpers
function closeModal(id) {
  $(id).classList.remove('open');
}
