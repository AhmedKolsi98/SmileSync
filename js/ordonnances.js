// ══════════════════════════════════════════════════════════
// ORDONNANCES (Prescriptions)
// ══════════════════════════════════════════════════════════

function renderOrdonnances() {
  if (APP.role !== 'dentiste') {
    const container = $('page-ordonnances');
    container.innerHTML = '<div class="empty-state" style="padding:60px 20px;"><div class="empty-state-icon">🔒</div><h3>Accès restreint</h3><p style="margin-top:6px;">Les ordonnances sont réservées au dentiste</p></div>';
    return;
  }
  const container = $('page-ordonnances');
  container.innerHTML = '';
  const hdr = el('div', 'page-header');
  hdr.innerHTML = `<div><div class="page-header-title">Ordonnances <span style="font-size:14px;color:var(--text3);font-weight:400;">(${ORDONNANCES.length})</span></div><div class="page-header-sub">Prescriptions médicales du cabinet</div></div>
  <button class="btn btn-accent" onclick="openOrdonnanceModal()">+ Nouvelle ordonnance</button>`;
  container.appendChild(hdr);

  // Search
  const search = el('div', 'search-bar');
  search.innerHTML = `<span style="color:var(--text3);font-size:14px;">⌕</span><input placeholder="Rechercher par patient...">`;
  container.appendChild(search);

  const grid = el('div', '');
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px;';
  const sortedOrds = [...ORDONNANCES].sort((a, b) => b.date.localeCompare(a.date));
  sortedOrds.forEach(o => {
    const p = getPatient(o.patientId);
    const ac = p ? avatarColor(p.nom) : 'var(--accent)';
    const card = el('div', 'ordonnance-card');
    card.innerHTML = `
      <div class="ord-header">
        <div style="display:flex;align-items:center;gap:8px;">
          ${p ? `<div class="avatar avatar-sm" style="background:${ac};color:#0b0d12;">${initials(p)}</div>` : ''}
          <div class="ord-patient">${p ? `${p.prenom} ${p.nom}` : 'Patient inconnu'}</div>
        </div>
        <div class="ord-date">${o.date}</div>
      </div>
      <div class="ord-meds">${o.medicaments.map(m => `<div class="ord-med"><strong>${m.nom}</strong> — ${m.posologie}</div>`).join('')}</div>
      ${o.notes ? `<div style="font-size:10px;color:var(--text3);margin-top:6px;font-style:italic;">📝 ${o.notes}</div>` : ''}
      <div class="ord-footer">
        <span class="badge badge-blue">${o.medicaments.length} médicament${o.medicaments.length > 1 ? 's' : ''}</span>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-sm btn-outline" onclick="event.stopPropagation();printOrdonnance(${o.id})">🖨 Imprimer</button>
          <button class="btn btn-sm btn-ghost" onclick="event.stopPropagation();openOrdDetail(${o.id})">Voir</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
  container.appendChild(grid);
}

function openOrdonnanceModal(patientId = null) {
  if (APP.role !== 'dentiste') { toast('Accès réservé au dentiste', 'error'); return; }
  const modal = $('modal-ordonnance');
  modal.innerHTML = `
  <div class="modal modal-md">
    <div class="modal-header">
      <div class="modal-title">Nouvelle ordonnance</div>
      <button class="modal-close" onclick="closeModal('modal-ordonnance')">✕</button>
    </div>
    <div class="form-row form-row-2" style="margin-bottom:14px;">
      <div class="form-group"><label class="form-label">Patient</label>
        <select class="form-select" id="ord-patient">
          <option value="">— Sélectionner —</option>
          ${PATIENTS.map(p => `<option value="${p.id}" ${patientId === p.id ? 'selected' : ''}>${p.prenom} ${p.nom}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label class="form-label">Date</label><input class="form-input" type="date" id="ord-date" value="${todayStr()}"></div>
    </div>
    <div style="font-size:10px;color:var(--text2);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;">Médicaments</div>
    <div id="drugs-list"></div>
    <button class="btn btn-outline btn-sm" onclick="addDrugRow()" style="margin-bottom:14px;">+ Ajouter un médicament</button>
    <div class="form-group"><label class="form-label">Notes / Instructions</label><textarea class="form-textarea" id="ord-notes" placeholder="Instructions au patient..."></textarea></div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal('modal-ordonnance')">Annuler</button>
      <button class="btn btn-accent" onclick="saveOrdonnance()">Créer l'ordonnance</button>
    </div>
  </div>`;
  modal.classList.add('open');
  addDrugRow();
}

function addDrugRow() {
  const list = $('drugs-list');
  const row = document.createElement('div'); row.className = 'drug-row';
  row.innerHTML = `
    <input class="form-input drug-name" placeholder="Médicament (ex: Amoxicilline 1g)">
    <input class="form-input drug-posologie" style="width:160px;" placeholder="Posologie">
    <input class="form-input drug-duree" style="width:90px;" placeholder="Durée">
    <button class="drug-remove" onclick="this.closest('.drug-row').remove()">✕</button>`;
  list.appendChild(row);
}

function saveOrdonnance() {
  const pid = parseInt($('ord-patient').value);
  if (!pid) { toast('Veuillez sélectionner un patient', 'error'); return; }
  const meds = [...document.querySelectorAll('.drug-row')].map(r => ({
    nom: r.querySelector('.drug-name').value.trim(),
    posologie: r.querySelector('.drug-posologie').value.trim(),
    duree: r.querySelector('.drug-duree').value.trim(),
    quantite: '',
  })).filter(m => m.nom);
  if (!meds.length) { toast('Ajoutez au moins un médicament', 'error'); return; }
  const newOrd = { id: ORDONNANCES.length + 1, patientId: pid, date: $('ord-date').value, medicaments: meds, notes: $('ord-notes').value, dentiste: 'Dr. Benali' };
  ORDONNANCES.push(newOrd);
  closeModal('modal-ordonnance');
  renderOrdonnances();
  toast('Ordonnance créée', 'success');
  setTimeout(() => printOrdonnance(newOrd.id), 300);
}

function openOrdDetail(id) {
  const o = ORDONNANCES.find(x => x.id === id); if (!o) return;
  const p = getPatient(o.patientId);
  const modal = $('modal-ordonnance');
  modal.innerHTML = `
  <div class="modal modal-md">
    <div class="modal-header">
      <div class="modal-title">Ordonnance #${o.id}</div>
      <button class="modal-close" onclick="closeModal('modal-ordonnance')">✕</button>
    </div>
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;padding:12px;background:var(--s2);border-radius:var(--r1);">
      ${p ? `<div class="avatar avatar-md" style="background:${avatarColor(p.nom)};color:#0b0d12;">${initials(p)}</div>` : ''}
      <div><div style="font-family:'Syne';font-weight:700;">${p ? `${p.prenom} ${p.nom}` : 'Patient inconnu'}</div><div style="font-size:11px;color:var(--text2);">${o.date} · ${o.dentiste}</div></div>
    </div>
    <div style="font-size:10px;color:var(--text2);text-transform:uppercase;letter-spacing:.08em;margin-bottom:8px;">Prescriptions</div>
    ${o.medicaments.map((m, i) => `<div style="padding:10px;background:var(--s2);border:1px solid var(--border);border-radius:var(--r1);margin-bottom:6px;">
      <div style="display:flex;justify-content:space-between;"><strong>${m.nom}</strong><span class="badge badge-gray">${m.duree}</span></div>
      <div style="font-size:11px;color:var(--text2);margin-top:3px;">📋 ${m.posologie}</div>
      ${m.quantite ? `<div style="font-size:10px;color:var(--text3);margin-top:2px;">Qté: ${m.quantite}</div>` : ''}
    </div>`).join('')}
    ${o.notes ? `<div style="margin-top:10px;padding:10px;background:rgba(255,184,48,.06);border:1px solid rgba(255,184,48,.15);border-radius:var(--r1);font-size:11px;color:var(--warn);">📝 ${o.notes}</div>` : ''}
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal('modal-ordonnance')">Fermer</button>
      <button class="btn btn-accent" onclick="printOrdonnance(${o.id})">🖨 Imprimer</button>
    </div>
  </div>`;
  modal.classList.add('open');
}

function printOrdonnance(id) {
  const o = ORDONNANCES.find(x => x.id === id); if (!o) return;
  const p = getPatient(o.patientId);
  const modal = $('modal-print');
  modal.innerHTML = `
  <div class="modal modal-md" style="padding:0;overflow:hidden;">
    <div style="padding:16px 20px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);">
      <div style="font-family:'Syne';font-weight:700;">Aperçu impression</div>
      <button class="modal-close" onclick="closeModal('modal-print')">✕</button>
    </div>
    <div style="padding:20px;">
    <div class="print-preview" id="print-content">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;padding-bottom:16px;border-bottom:2px solid #1a1a2e;">
        <div>
          <h1 style="font-family:'Syne',sans-serif;font-size:22px;margin-bottom:2px;">SmileSync</h1>
          <div style="color:#666;font-size:12px;">Cabinet Dentaire</div>
          <div style="color:#666;font-size:11px;margin-top:4px;">Dr. Benali · RPPS: 12345678901</div>
          <div style="color:#666;font-size:11px;">123 Avenue Habib Bourguiba, Tunis</div>
          <div style="color:#666;font-size:11px;">Tél: +216 71 234 567</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:13px;font-weight:600;">ORDONNANCE</div>
          <div style="color:#666;font-size:11px;">N° ${o.id} — ${o.date}</div>
        </div>
      </div>
      <div style="margin-bottom:16px;">
        <div style="font-size:11px;color:#666;margin-bottom:2px;">PATIENT</div>
        <div style="font-size:14px;font-weight:600;">${p ? `${p.prenom} ${p.nom}` : 'Patient inconnu'}</div>
        <div style="font-size:11px;color:#666;">${p ? ('Né(e) le ' + p.dob) : ''}</div>
      </div>
      <ul class="print-meds">
        ${o.medicaments.map((m, i) => `<li style="padding:10px 0;border-bottom:1px solid #eee;">
          <div style="font-weight:600;font-size:13px;">Rp ${i + 1} — ${m.nom}</div>
          <div style="color:#444;margin-top:3px;font-size:12px;">Sig: ${m.posologie}</div>
          <div style="color:#666;font-size:11px;margin-top:2px;">Durée: ${m.duree}${m.quantite ? ' · Qté: ' + m.quantite : ''}</div>
        </li>`).join('')}
      </ul>
      ${o.notes ? `<div style="margin-top:14px;padding:10px;background:#fafafa;border:1px solid #eee;border-radius:6px;font-size:11px;color:#555;">Note: ${o.notes}</div>` : ''}
      <div style="margin-top:30px;display:flex;justify-content:flex-end;">
        <div style="text-align:center;">
          <div style="width:120px;height:1px;background:#1a1a2e;margin:0 auto 6px;"></div>
          <div style="font-size:11px;color:#666;">Signature & Cachet</div>
          <div style="font-size:11px;font-weight:600;">Dr. Benali</div>
        </div>
      </div>
      <div style="text-align:center;margin-top:16px;font-size:9px;color:#aaa;">Document généré le ${new Date().toLocaleDateString('fr-FR')} — SmileSync v2.0</div>
    </div>
    </div>
    <div style="padding:12px 20px;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:8px;">
      <button class="btn btn-outline" onclick="closeModal('modal-print')">Fermer</button>
      <button class="btn btn-accent" onclick="window.print()">🖨 Imprimer</button>
    </div>
  </div>`;
  modal.classList.add('open');
}
