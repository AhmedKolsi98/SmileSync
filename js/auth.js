// Authentication Module
import { APP } from './config.js';
import { toast } from './utils.js';
import { renderAll } from './render.js';

let selectedRole = 'dentiste';

export function selectRole(r) {
  selectedRole = r;
  document.getElementById('role-dentiste').classList.toggle('selected', r === 'dentiste');
  document.getElementById('role-secretaire').classList.toggle('selected', r === 'secretaire');
}

export function doLogin() {
  APP.role = selectedRole;
  APP.user = selectedRole === 'dentiste' ? 'Dr. Benali' : 'Mme. Chaabane';
  const loginScreen = document.getElementById('login-screen');
  loginScreen.style.opacity = '0';
  loginScreen.style.transition = 'opacity 0.4s';
  setTimeout(() => {
    loginScreen.style.display = 'none';
  }, 400);
  document.getElementById('app').classList.add('visible');
  applyRole();
  renderAll();
  setTimeout(() => toast('Bienvenue, ' + APP.user + '! 👋', 'success'), 600);
}

export function doLogout() {
  const app = document.getElementById('app');
  app.style.opacity = '0';
  app.style.transition = 'opacity 0.3s';
  setTimeout(() => {
    app.style.opacity = '';
    app.style.transition = '';
    app.classList.remove('visible');
    const loginScreen = document.getElementById('login-screen');
    loginScreen.style.display = 'flex';
    loginScreen.style.opacity = '0';
    loginScreen.style.transition = 'opacity 0.3s';
    requestAnimationFrame(() => { loginScreen.style.opacity = '1'; });
  }, 300);
}

export function applyRole() {
  const isDentiste = APP.role === 'dentiste';
  document.getElementById('sb-user-name').textContent = APP.user;
  document.getElementById('sb-user-role').textContent = isDentiste ? 'Dentiste' : 'Secrétaire';
  const sbAvatar = document.getElementById('sb-avatar');
  sbAvatar.textContent = isDentiste ? 'D' : 'S';
  sbAvatar.style.background = isDentiste ? 'var(--accent)' : 'var(--cyan)';
  const tbRoleBadge = document.getElementById('tb-role-badge');
  tbRoleBadge.textContent = isDentiste ? 'Dentiste' : 'Secrétaire';
  tbRoleBadge.style.background = isDentiste ? 'var(--accent-dim)' : 'var(--cyan-dim)';
  tbRoleBadge.style.color = isDentiste ? 'var(--accent)' : 'var(--cyan)';
  const navOrd = document.getElementById('nav-ord');
  if (navOrd && !isDentiste) navOrd.style.opacity = '0.5';
}

export { selectedRole };