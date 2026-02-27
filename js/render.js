// Main Render Orchestrator
import { renderDashboard } from './dashboard.js';
import { renderPatients } from './patients.js';
import { renderAgenda } from './agenda.js';
import { renderOrdonnances } from './ordonnances.js';
import { renderNotifications } from './notifications.js';

export function renderAll() {
  renderDashboard();
  renderPatients();
  renderAgenda();
  renderOrdonnances();
  renderNotifications();
}