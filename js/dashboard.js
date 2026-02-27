// Dashboard Module
import { APP, TYPE_LABELS, TYPE_CLASSES, STATUS_LABELS_RDV, STATUS_COLORS_RDV } from './config.js';
import { PATIENTS, APPOINTMENTS, ORDONNANCES } from './data.js';
import { $, el, getPatient,todayStr } from './utils.js';
import { openAppointmentModal } from './agenda.js';

export function renderDashboard() {
  const todayAppts = APPOINTMENTS.filter(a => a.date === todayStr());
  const thisMonthAppts = APPOINTMENTS.filter(a => a.date.startsWith('2025-06'));
  const container = $('page-dashboard');
  container.innerHTML = '';

  const hdr = el('div', 'page-header');
  hdr.innerHTML = `<div><div class="page-header-title">Bonjour, ${APP.user} 👋</div><div class="page-header-sub">Mercredi 18 juin 2025 — ${todayAppts.length} rendez-vous aujourd'hui</div></div>
  <button class="btn btn-accent" onclick="openAppointmentModal()">+ Nouveau RDV</button>`;
  container.appendChild(hdr);

  const kgrid = el('div', 'kpi-grid');
  const kpis = [
    { val: PATIENTS.length, label: 'Patients total', color: 'var(--accent)', pct: 100, trend: '+2 ce mois' },
    { val: todayAppts.length, label: "RDV aujourd'hui", color: 'var(--cyan)', pct: (todayAppts.length / 8) * 100, trend: `${todayAppts.filter(a => a.status === 'confirmed').length} confirmés` },
    { val: thisMonthAppts.length, label: 'RDV ce mois', color: 'var(--purple)', pct: 70, trend: '↑ 12% vs mois dernier' },
    { val: ORDONNANCES.length, label: 'Ordonnances', color: 'var(--warn)', pct: 40, trend: 'Ce mois' },
  ];
  kpis.forEach(k => {
    const c = el('div', 'kpi');
    c.innerHTML = `<div class="kpi-val" style="color:${k.color}">${k.val}</div><div class="kpi-label">${k.label}</div><div class="kpi-trend" style="color:${k.color};opacity:.7"><span>↗</span> ${k.trend}</div><div class="kpi-bar"><div class="kpi-bar-fill" style="width:${k.pct}%;background:${k.color};opacity:.7;"></div></div>`;
    c.style.cssText += `--c:${k.color};`;
    kgrid.appendChild(c);
  });
  container.appendChild(kgrid);

  const grid = el('div', 'dashboard-grid');

  const agCard = el('div', 'card');
  agCard.innerHTML = `<div class="card-title"><div class="card-title-dot"></div>Agenda du jour <span style="color:var(--text3);font-weight:400;font-size:11px;margin-left:4px;">${todayAppts.length} RDV</span></div>`;
  const agList = el('div', 'agenda-list');
  if (todayAppts.length === 0) {
    agList.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🗓️</div><h3>Aucun rendez-vous</h3><p>Journée libre</p></div>';
  } else {
    todayAppts.sort((a, b) => a.time.localeCompare(b.time)).forEach(appt => {
      const p = getPatient(appt.patientId);
      if (!p) return;
      const item = el('div', 'agenda-item');
      item.innerHTML = `
        <div class="agenda-dot" style="background:var(--${appt.type === 'checkup' ? 'accent' : appt.type === 'caries' ? 'danger' : appt.type === 'detartrage' ? 'cyan' : appt.type === 'extraction' ? 'warn' : appt.type === 'implant' ? 'info' : appt.type === 'orthodontie' ? 'purple' : 'pink'})"></div>
        <div class="agenda-time">${appt.time}</div>
        <div class="agenda-info">
          <div class="agenda-patient">${p.prenom} ${p.nom}</div>
          <div class="agenda-type">${TYPE_LABELS[appt.type]} · ${appt.duration}min</div>
        </div>
        <span class="badge ${STATUS_COLORS_RDV[appt.status]}">${STATUS_LABELS_RDV[appt.status]}</span>`;
      item.addEventListener('click', () => openAppointmentModal(appt));
      agList.appendChild(item);
    });
  }
  agCard.appendChild(agList);

  const rightCol = el('div', '');
  rightCol.style.cssText = 'display:flex;flex-direction:column;gap:14px;';

  const alertCard = el('div', 'card-sm');
  alertCard.innerHTML = `<div class="card-title"><div class="card-title-dot" style="background:var(--danger);box-shadow:0 0 6px var(--danger);"></div>Alertes médicales</div>`;
  const alertList = el('div', 'alert-list');
  const alerts = [
    { icon: '⚠️', color: 'rgba(255,77,109,.08)', title: 'Allergie — Amoxicilline', sub: 'Jalel Derbel' },
    { icon: '💊', color: 'rgba(255,184,48,.08)', title: 'Anticoagulants actifs', sub: 'Mohamed Trabelsi (INR à vérifier)' },
    { icon: '🦴', color: 'rgba(159,122,234,.08)', title: 'Bisphosphonates', sub: 'Rami Chaabane — Risque ostéonécrose' },
    { icon: '🩺', color: 'rgba(77,159,255,.08)', title: 'Dialyse x3/semaine', sub: 'Hedi Bouaziz — Adapter RDV' },
  ];
  alerts.forEach(a => {
    const item = el('div', 'alert-item');
    item.style.background = a.color;
    item.style.borderRadius = 'var(--r1)';
    item.innerHTML = `<span class="alert-icon">${a.icon}</span><div><div style="font-size:11px;font-weight:500;color:var(--text)">${a.title}</div><div style="font-size:10px;color:var(--text3)">${a.sub}</div></div>`;
    alertList.appendChild(item);
  });
  alertCard.appendChild(alertList);

  const statsCard = el('div', 'card-sm');
  statsCard.innerHTML = `<div class="card-title"><div class="card-title-dot" style="background:var(--cyan);box-shadow:0 0 6px var(--cyan);"></div>Répartition RDV</div>`;
  const types = Object.entries(TYPE_LABELS);
  const byType = {};
  thisMonthAppts.forEach(a => { byType[a.type] = (byType[a.type] || 0) + 1; });
  const totalMonth = thisMonthAppts.length;
  const statsHtml = types.map(([k, v]) => {
    const cnt = byType[k] || 0;
    if (!cnt) return '';
    const pct = Math.round((cnt / totalMonth) * 100);
    const typeClass = TYPE_CLASSES[k];
    return `<div style="margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:3px;"><span style="font-size:10px;color:var(--text2)">${v}</span><span style="font-size:10px;color:var(--text3)">${cnt} (${pct}%)</span></div>
      <div style="height:4px;background:var(--border);border-radius:2px;overflow:hidden;"><div style="height:100%;width:${pct}%;border-radius:2px;" class="${typeClass}"></div></div>
    </div>`;
  }).join('');
  statsCard.innerHTML += statsHtml;
  rightCol.appendChild(alertCard);
  rightCol.appendChild(statsCard);

  grid.appendChild(agCard);
  grid.appendChild(rightCol);
  container.appendChild(grid);
}