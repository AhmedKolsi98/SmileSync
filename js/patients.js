// Patients Module
import { APP, TYPE_LABELS, STATUS_LABELS_RDV, STATUS_COLORS_RDV, upper, lower } from './config.js';
import { PATIENTS, APPOINTMENTS, ORDONNANCES, TREATMENTS, PARO_DATA } from './data.js';
import { $, el, getPatient, avatarColor, initials, formatDate, todayStr, toast, closeModal } from './utils.js';
import { renderDentalChartHTML, initDentalChart } from './dental.js';

export function renderPatients(filter = '') {
  const container = $('page-patients');
  container.innerHTML = '';

  const hdr = el('div', 'page-header');
  hdr.innerHTML = `<div><div class="page-header-title">Patients <span style="font-size:14px;color:var(--text3);font-weight:400;">(${PATIENTS.length})</span></div><div class="page-header-sub">Base de données des patients du cabinet</div></div>
  <button class="btn btn-accent" onclick="openPatientForm()">+ Nouveau patient</button>`;
  container.appendChild(hdr);

  const search = el('div', 'search-bar');
  search.innerHTML = `<span style="color:var(--text3);font-size:14px;">⌕</span><input placeholder="Rechercher par nom, téléphone..." id="patient-search-input" value="${filter}" oninput="window.renderPatientsWithFilter(this.value)">`;
  container.appendChild(search);

  const filters = el('div', '');
  filters.style.cssText = 'display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap;';
  ['Tous', 'Avec allergies', 'RDV aujourd\'hui', 'Récents'].forEach((f, i) => {
    const b = el('button', `chip${i === 0 ? ' active' : ''}`);
    b.textContent = f;
    filters.appendChild(b);
  });
  container.appendChild(filters);

  const filtered = PATIENTS.filter(p => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (p.nom + ' ' + p.prenom).toLowerCase().includes(q) || p.tel.includes(q);
  });

  if (filtered.length === 0) {
    container.innerHTML += '<div class="empty-state"><div class="empty-state-icon">🔍</div><h3>Aucun résultat</h3><p>Aucun patient trouvé pour "' + filter + '"</p></div>';
    return;
  }

  const grid = el('div', 'patient-grid');
  filtered.forEach(p => {
    const ac = avatarColor(p.nom);
    const todayRdv = APPOINTMENTS.find(a => a.patientId === p.id && a.date === todayStr());
    const card = el('div', 'patient-card');
    card.innerHTML = `
      <div class="pc-top">
        <div class="avatar avatar-md" style="background:${ac};color:#0b0d12;">${initials(p)}</div>
        <div class="pc-info">
          <h3>${p.prenom} ${p.nom}</h3>
          <p>${p.dob} · ${p.sexe === 'M' ? 'Homme' : 'Femme'}</p>
        </div>
        ${todayRdv ? `<span class="badge badge-green" style="margin-left:auto;">Auj. ${todayRdv.time}</span>` : ''}
      </div>
      <div class="pc-details">
        <div class="pc-detail">📞 <span>${p.tel}</span></div>
        <div class="pc-detail">🩸 <span>${p.groupe}</span></div>
        <div class="pc-detail">📧 <span style="font-size:9px">${p.email}</span></div>
        <div class="pc-detail">🦷 <span>${Object.keys(p.teeth).length} traitements</span></div>
      </div>
      ${p.antecedents.allergies.length ? `<div class="pc-tags"><span class="badge badge-red">⚠️ Allergie: ${p.antecedents.allergies.join(', ')}</span></div>` : ''}
    `;
    card.addEventListener('click', () => openPatientDetail(p.id));
    grid.appendChild(card);
  });
  container.appendChild(grid);
}

export function openPatientDetail(patientId) {
  const p = getPatient(patientId);
  if (!p) return;
  const ac = avatarColor(p.nom);
  const modal = $('modal-patient-detail');

  if (!PARO_DATA[patientId]) {
    initParoForPatient(patientId, p.teeth);
  }

  modal.innerHTML = `
  <div class="modal modal-xl" style="width:min(1000px,95vw);padding:0;overflow:hidden;display:flex;flex-direction:column;max-height:90vh;">
    <div style="padding:24px 28px 0;">
      <div class="modal-header" style="margin-bottom:0;">
        <div class="patient-detail-header" style="margin-bottom:0;">
          <div class="avatar avatar-xl" style="background:${ac};color:#0b0d12;">${initials(p)}</div>
          <div class="pd-info">
            <h2>${p.prenom} ${p.nom}</h2>
            <p>Né(e) le ${p.dob} · ${p.sexe === 'M' ? 'Homme' : 'Femme'} · Groupe sanguin: <strong style="color:var(--danger)">${p.groupe}</strong></p>
            <div class="pd-stats">
              <div class="pd-stat">📞 <span>${p.tel}</span></div>
              <div class="pd-stat" style="margin-left:14px;">📧 <span>${p.email}</span></div>
              ${p.antecedents.allergies.length ? `<div class="pd-stat" style="margin-left:14px;"><span class="badge badge-red">⚠️ ${p.antecedents.allergies.join(', ')}</span></div>` : ''}
            </div>
          </div>
        </div>
        <button class="modal-close" onclick="closeModal('modal-patient-detail')">✕</button>
      </div>
    </div>
    <div style="padding:16px 28px 0;">
      <div class="tabs" id="patient-tabs">
        <button class="tab active" data-tab="antecedents">Antécédents</button>
        <button class="tab" data-tab="chart">Fiche Dentaire</button>
        <button class="tab" data-tab="historique">Historique</button>
        <button class="tab" data-tab="rdv">Rendez-vous</button>
        <button class="tab" data-tab="ordonnances-p">Ordonnances</button>
      </div>
    </div>
    <div style="flex:1;overflow-y:auto;padding:0 28px 24px;" id="patient-tab-body">
      <div class="tab-content active" id="tc-antecedents">${renderAntecedents(p)}</div>
      <div class="tab-content" id="tc-chart">${renderDentalChartHTML(patientId, p.teeth)}</div>
      <div class="tab-content" id="tc-historique">${renderHistorique(patientId)}</div>
      <div class="tab-content" id="tc-rdv">${renderPatientRDV(patientId)}</div>
      <div class="tab-content" id="tc-ordonnances-p">${renderPatientOrd(patientId)}</div>
    </div>
  </div>`;

  modal.classList.add('open');

  modal.querySelectorAll('.tab').forEach(t => {
    t.addEventListener('click', () => {
      modal.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
      modal.querySelectorAll('.tab-content').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      modal.querySelector(`#tc-${t.dataset.tab}`).classList.add('active');
      if (t.dataset.tab === 'chart') {
        setTimeout(() => initDentalChart(patientId, p.teeth), 50);
      }
    });
  });
}

function renderAntecedents(p) {
  return `
  <div style="margin-top:16px;">
    <div class="antecedent-grid">
      <div class="antecedent-card">
        <div class="ant-label">🏥 Antécédents médicaux</div>
        <div class="ant-tags">${p.antecedents.med.length ? p.antecedents.med.map(a => `<span class="badge badge-yellow">${a}</span>`).join('') : '<span style="color:var(--text3);font-size:11px;">Aucun</span>'}</div>
      </div>
      <div class="antecedent-card">
        <div class="ant-label">⚗️ Allergies</div>
        <div class="ant-tags">${p.antecedents.allergies.length ? p.antecedents.allergies.map(a => `<span class="badge badge-red">⚠️ ${a}</span>`).join('') : '<span style="color:var(--text3);font-size:11px;">Aucune allergie connue</span>'}</div>
      </div>
      <div class="antecedent-card">
        <div class="ant-label">🔪 Antécédents chirurgicaux</div>
        <div class="ant-tags">${p.antecedents.chir.length ? p.antecedents.chir.map(a => `<span class="badge badge-blue">${a}</span>`).join('') : '<span style="color:var(--text3);font-size:11px;">Aucun</span>'}</div>
      </div>
      <div class="antecedent-card">
        <div class="ant-label">💉 Anesthésie</div>
        <div style="font-size:11px;color:${p.antecedents.anesthesie ? 'var(--warn)' : 'var(--text3)'}">${p.antecedents.anesthesie || 'Pas de particularité'}</div>
      </div>
    </div>
    ${p.notes ? `<div class="antecedent-card" style="background:rgba(255,184,48,.06);border-color:rgba(255,184,48,.2);">
      <div class="ant-label">📝 Notes cliniques</div>
      <div style="font-size:11px;color:var(--warn);line-height:1.6;">${p.notes}</div>
    </div>` : ''}
  </div>`;
}

function renderHistorique(patientId) {
  const treatments = TREATMENTS[patientId] || [];
  if (!treatments.length) return '<div class="empty-state" style="padding:24px 0;"><div class="empty-state-icon">📋</div><h3>Aucun historique</h3></div>';
  return `<div class="history-timeline" style="margin-top:16px;">
    ${treatments.map(t => `
    <div class="timeline-item">
      <div class="timeline-dot">🦷</div>
      <div class="timeline-content">
        <div class="timeline-header">
          <div class="timeline-title">${t.type}${t.dent ? ` — Dent ${t.dent}` : ''}</div>
          <div class="timeline-date">${t.date}</div>
        </div>
        <div class="timeline-body">${t.desc}</div>
        <div style="font-size:10px;color:var(--text3);margin-top:4px;">${t.dentiste}</div>
      </div>
    </div>`).join('')}
  </div>`;
}

function renderPatientRDV(patientId) {
  const appts = APPOINTMENTS.filter(a => a.patientId === patientId).sort((a, b) => b.date.localeCompare(a.date));
  if (!appts.length) return '<div class="empty-state" style="padding:24px 0;"><div class="empty-state-icon">🗓️</div><h3>Aucun rendez-vous</h3></div>';
  return `<div style="margin-top:16px;">
  <div style="display:flex;justify-content:flex-end;margin-bottom:12px;">
    <button class="btn btn-accent btn-sm" onclick="openAppointmentModal(null,${patientId})">+ Nouveau RDV</button>
  </div>
  ${appts.map(a => `
  <div class="agenda-item" style="margin-bottom:6px;" onclick="openAppointmentModal(${JSON.stringify(a).replace(/"/g, '&quot;')})">
    <div class="agenda-dot" style="background:var(--accent)"></div>
    <div class="agenda-time">${formatDate(a.date)} ${a.time}</div>
    <div class="agenda-info"><div class="agenda-patient">${TYPE_LABELS[a.type]}</div><div class="agenda-type">${a.duration}min · ${a.notes || '—'}</div></div>
    <span class="badge ${STATUS_COLORS_RDV[a.status]}">${STATUS_LABELS_RDV[a.status]}</span>
  </div>`).join('')}
  </div>`;
}

function renderPatientOrd(patientId) {
  const ords = ORDONNANCES.filter(o => o.patientId === patientId).sort((a, b) => b.date.localeCompare(a.date));
  if (!ords.length) return '<div class="empty-state" style="padding:24px 0;"><div class="empty-state-icon">💊</div><h3>Aucune ordonnance</h3></div>';
  const p = getPatient(patientId);
  return `<div style="margin-top:16px;">
  <div style="display:flex;justify-content:flex-end;margin-bottom:12px;">
    ${APP.role === 'dentiste' ? `<button class="btn btn-accent btn-sm" onclick="openOrdonnanceModal(${patientId})">+ Nouvelle ordonnance</button>` : ''}
  </div>
  ${ords.map(o => `
  <div class="ordonnance-card" style="margin-bottom:8px;" onclick="openOrdDetail(${o.id})">
    <div class="ord-header"><div class="ord-patient">Ordonnance du ${o.date}</div><span class="badge badge-blue">${o.medicaments.length} médicament${o.medicaments.length > 1 ? 's' : ''}</span></div>
    <div class="ord-meds">${o.medicaments.map(m => `<div class="ord-med"><strong>${m.nom}</strong> — ${m.posologie} — ${m.duree}</div>`).join('')}</div>
    ${o.notes ? `<div style="font-size:10px;color:var(--text3);margin-top:6px;font-style:italic;">Note: ${o.notes}</div>` : ''}
  </div>`).join('')}
  </div>`;
}

export function openPatientForm(patientId = null) {
  const p = patientId ? getPatient(patientId) : null;
  const modal = $('modal-patient-form');
  modal.innerHTML = `
  <div class="modal modal-md">
    <div class="modal-header">
      <div class="modal-title">${p ? 'Modifier patient' : 'Nouveau patient'}</div>
      <button class="modal-close" onclick="closeModal('modal-patient-form')">✕</button>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label class="form-label">Prénom</label><input class="form-input" id="pf-prenom" value="${p?.prenom || ''}"></div>
      <div class="form-group"><label class="form-label">Nom</label><input class="form-input" id="pf-nom" value="${p?.nom || ''}"></div>
    </div>
    <div class="form-row form-row-3">
      <div class="form-group"><label class="form-label">Date de naissance</label><input class="form-input" id="pf-dob" value="${p?.dob || ''}"></div>
      <div class="form-group"><label class="form-label">Sexe</label><select class="form-select" id="pf-sexe"><option value="M" ${p?.sexe === 'M' ? 'selected' : ''}>Masculin</option><option value="F" ${p?.sexe === 'F' ? 'selected' : ''}>Féminin</option></select></div>
      <div class="form-group"><label class="form-label">Groupe sanguin</label><select class="form-select" id="pf-groupe">${['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => `<option ${p?.groupe === g ? 'selected' : ''}>${g}</option>`).join('')}</select></div>
    </div>
    <div class="form-row form-row-2">
      <div class="form-group"><label class="form-label">Téléphone</label><input class="form-input" id="pf-tel" value="${p?.tel || ''}"></div>
      <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="pf-email" type="email" value="${p?.email || ''}"></div>
    </div>
    <div class="form-group" style="margin-bottom:12px;"><label class="form-label">Allergies (séparées par virgule)</label><input class="form-input" id="pf-allergies" value="${p?.antecedents?.allergies?.join(', ') || ''}"></div>
    <div class="form-group" style="margin-bottom:12px;"><label class="form-label">Antécédents médicaux (séparés par virgule)</label><input class="form-input" id="pf-antmed" value="${p?.antecedents?.med?.join(', ') || ''}"></div>
    <div class="form-group" style="margin-bottom:12px;"><label class="form-label">Notes cliniques</label><textarea class="form-textarea" id="pf-notes">${p?.notes || ''}</textarea></div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal('modal-patient-form')">Annuler</button>
      <button class="btn btn-accent" onclick="savePatient(${p?.id || 'null'})">Enregistrer</button>
    </div>
  </div>`;
  modal.classList.add('open');
}

export function savePatient(id) {
  const prenom = $('pf-prenom').value.trim();
  const nom = $('pf-nom').value.trim();
  if (!prenom || !nom) { toast('Prénom et nom requis', 'error'); return; }
  if (id) {
    const p = getPatient(id);
    p.prenom = prenom; p.nom = nom; p.dob = $('pf-dob').value;
    p.sexe = $('pf-sexe').value; p.groupe = $('pf-groupe').value;
    p.tel = $('pf-tel').value; p.email = $('pf-email').value;
    p.notes = $('pf-notes').value;
    p.antecedents.allergies = $('pf-allergies').value.split(',').map(s => s.trim()).filter(Boolean);
    p.antecedents.med = $('pf-antmed').value.split(',').map(s => s.trim()).filter(Boolean);
    toast('Patient modifié', 'success');
  } else {
    const newP = {
      id: PATIENTS.length + 1,
      prenom, nom, dob: $('pf-dob').value, sexe: $('pf-sexe').value,
      groupe: $('pf-groupe').value, tel: $('pf-tel').value, email: $('pf-email').value,
      notes: $('pf-notes').value, teeth: { 18: 'absent', 28: 'absent', 38: 'absent', 48: 'absent' },
      antecedents: { med: $('pf-antmed').value.split(',').map(s => s.trim()).filter(Boolean), chir: [], allergies: $('pf-allergies').value.split(',').map(s => s.trim()).filter(Boolean), anesthesie: '' }
    };
    PATIENTS.push(newP);
    document.getElementById('nb-patients').textContent = PATIENTS.length;
    toast('Patient créé', 'success');
  }
  closeModal('modal-patient-form');
  renderPatients();
}

function initParoForPatient(pid, teeth) {
  PARO_DATA[pid] = {};
  function rp(base) { return [0, 1, 2].map(() => Math.max(1, Math.min(9, base + Math.round((Math.random() - .5) * 2.5)))); }
  const toothNumbers = [...upper, ...lower];
  toothNumbers.forEach(n => {
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

// Make functions available globally for inline onclick handlers
window.openPatientForm = openPatientForm;
window.savePatient = savePatient;
window.openPatientDetail = openPatientDetail;
window.renderPatientsWithFilter = renderPatients;