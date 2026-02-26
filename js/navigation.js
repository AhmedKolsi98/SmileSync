// ══════════════════════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════════════════════

function navigateTo(page) {
  qsa('.page').forEach(p => p.classList.remove('active'));
  qsa('.nav-item').forEach(b => b.classList.remove('active'));
  $(`page-${page}`).classList.add('active');
  document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
  $('topbar-title').textContent = PAGE_TITLES[page] || page;
  APP.currentPage = page;
}

// Set up navigation event listeners
document.querySelectorAll('.nav-item[data-page]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.page === 'ordonnances' && APP.role !== 'dentiste') { toast('Accès réservé au dentiste', 'error'); return; }
    navigateTo(btn.dataset.page);
  });
});

function toggleSidebar() {
  APP.sidebarCollapsed = !APP.sidebarCollapsed;
  $('sidebar').classList.toggle('collapsed', APP.sidebarCollapsed);
}

function toggleNotif() {
  $('notif-panel').classList.toggle('open');
}

function globalSearch(val) {
  if (val.length < 2) return;
  navigateTo('patients');
  renderPatients(val);
}
