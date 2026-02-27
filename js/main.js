// Application Entry Point
import { initTheme, toggleTheme } from './theme.js';
import { selectRole, doLogin, doLogout, applyRole } from './auth.js';
import { initNavigation, toggleSidebar, toggleNotif, globalSearch } from './navigation.js';
import { renderAll } from './render.js';
import { closeModal } from './utils.js';

// Initialize theme
initTheme();

// Initialize navigation
initNavigation();

// Modal close handlers
document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    const notifPanel = document.getElementById('notif-panel');
    if (notifPanel) notifPanel.classList.remove('open');
  }
});

// Print styles
const printStyles = document.createElement('style');
printStyles.textContent = `@media print{body>*:not(#modal-print){display:none!important;}.modal-overlay{position:static!important;background:none!important;}.modal{box-shadow:none!important;border:none!important;}.print-preview{padding:0!important;}}`;
document.head.appendChild(printStyles);

// Global exposure for inline onclick handlers
window.selectRole = selectRole;
window.doLogin = doLogin;
window.doLogout = doLogout;
window.toggleSidebar = toggleSidebar;
window.toggleNotif = toggleNotif;
window.toggleTheme = toggleTheme;
window.globalSearch = globalSearch;
window.closeModal = closeModal;

// Export for other modules
export { renderAll };