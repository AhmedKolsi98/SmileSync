// ══════════════════════════════════════════════════════════
// AGENDA
// ══════════════════════════════════════════════════════════
import { APPOINTMENTS, PATIENTS, TYPE_LABELS, TYPE_CLASSES, STATUS_LABELS_RDV, STATUS_COLORS_RDV } from './data.js';    
function renderAgenda() {
  const container = $('page-agenda');
  container.innerHTML = '';

  const hdr = el('div', 'page-header');
  hdr.innerHTML = `<div><div class="page-header-title">Agenda</div><div class="page-header-sub">Gestion des rendez-vous</div></div>
  <div style="display:flex;gap:8px;">
    <div class="cal-view-toggle">
      <button class="cal-view-btn ${APP.calView === 'monthly' ? 'active' : ''}" onclick="setCalView('monthly',this)">Mensuelle</button>
      <button class="cal-view-btn ${APP.calView === 'weekly' ? 'active' : ''}" onclick="setCalView('weekly',this)">Hebdomadaire</button>
    </div>
    <button class="btn btn-accent" onclick="openAppointmentModal()">+ Nouveau RDV</button>
  </div>`;
  container.appendChild(hdr);

  const calCard = el('div', 'card');
  // Nav
  const nav = el('div', 'cal-header');
  const mn = el('div', 'cal-nav');
  const prevBtn = el('button', 'btn btn-outline btn-sm'); prevBtn.textContent = '←'; prevBtn.onclick = () => { calNavigate(-1); };
  const nextBtn = el('button', 'btn btn-outline btn-sm'); nextBtn.textContent = '→'; nextBtn.onclick = () => { calNavigate(1); };
  const todayBtn = el('button', 'btn btn-outline btn-sm'); todayBtn.textContent = "Auj."; todayBtn.onclick = () => { APP.calDate = new Date(APP.today); APP.calDate.setDate(1); renderCalBody(calBody); };
  mn.appendChild(prevBtn); mn.appendChild(nextBtn); mn.appendChild(todayBtn);
  const mLabel = el('div', 'cal-month-label', '');
  nav.appendChild(mn); nav.appendChild(mLabel);
  calCard.appendChild(nav);

  const calBody = el('div', '');
  calCard.appendChild(calBody);
  container.appendChild(calCard);

  // Upcoming appointments
  const upCard = el('div', 'card');
  upCard.innerHTML = `<div class="card-title"><div class="card-title-dot"></div>Prochains rendez-vous</div>`;
  const upcoming = APPOINTMENTS.filter(a => a.date >= todayStr() && a.status !== 'cancelled').sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)).slice(0, 10);
  const tbl = el('div', 'table-wrap');
  tbl.innerHTML = `<table><thead><tr><th>Date & Heure</th><th>Patient</th><th>Type</th><th>Durée</th><th>Statut</th><th>Actions</th></tr></thead><tbody>
  ${upcoming.map(a => `<tr onclick="openAppointmentModal(${JSON.stringify(a).replace(/"/g, '"')})">
    <td>${formatDate(a.date)} <strong>${a.time}</strong></td>
    <td><div style="display:flex;align-items:center;gap:8px;"><div class="avatar avatar-sm" style="background:${avatarColor(getPatient(a.patientId)?.nom || '')};">${initials(getPatient(a.patientId) || { prenom: '?', nom: '?' })}</div>${getPatientName(a.patientId)}</div></td>
    <td><span class="badge ${TYPE_CLASSES[a.type]}">${TYPE_LABELS[a.type]}</span></td>
    <td>${a.duration}min</td>
    <td><span class="badge ${STATUS_COLORS_RDV[a.status]}">${STATUS_LABELS_RDV[a.status]}</span></td>
    <td><button class="btn btn-icon" onclick="event.stopPropagation();openAppointmentModal(${JSON.stringify(a).replace(/"/g, '"')})">✎</button></td>
  </tr>`).join('')}
  </tbody></table>`;
  upCard.appendChild(tbl);
  container.appendChild(upCard);

  renderCalBody(calBody);
}

function setCalView(v, btn) {
  APP.calView = v;
  btn.closest('.cal-view-toggle').querySelectorAll('.cal-view-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const calBody = $('page-agenda').querySelector('.cal-header+div');
  if (calBody) renderCalBody(calBody);
}
function calNavigate(dir) {
  if (APP.calView === 'monthly') { APP.calDate.setMonth(APP.calDate.getMonth() + dir); }
  else { APP.calDate.setDate(APP.calDate.getDate() + dir * 7); }
  const calBody = $('page-agenda').querySelector('.cal-header+div');
  if (calBody) renderCalBody(calBody);
}

function renderCalBody(container) {
  container.innerHTML = '';
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  // Update label
  const mLabel = $('page-agenda').querySelector('.cal-month-label');
  if (mLabel) mLabel.textContent = APP.calView === 'monthly' ? `${monthNames[APP.calDate.getMonth()]} ${APP.calDate.getFullYear()}` : `Semaine du ${formatDate(getWeekStart())}`;

  if (APP.calView === 'monthly') { renderMonthly(container); }
  else { renderWeekly(container); }
}

function renderMonthly(container) {
  const y = APP.calDate.getFullYear(), m = APP.calDate.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const wrap = el('div', 'cal-monthly');
  const dh = el('div', 'cal-days-header');
  dayNames.forEach(d => { const e = el('div', 'cal-day-name'); e.textContent = d; dh.appendChild(e); });
  wrap.appendChild(dh);
  const grid = el('div', 'cal-grid');
  const startOffset = firstDay;
  const prevDays = new Date(y, m, 0).getDate();
  for (let i = startOffset - 1; i >= 0; i--) {
    const cell = el('div', 'cal-cell other-month');
    cell.innerHTML = `<div class="cal-date">${prevDays - i}</div>`;
    grid.appendChild(cell);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = dateStr === todayStr();
    const cell = el('div', `cal-cell${isToday ? ' today' : ''}`);
    cell.innerHTML = `<div class="cal-date">${d}</div>`;
    const dayAppts = APPOINTMENTS.filter(a => a.date === dateStr).sort((a, b) => a.time.localeCompare(b.time));
    dayAppts.slice(0, 3).forEach(a => {
      const ev = el('div', `cal-event ${TYPE_CLASSES[a.type]}`);
      ev.textContent = `${a.time} ${getPatientName(a.patientId).split(' ')[0]}`;
      ev.addEventListener('click', e => { e.stopPropagation(); openAppointmentModal(a); });
      cell.appendChild(ev);
    });
    if (dayAppts.length > 3) { const m = el('div', ''); m.style.cssText = 'font-size:9px;color:var(--text3);'; m.textContent = `+${dayAppts.length - 3} autres`; cell.appendChild(m); }
    cell.addEventListener('click', () => { APP.calDate = new Date(y, m, d); openAppointmentModal(null); });
    grid.appendChild(cell);
  }
  const remaining = (7 - ((startOffset + daysInMonth) % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const cell = el('div', 'cal-cell other-month');
    cell.innerHTML = `<div class="cal-date">${d}</div>`;
    grid.appendChild(cell);
  }
  wrap.appendChild(grid);
  container.appendChild(wrap);
}

function getWeekStart() {
  const d = new Date(APP.calDate);
  const day = d.getDay();
  d.setDate(d.getDate() - day + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function renderWeekly(container) {
  const ws = new Date(getWeekStart());
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const wrap = el('div', 'cal-weekly');
  const header = el('div', 'week-header');
  header.appendChild(el('div', ''));
  for (let i = 0; i < 7; i++) {
    const d = new Date(ws); d.setDate(d.getDate() + i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const isToday = dateStr === todayStr();
    const lbl = el('div', `week-day-label${isToday ? ' today-col' : ''}`);
    lbl.innerHTML = `<div class="wdl-name">${dayNames[i]}</div><div class="wdl-num">${d.getDate()}</div>`;
    header.appendChild(lbl);
  }
  wrap.appendChild(header);
  const body = el('div', 'week-body');
  const timeCol = el('div', 'week-time-col');
  for (let h = 8; h <= 19; h++) { const s = el('div', 'week-time-slot'); s.textContent = `${h}:00`; timeCol.appendChild(s); }
  body.appendChild(timeCol);
  for (let i = 0; i < 7; i++) {
    const d = new Date(ws); d.setDate(d.getDate() + i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const isToday = dateStr === todayStr();
    const col = el('div', `week-day-col${isToday ? ' today-col' : ''}`);
    for (let h = 0; h < 12; h++) { const s = el('div', 'week-slot'); s.dataset.hour = h + 8; s.dataset.date = dateStr; s.onclick = () => { APP.calDate = d; openAppointmentModal(null, null, `${h + 8}:00`); }; col.appendChild(s); }
    const dayAppts = APPOINTMENTS.filter(a => a.date === dateStr);
    dayAppts.forEach(a => {
      const [ah, am] = a.time.split(':').map(Number);
      const top = ((ah - 8) + am / 60) * 48;
      const height = Math.max(a.duration / 60 * 48, 22);
      const apptEl = el('div', `week-appt ${TYPE_CLASSES[a.type]}`);
      apptEl.style.cssText = `top:${top}px;height:${height}px;`;
      apptEl.innerHTML = `<div style="font-weight:600;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">${a.time} ${getPatientName(a.patientId).split(' ')[0]}</div><div style="opacity:.8;font-size:9px;">${TYPE_LABELS[a.type]}</div>`;
      apptEl.addEventListener('click', e => { e.stopPropagation(); openAppointmentModal(a); });
      col.appendChild(apptEl);
    });
    body.appendChild(col);
  }
  wrap.appendChild(body);
  container.appendChild(wrap);
}

// ── Appointment Modal ──
function openAppointmentModal(appt = null, patientId = null, time = null) {
  const modal = $('modal-appointment');
  const isEdit = !!appt;
  const defaultDate = APP.calDate ? `${APP.calDate.getFullYear()}-${String(APP.calDate.getMonth() + 1).padStart(2, '0')}-${String(APP.calDate.getDate()).padStart(2, '0')}` : todayStr();
  modal.innerHTML = `
  <div class="modal modal-md">
    <div class="modal-header">
      <div class="modal-title">${isEdit ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}</div>
      <button class="modal-close" onclick="closeModal('modal-appointment')">✕</button>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label class="form-label">Patient</label>
        <select class="form-select" id="appt-patient">
          <option value="">— Sélectionner —</option>
          ${PATIENTS.map(p => `<option value="${p.id}" ${(appt?.patientId || patientId) === p.id ? 'selected' : ''}>${p.prenom} ${p.nom}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label class="form-label">Type</label>
        <select class="form-select" id="appt-type">
          ${Object.entries(TYPE_LABELS).map(([k, v]) => `<option value="${k}" ${appt?.type === k ? 'selected' : ''}>${v}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-row form-row-3">
      <div class="form-group"><label class="form-label">Date</label><input class="form-input" type="date" id="appt-date" value="${appt?.date || defaultDate}"></div>
      <div class="form-group"><label class="form-label">Heure</label><input class="form-input" type="time" id="appt-time" value="${appt?.time || time || '09:00'}"></div>
      <div class="form-group"><label class="form-label">Durée (min)</label>
        <select class="form-select" id="appt-duration">
          ${[15, 30, 45, 60, 90, 120].map(d => `<option ${(appt?.duration || 30) === d ? 'selected' : ''}>${d}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-group" style="margin-bottom:12px;"><label class="form-label">Statut</label>
      <select class="form-select" id="appt-status">
        <option value="confirmed" ${appt?.status === 'confirmed' ? 'selected' : ''}>Confirmé</option>
        <option value="waiting" ${appt?.status === 'waiting' ? 'selected' : ''}>En attente</option>
        <option value="cancelled" ${appt?.status === 'cancelled' ? 'selected' : ''}>Annulé</option>
      </select>
    </div>
    <div class="form-group" style="margin-bottom:0;"><label class="form-label">Notes</label><textarea class="form-textarea" id="appt-notes">${appt?.notes || ''}</textarea></div>
    <div class="modal-footer">
      ${isEdit ? `<button class="btn btn-danger" style="margin-right:auto" onclick="deleteAppointment(${appt.id})">Supprimer</button>` : ''}
      <button class="btn btn-outline" onclick="closeModal('modal-appointment')">Annuler</button>
      <button class="btn btn-accent" onclick="saveAppointment(${isEdit ? appt.id : 'null'})">${isEdit ? 'Enregistrer' : 'Créer'}</button>
    </div>
  </div>`;
  modal.classList.add('open');
}

function saveAppointment(id) {
  const pid = parseInt($('appt-patient').value);
  if (!pid) { toast('Veuillez sélectionner un patient', 'error'); return; }
  const apptData = {
    patientId: pid, date: $('appt-date').value, time: $('appt-time').value,
    type: $('appt-type').value, duration: parseInt($('appt-duration').value),
    status: $('appt-status').value, notes: $('appt-notes').value, dentiste: 'Dr. Benali',
  };
  if (id) { const a = APPOINTMENTS.find(x => x.id === id); if (a) Object.assign(a, apptData); toast('Rendez-vous modifié', 'success'); }
  else { APPOINTMENTS.push({ id: APPOINTMENTS.length + 1, ...apptData }); toast('Rendez-vous créé', 'success'); }
  closeModal('modal-appointment'); renderAgenda(); renderDashboard();
}

function deleteAppointment(id) {
  const idx = APPOINTMENTS.findIndex(a => a.id === id);
  if (idx > -1) { APPOINTMENTS.splice(idx, 1); toast('Rendez-vous supprimé', 'info'); }
  closeModal('modal-appointment'); renderAgenda(); renderDashboard();
}
