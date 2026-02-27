// Navigation Module
import { APP, PAGE_TITLES } from './config.js';
import { toast } from './utils.js';
import { renderPatients } from './patients.js';

export function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) pageEl.classList.add('active');
  const navBtn = document.querySelector(`[data-page="${page}"]`);
  if (navBtn) navBtn.classList.add('active');
  const topbarTitle = document.getElementById('topbar-title');
  if (topbarTitle) topbarTitle.textContent = PAGE_TITLES[page] || page;
  APP.currentPage = page;
}

export function toggleSidebar() {
  APP.sidebarCollapsed = !APP.sidebarCollapsed;
  document.getElementById('sidebar').classList.toggle('collapsed', APP.sidebarCollapsed);
}

export function toggleNotif() {
  document.getElementById('notif-panel').classList.toggle('open');
}

export function globalSearch(val) {
  if (val.length < 2) return;
  navigateTo('patients');
  renderPatients(val);
}

export function initNavigation() {
  document.querySelectorAll('.nav-item[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.page === 'ordonnances' && APP.role !== 'dentiste') {
        toast('Accès réservé au dentiste', 'error');
        return;
      }
      navigateTo(btn.dataset.page);
    });
  });
}