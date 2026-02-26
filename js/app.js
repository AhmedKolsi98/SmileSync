// ══════════════════════════════════════════════════════════
// MAIN APP INITIALIZATION
// ══════════════════════════════════════════════════════════
import './helpers.js';
import './navigation.js';
import './auth.js';
import './dashboard.js';
import './patients.js';
import './agenda.js';
import './ordonnances.js';
import './notifications.js';
// Render all pages
function renderAll() {
  renderDashboard();
  renderPatients();
  renderAgenda();
  renderOrdonnances();
  renderNotifications();
}

// Post-render chart initialization
function postRenderCharts() {
  PATIENTS.forEach(p => {
    const svg = document.getElementById(`dsvg-${p.id}`);
    if (svg && !svg.dataset.built) {
      const container = svg.closest('.view-container');
      if (container && container.classList.contains('active')) { initDentalChart(p.id, p.teeth); }
    }
  });
}

// Initialize modal click handlers
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    $('notif-panel').classList.remove('open');
  }
});

// Print styles
const printStyles = document.createElement('style');
printStyles.textContent = `@media print{body>*:not(#modal-print){display:none!important;}.modal-overlay{position:static!important;background:none!important;}.modal{box-shadow:none!important;border:none!important;}.print-preview{padding:0!important;}}`;
document.head.appendChild(printStyles);
