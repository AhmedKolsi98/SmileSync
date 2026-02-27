// Dental Chart Module
import { TOOTH_SC, TOOTH_SL, TOOTH_SB, TOOTH_NAMES, upper, lower } from './config.js';
import { PARO_DATA } from './data.js';
import { getPatient, gtt, gtd, tpath, svgE, el, probeColor, showTip, moveTip, hideTip, toast } from './utils.js';

const chartFaceBuilt = {}, chartParoBuilt = {};

export function renderDentalChartHTML(patientId, teeth) {
  return `<div style="margin-top:12px;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
      <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:13px;display:flex;align-items:center;gap:8px;"><div class="card-title-dot"></div>Chart Dentaire</div>
      <div class="chart-actions-bar">
        <button class="chip active" onclick="switchChartView('2d',this,'${patientId}')">Vue 2D</button>
        <button class="chip" onclick="switchChartView('face',this,'${patientId}')">Vue Face</button>
        <button class="chip" onclick="switchChartView('paro',this,'${patientId}')">Paro</button>
      </div>
    </div>
    <div id="cv-2d-${patientId}" class="view-container active">
      <div class="dental-chart-wrapper">
        <div class="arcade-label">MÂCHOIRE SUPÉRIEURE</div>
        <svg id="dsvg-${patientId}" viewBox="0 0 720 200" style="width:100%;max-width:720px;" xmlns="http://www.w3.org/2000/svg"></svg>
        <div class="jaw-divider"><div class="jaw-line"></div><div class="jaw-label">Mâchoire sup. / inf.</div><div class="jaw-line"></div></div>
        <div class="arcade-label inferior">MÂCHOIRE INFÉRIEURE</div>
      </div>
      <div class="chart-legend">
        ${Object.entries(TOOTH_SL).map(([k, v]) => `<div class="legend-item"><div class="legend-dot" style="background:${TOOTH_SC[k]};"></div>${v}</div>`).join('')}
      </div>
    </div>
    <div id="cv-face-${patientId}" class="view-container">
      <svg id="fsvg-${patientId}" viewBox="0 0 700 300" style="width:100%;max-width:700px;" xmlns="http://www.w3.org/2000/svg"></svg>
    </div>
    <div id="cv-paro-${patientId}" class="view-container">
      <div class="paro-container"><div id="paro-${patientId}"></div></div>
    </div>
  </div>`;
}

export function initDentalChart(pid, teeth) {
  const svg = document.getElementById(`dsvg-${pid}`);
  if (!svg || svg.dataset.built) return;
  svg.dataset.built = '1';
  const defaultTeeth = {};
  [...upper, ...lower].forEach(n => defaultTeeth[n] = 'healthy');
  const allTeeth = { ...defaultTeeth, ...teeth };

  function renderArc(arr, yC, isLow) {
    const sX = 10, tS = 700 / 16;
    arr.forEach((num, i) => {
      const cx = sX + (i + .5) * tS, { w, h } = gtd(num), type = gtt(num), st = allTeeth[num] || 'healthy';
      const numY = isLow ? yC + h / 2 + 12 : yC - h / 2 - 4;
      const g = svgE('g', { class: 'tooth-group', 'data-tooth': num, 'data-pid': pid, 'data-status': st });
      if (st === 'crown') { g.appendChild(svgE('path', { d: tpath(cx, yC, w + 5, h + 4, type), fill: 'none', stroke: '#00e5ff', 'stroke-width': '1.5', opacity: '.4' })); }
      if (st === 'bridge' && i > 0 && (allTeeth[arr[i - 1]] || 'healthy') === 'bridge') {
        const pCx = sX + (i - .5) * tS, pw = gtd(arr[i - 1]).w;
        svg.insertBefore(svgE('line', { x1: pCx + pw / 2 - 1, y1: yC, x2: cx - w / 2 + 1, y2: yC, stroke: '#f472b6', 'stroke-width': '2.5', 'stroke-dasharray': '4,2', opacity: '.5' }), g);
      }
      const path = svgE('path', { class: 'tooth-shape', d: tpath(cx, yC, w, h, type), fill: TOOTH_SC[st] || TOOTH_SC.healthy, id: `tf-${pid}-${num}` });
      if (st === 'implant') { g.appendChild(svgE('circle', { cx, cy: yC, r: '4', fill: 'none', stroke: '#ffb830', 'stroke-width': '1.5', 'stroke-dasharray': '3,2' })); }
      const txt = svgE('text', { class: 'tooth-number', x: cx, y: numY }); txt.textContent = num;
      g.appendChild(path); g.appendChild(txt); svg.appendChild(g);
      g.addEventListener('mouseenter', e => showTip(e, `<strong style="color:var(--accent)">${num}</strong> ${TOOTH_NAMES[num] || ''}<br><span style="color:${TOOTH_SC[st]}">${TOOTH_SL[st]}</span>`));
      g.addEventListener('mousemove', moveTip); g.addEventListener('mouseleave', hideTip);
      g.addEventListener('click', () => openToothModal(pid, num, allTeeth));
    });
  }
  renderArc(upper, 56, false);
  renderArc(lower, 148, true);
}

export function switchChartView(v, btn, pid) {
  const tcContent = btn.closest('[id^="tc-"]') || btn.closest('.tab-content');
  const container = tcContent || btn.closest('.card');
  if (!container) return;
  container.querySelectorAll('.view-container').forEach(e => e.classList.remove('active'));
  btn.closest('.chart-actions-bar').querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  const target = document.getElementById('cv-' + v + '-' + pid);
  if (target) target.classList.add('active');
  btn.classList.add('active');
  if (v === '2d') {
    const p = getPatient(parseInt(pid));
    if (p) setTimeout(() => initDentalChart(parseInt(pid), p.teeth), 30);
  }
  if (v === 'face' && !chartFaceBuilt[pid]) { chartFaceBuilt[pid] = true; buildFaceView(pid); }
  if (v === 'paro' && !chartParoBuilt[pid]) { chartParoBuilt[pid] = true; buildParoView(pid); }
}

export function openToothModal(pid, num, teeth) {
  const p = getPatient(pid);
  const st = teeth[num] || 'healthy';
  const sb = TOOTH_SB[st];
  const modal = document.getElementById('modal-tooth');
  modal.innerHTML = `
  <div class="modal modal-md">
    <div class="modal-header">
      <div class="modal-title" style="display:flex;align-items:center;gap:10px;">
        <span style="font-family:'Syne';font-size:24px;font-weight:800;color:var(--accent)">${num}</span>
        <div><div>${TOOTH_NAMES[num] || 'Dent'}</div><div style="font-size:11px;color:var(--text2);font-weight:400;">${p?.prenom} ${p?.nom}</div></div>
      </div>
      <button class="modal-close" onclick="closeModal('modal-tooth')">✕</button>
    </div>
    <div style="margin-bottom:16px;">
      <div class="form-label" style="margin-bottom:8px;">Statut actuel</div>
      <span class="badge" style="background:${sb.bg};color:${sb.c};font-size:12px;padding:5px 14px;">● ${TOOTH_SL[st]}</span>
    </div>
    <div class="form-label" style="margin-bottom:8px;">Modifier le statut</div>
    <div class="tooth-status-grid">
      ${Object.entries(TOOTH_SL).map(([k, v]) => `
      <div class="tooth-status-btn ${k === st ? 'selected' : ''}" style="${k === st ? `border-color:${TOOTH_SC[k]};background:${TOOTH_SB[k].bg};color:${TOOTH_SC[k]};` : ''}color:${TOOTH_SC[k]}" onclick="setToothStatus(${pid},${num},this,'${k}')">
        <div style="width:12px;height:12px;border-radius:50%;background:${TOOTH_SC[k]};margin:0 auto 5px;"></div>
        <div style="font-size:10px;">${v}</div>
      </div>`).join('')}
    </div>
    <div class="divider"></div>
    <div class="form-row form-row-2">
      <div class="form-group"><label class="form-label">Diagnostic</label><input class="form-input" placeholder="Ex: Carie profonde..."></div>
      <div class="form-group"><label class="form-label">Traitement</label><input class="form-input" placeholder="Ex: Obturation résine..."></div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label class="form-label">Date</label><input class="form-input" type="date" value="${todayStr()}"></div>
      <div class="form-group"><label class="form-label">Prochain RDV</label><input class="form-input" type="date"></div>
    </div>
    <div class="form-group" style="margin-bottom:0;"><label class="form-label">Notes</label><textarea class="form-textarea" placeholder="Observations cliniques..."></textarea></div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal('modal-tooth')">Fermer</button>
      <button class="btn btn-accent" onclick="saveToothData(${pid},${num});closeModal('modal-tooth')">Enregistrer</button>
    </div>
  </div>`;
  modal.classList.add('open');
}

export function setToothStatus(pid, num, btn, status) {
  const p = getPatient(pid); if (!p) return;
  p.teeth[num] = status;
  const tf = document.getElementById(`tf-${pid}-${num}`);
  if (tf) { tf.style.transition = 'fill 0.2s'; tf.setAttribute('fill', TOOTH_SC[status]); }
  btn.closest('.tooth-status-grid').querySelectorAll('.tooth-status-btn').forEach(b => {
    b.classList.remove('selected');
    b.style.cssText = `color:${TOOTH_SC[b.querySelector('div').style.background]}`;
  });
  btn.classList.add('selected');
  btn.style.cssText = `border-color:${TOOTH_SC[status]};background:${TOOTH_SB[status].bg};color:${TOOTH_SC[status]};`;
  toast(`Dent ${num}: ${TOOTH_SL[status]}`, 'success');
}

export function saveToothData(pid, num) { toast(`Dent ${num} enregistrée`, 'success'); }

function buildFaceView(pid) {
  const p = getPatient(parseInt(pid)); if (!p) return;
  const teeth = p.teeth;
  const fs = document.getElementById(`fsvg-${pid}`); if (!fs) return;
  const allT = { ...Object.fromEntries([...upper, ...lower].map(n => [n, 'healthy'])), ...teeth };

  const defs = svgE('defs', {});
  const cu = svgE('clipPath', { id: `fcu-${pid}` }); cu.appendChild(svgE('path', { d: 'M95,145 Q220,137 350,135 Q480,137 605,145 L605,168 Q480,173 350,174 Q220,173 95,168Z' })); defs.appendChild(cu);
  const cl = svgE('clipPath', { id: `fcl-${pid}` }); cl.appendChild(svgE('path', { d: 'M95,168 Q220,173 350,174 Q480,173 605,168 L605,190 Q480,198 350,200 Q220,198 95,190Z' })); defs.appendChild(cl);
  fs.appendChild(defs);
  fs.appendChild(svgE('rect', { x: '90', y: '150', width: '520', height: '46', rx: '23', fill: '#07090d' }));
  fs.appendChild(svgE('path', { d: 'M90,162 Q160,136 280,130 Q350,127 420,130 Q540,136 610,162 Q570,152 490,148 Q420,145 350,144 Q280,145 210,148 Q130,152 90,162Z', fill: '#1c1018', stroke: '#2e1a22', 'stroke-width': '1.2' }));
  fs.appendChild(svgE('path', { d: 'M90,162 Q160,190 280,198 Q350,202 420,198 Q540,190 610,162 Q570,176 490,184 Q420,190 350,192 Q280,190 210,184 Q130,176 90,162Z', fill: '#1a1018', stroke: '#2e1a22', 'stroke-width': '1.2' }));
  fs.appendChild(svgE('path', { d: 'M90,162 Q220,167 350,168 Q480,167 610,162', fill: 'none', stroke: '#3d1f2b', 'stroke-width': '1.5' }));
  fs.appendChild(svgE('path', { d: 'M95,157 Q220,149 350,147 Q480,149 605,157 Q480,154 350,152 Q220,154 95,157Z', fill: '#3d1824', 'clip-path': `url(#fcu-${pid})` }));
  fs.appendChild(svgE('path', { d: 'M95,174 Q220,180 350,182 Q480,180 605,174 Q480,178 350,180 Q220,178 95,174Z', fill: '#1a1830', 'clip-path': `url(#fcl-${pid})` }));
  fs.appendChild(svgE('line', { x1: '278', y1: '135', x2: '278', y2: '202', stroke: '#2e3550', 'stroke-width': '1', 'stroke-dasharray': '4,3' }));

  const uF = [{ n: 15, cx: 152, cy: 158, w: 22, h: 25, v: .35 }, { n: 14, cx: 180, cy: 156, w: 24, h: 29, v: .6 }, { n: 13, cx: 210, cy: 153, w: 20, h: 33, v: .82 }, { n: 12, cx: 238, cy: 151, w: 18, h: 36, v: .93 }, { n: 11, cx: 263, cy: 150, w: 22, h: 38, v: 1 }, { n: 21, cx: 291, cy: 150, w: 22, h: 38, v: 1 }, { n: 22, cx: 317, cy: 151, w: 18, h: 36, v: .93 }, { n: 23, cx: 345, cy: 153, w: 20, h: 33, v: .82 }, { n: 24, cx: 375, cy: 155, w: 24, h: 30, v: .62 }, { n: 25, cx: 405, cy: 157, w: 22, h: 26, v: .38 }];
  const lF = [{ n: 45, cx: 158, cy: 177, w: 20, h: 24, v: .3 }, { n: 44, cx: 185, cy: 175, w: 22, h: 27, v: .55 }, { n: 43, cx: 213, cy: 174, w: 18, h: 30, v: .78 }, { n: 42, cx: 239, cy: 173, w: 16, h: 32, v: .9 }, { n: 41, cx: 263, cy: 173, w: 18, h: 34, v: .95 }, { n: 31, cx: 289, cy: 173, w: 18, h: 34, v: .95 }, { n: 32, cx: 314, cy: 173, w: 16, h: 32, v: .9 }, { n: 33, cx: 340, cy: 174, w: 18, h: 30, v: .78 }, { n: 34, cx: 368, cy: 175, w: 22, h: 27, v: .55 }, { n: 35, cx: 396, cy: 177, w: 20, h: 24, v: .3 }];

  function drawFaceTeeth(arr, clipId, isLow) {
    const g = svgE('g', { 'clip-path': `url(#${clipId})` });
    arr.forEach(({ n, cx, cy, w, h, v }) => {
      const st = allT[n] || 'healthy'; const col = TOOTH_SC[st]; const op = st === 'absent' ? .1 : v;
      const th = Math.round(h * op * .72 + 7); const ty = cy + (isLow ? 1 : -1);
      const gg = svgE('g', { class: 'tooth-group', 'data-tooth': n, opacity: op });
      gg.appendChild(svgE('ellipse', { cx, cy: ty + th / 2 + 2, rx: w * .36, ry: 3, fill: 'rgba(0,0,0,.35)' }));
      const rx = w * .22;
      const body = svgE('rect', { x: cx - w / 2 + 1, y: ty - th / 2, width: w - 2, height: th, rx, ry: rx * .8, fill: col, id: `tff-${pid}-${n}${isLow ? 'l' : ''}` });
      gg.appendChild(body);
      gg.appendChild(svgE('rect', { x: cx - w / 2 + 3, y: ty - th / 2 + 3, width: w * .27, height: th * .36, rx: '2', fill: 'rgba(255,255,255,.12)' }));
      if (st === 'crown') { gg.appendChild(svgE('rect', { x: cx - w / 2, y: ty - th / 2 - 1, width: w, height: th + 2, rx: rx + 1, ry: rx * .8 + 1, fill: 'none', stroke: '#00e5ff', 'stroke-width': '1.5', opacity: '.65' })); }
      if (st === 'caries') { gg.appendChild(svgE('circle', { cx: cx + 2, cy: ty - th / 2 + 5, r: '3', fill: '#ff4d6d', opacity: '.9' })); }
      if (st === 'devitalized') { gg.appendChild(svgE('line', { x1: cx - 3, y1: ty - th / 2 + 4, x2: cx + 3, y2: ty - th / 2 + 10, stroke: '#9f7aea', 'stroke-width': '1.5' })); gg.appendChild(svgE('line', { x1: cx + 3, y1: ty - th / 2 + 4, x2: cx - 3, y2: ty - th / 2 + 10, stroke: '#9f7aea', 'stroke-width': '1.5' })); }
      const lbl = svgE('text', { x: cx, y: ty + th / 2 - 3, fill: 'rgba(13,15,20,.8)', 'text-anchor': 'middle', 'font-size': '7', 'font-family': 'DM Mono,monospace', 'font-weight': '500' }); lbl.textContent = n;
      gg.appendChild(lbl); g.appendChild(gg);
      gg.addEventListener('mouseenter', e => showTip(e, `<strong style="color:var(--accent)">${n}</strong> ${TOOTH_NAMES[n] || ''}<br><span style="color:${TOOTH_SC[st]}">${TOOTH_SL[st]}</span>`));
      gg.addEventListener('mousemove', moveTip); gg.addEventListener('mouseleave', hideTip);
      gg.addEventListener('click', () => openToothModal(parseInt(pid), n, allT));
    });
    fs.appendChild(g);
  }
  drawFaceTeeth(uF, `fcu-${pid}`, false);
  drawFaceTeeth(lF, `fcl-${pid}`, true);

  function mkT(x, y, t, c = '#3a4060', s = 8) { const tx = svgE('text', { x, y, 'font-family': 'DM Mono,monospace', 'font-size': s, fill: c, 'text-anchor': 'middle' }); tx.textContent = t; fs.appendChild(tx); }
  mkT(350, 22, 'VUE FRONTALE', '#4b5270', 9);
  mkT(185, 230, 'Q2 — SUP. GAUCHE', '#3a4060', 7.5); mkT(415, 230, 'Q1 — SUP. DROIT', '#3a4060', 7.5);
  mkT(185, 245, 'Q3 — INF. GAUCHE', '#3a4060', 7.5); mkT(415, 245, 'Q4 — INF. DROIT', '#3a4060', 7.5);
  fs.appendChild(svgE('line', { x1: '278', y1: '218', x2: '278', y2: '255', stroke: '#252a38', 'stroke-width': '0.7', 'stroke-dasharray': '3,3' }));
  fs.appendChild(svgE('line', { x1: '100', y1: '236', x2: '500', y2: '236', stroke: '#252a38', 'stroke-width': '0.5' }));
}

function buildParoView(pid) {
  const p = getPatient(parseInt(pid)); if (!p) return;
  if (!PARO_DATA[pid]) initParoForPatient(parseInt(pid), p.teeth);
  const container = document.getElementById(`paro-${pid}`); if (!container) return;
  const allT = { ...Object.fromEntries([...upper, ...lower].map(n => [n, 'healthy'])), ...p.teeth };
  container.innerHTML = '';
  buildParoArcade(pid, upper, false, container, allT);
  const div = document.createElement('div'); div.className = 'paro-divider';
  div.innerHTML = '<div class="paro-div-line"></div><div class="paro-div-label">Sup. / Inf.</div><div class="paro-div-line"></div>';
  container.appendChild(div);
  buildParoArcade(pid, lower, true, container, allT);
  const sum = document.createElement('div'); sum.className = 'paro-summary'; sum.id = `psum-${pid}`;
  container.appendChild(sum); updateParoSum(pid);
}

function buildParoArcade(pid, teeth, isLow, container, allT) {
  const cols = teeth.length, labelW = 78;
  const gs = `display:grid;grid-template-columns:${labelW}px repeat(${cols},1fr);align-items:center;`;
  const t = document.createElement('div'); t.className = 'paro-section-title';
  t.innerHTML = `<div class="bar" style="background:${isLow ? 'var(--info)' : 'var(--accent)'}"></div>${isLow ? 'ARCADE INFÉRIEURE' : 'ARCADE SUPÉRIEURE'}`;
  container.appendChild(t);
  function row(lbl, cells, mb = '2px') {
    const r = document.createElement('div'); r.style.cssText = gs + `margin-bottom:${mb};`;
    const l = document.createElement('div'); l.className = 'paro-row-label'; l.textContent = lbl; r.appendChild(l);
    cells.forEach(c => r.appendChild(c)); container.appendChild(r);
  }
  row('', teeth.map(n => { const c = document.createElement('div'); c.className = 'paro-tooth-num-cell'; c.textContent = n; c.style.color = allT[n] === 'absent' ? '#3a3f52' : 'var(--accent)'; c.onclick = () => { openToothModal(pid, n, allT); }; return c; }), '3px');
  const palLbl = isLow ? 'LINGUAL' : 'PALATAL';
  row(`BOP ${palLbl}`, teeth.map(n => makeBopCell(pid, n, 'palatal', allT)));
  row('RÉCESSION', teeth.map(n => makeRecCell(pid, n, allT)));
  row(`SONDAGE ${palLbl}`, teeth.map(n => makeProbeCell(pid, n, 'palatal', allT)), '1px');
  const gr = document.createElement('div'); gr.style.cssText = gs + 'margin:2px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:2px 0;';
  const gl = document.createElement('div'); gl.className = 'paro-row-label'; gl.style.fontSize = '8px'; gl.textContent = 'GRAPH'; gr.appendChild(gl);
  teeth.forEach(n => {
    const c = document.createElement('div'); c.style.cssText = 'display:flex;justify-content:center;align-items:flex-end;height:36px;gap:1px;padding:1px;';
    if (allT[n] === 'absent') { c.innerHTML = '<div style="width:28px;height:1px;background:var(--border);margin:auto 0 0;"></div>'; gr.appendChild(c); return; }
    const pd = PARO_DATA[pid]?.[n]; if (!pd) { gr.appendChild(c); return; }
    [...pd.palatal, ...pd.buccal].forEach((v, vi) => { const pc = probeColor(v); const b = document.createElement('div'); b.className = 'paro-bar'; b.style.cssText = `background:${pc.color};height:${Math.round((v / 9) * 32)}px;opacity:${vi < 3 ? .55 : 1};`; c.appendChild(b); });
    gr.appendChild(c);
  });
  container.appendChild(gr);
  row('SONDAGE BUCCAL', teeth.map(n => makeProbeCell(pid, n, 'buccal', allT)), '1px');
  row('BOP BUCCAL', teeth.map(n => makeBopCell(pid, n, 'bop_buccal', allT)));
  row('MOBILITÉ', teeth.map(n => makeMobCell(pid, n, allT)), '6px');
}

function makeBopCell(pid, n, side, allT) {
  const c = document.createElement('div'); c.className = 'bop-cell';
  if (allT[n] === 'absent') { c.innerHTML = '<span style="color:#3a3f52;font-size:9px">—</span>'; return c; }
  const pd = PARO_DATA[pid]?.[n]; if (!pd) { return c; }
  const key = side === 'palatal' ? 'bop_palatal' : 'bop_buccal';
  const arr = pd[key] || [false, false, false];
  arr.forEach((v, i) => {
    const d = document.createElement('div'); d.className = 'bop-dot ' + (v ? 'positive' : 'negative');
    d.onclick = () => { if (PARO_DATA[pid]?.[n]) { PARO_DATA[pid][n][key][i] = !PARO_DATA[pid][n][key][i]; d.className = 'bop-dot ' + (PARO_DATA[pid][n][key][i] ? 'positive' : 'negative'); updateParoSum(pid); } };
    c.appendChild(d);
  }); return c;
}

function makeRecCell(pid, n, allT) {
  const c = document.createElement('div'); c.className = 'recession-cell';
  if (allT[n] === 'absent') { c.innerHTML = '<span style="color:#3a3f52;font-size:9px">—</span>'; return c; }
  const pd = PARO_DATA[pid]?.[n]; if (!pd) return c;
  pd.recession.forEach(v => { const d = document.createElement('div'); d.className = 'recession-val'; d.textContent = v; c.appendChild(d); }); return c;
}

function makeProbeCell(pid, n, side, allT) {
  const c = document.createElement('div'); c.className = 'paro-probe-cell';
  if (allT[n] === 'absent') { c.innerHTML = '<span style="color:#3a3f52;font-size:9px">—</span>'; return c; }
  const pd = PARO_DATA[pid]?.[n]; if (!pd) return c;
  const arr = pd[side] || [2, 2, 2];
  arr.forEach((v, i) => {
    const pc = probeColor(v); const d = document.createElement('div'); d.className = 'probe-val'; d.textContent = v;
    d.style.cssText = `background:${pc.bg};color:${pc.color};border-color:${pc.color}33;`;
    d.onclick = () => {
      if (d.querySelector('input')) return;
      const inp = document.createElement('input'); inp.type = 'number'; inp.min = 1; inp.max = 9; inp.value = v; inp.className = 'probe-edit';
      d.textContent = ''; d.appendChild(inp); inp.focus(); inp.select();
      const commit = () => { const nv = Math.max(1, Math.min(9, parseInt(inp.value) || v)); if (PARO_DATA[pid]?.[n]) { PARO_DATA[pid][n][side][i] = nv; } const pc2 = probeColor(nv); d.textContent = nv; d.style.cssText = `background:${pc2.bg};color:${pc2.color};border-color:${pc2.color}33;`; updateParoSum(pid); };
      inp.onblur = commit; inp.onkeydown = e => { if (e.key === 'Enter') commit(); };
    };
    c.appendChild(d);
  }); return c;
}

function makeMobCell(pid, n, allT) {
  const c = document.createElement('div'); c.className = 'mobility-cell';
  if (allT[n] === 'absent') { c.innerHTML = '<span style="color:#3a3f52;font-size:9px">—</span>'; return c; }
  const pd = PARO_DATA[pid]?.[n]; if (!pd) return c;
  const sel = document.createElement('select'); sel.className = 'mobility-select';
  [0, 1, 2, 3].forEach(v => { const o = document.createElement('option'); o.value = v; o.textContent = v; if (v === (pd.mobility || 0)) o.selected = true; sel.appendChild(o); });
  sel.onchange = e => { if (PARO_DATA[pid]?.[n]) PARO_DATA[pid][n].mobility = parseInt(e.target.value); };
  c.appendChild(sel); return c;
}

function updateParoSum(pid) {
  const s = document.getElementById(`psum-${pid}`); if (!s) return;
  let total = 0, bop = 0, deep = 0, mx = 0;
  [...upper, ...lower].forEach(n => {
    const pd = PARO_DATA[pid]?.[n]; if (!pd) return;
    const p = getPatient(parseInt(pid));
    if ((p?.teeth[n] || 'healthy') === 'absent') return;
    [...pd.buccal, ...pd.palatal].forEach(v => { total++; if (v >= 4) deep++; if (v > mx) mx = v; });
    [...(pd.bop_buccal || []), ...(pd.bop_palatal || [])].forEach(b => { if (b) bop++; });
  });
  const bopPct = total > 0 ? Math.round((bop / total) * 100) : 0;
  const bc = bopPct < 15 ? 'var(--accent)' : bopPct < 30 ? 'var(--warn)' : 'var(--danger)';
  const dc = deep < 5 ? 'var(--accent)' : deep < 15 ? 'var(--warn)' : 'var(--danger)';
  s.innerHTML = `<div class="paro-sum-item"><div class="paro-sum-val" style="color:var(--accent)">${total}</div><div class="paro-sum-label">SITES</div></div><div class="paro-sum-item"><div class="paro-sum-val" style="color:${bc}">${bopPct}%</div><div class="paro-sum-label">BOP</div></div><div class="paro-sum-item"><div class="paro-sum-val" style="color:${dc}">${deep}</div><div class="paro-sum-label">POCHES ≥4mm</div></div><div class="paro-sum-item"><div class="paro-sum-val" style="color:var(--danger)">${mx}mm</div><div class="paro-sum-label">MAX</div></div>`;
}

function initParoForPatient(pid, teeth) {
  PARO_DATA[pid] = {};
  function rp(base) { return [0, 1, 2].map(() => Math.max(1, Math.min(9, base + Math.round((Math.random() - .5) * 2.5)))); }
  [...upper, ...lower].forEach(n => {
    const st = teeth[n] || 'healthy', abs = st === 'absent', car = st === 'caries', b = car ? 5 : 2;
    PARO_DATA[pid][n] = {
      buccal: abs ? [0, 0, 0] : rp(b), palatal: abs ? [0, 0, 0] : rp(b),
      bop_buccal: abs ? [false, false, false] : [Math.random() > .7, Math.random() > .78, Math.random() > .75],
      bop_palatal: abs ? [false, false, false] : [Math.random() > .72, Math.random() > .82, Math.random() > .8],
      recession: abs ? [0, 0, 0] : [Math.round(Math.random() * 2), Math.round(Math.random() * 1.5), Math.round(Math.random() * 2)],
      mobility: abs ? 0 : car ? 1 : 0,
    };
  });
}

// Global exposure for inline handlers
window.switchChartView = switchChartView;
window.openToothModal = openToothModal;
window.setToothStatus = setToothStatus;
window.saveToothData = saveToothData;