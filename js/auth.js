// ══════════════════════════════════════════════════════════
// AUTHENTICATION
// ══════════════════════════════════════════════════════════

function selectRole(r) {
  selectedRole = r;
  $('role-dentiste').classList.toggle('selected', r === 'dentiste');
  $('role-secretaire').classList.toggle('selected', r === 'secretaire');
}

function doLogin() {
  APP.role = selectedRole;
  APP.user = selectedRole === 'dentiste' ? 'Dr. Benali' : 'Mme. Chaabane';
  $('login-screen').style.opacity = '0';
  $('login-screen').style.transition = 'opacity 0.4s';
  setTimeout(() => { $('login-screen').style.display = 'none'; }, 400);
  $('app').classList.add('visible');
  applyRole();
  renderAll();
  setTimeout(() => toast('Bienvenue, ' + APP.user + '! 👋', 'success'), 600);
}

function doLogout() {
  $('app').style.opacity = '0';
  $('app').style.transition = 'opacity 0.3s';
  setTimeout(() => {
    $('app').style.opacity = '';
    $('app').style.transition = '';
    $('app').classList.remove('visible');
    $('login-screen').style.display = 'flex';
    $('login-screen').style.opacity = '0';
    $('login-screen').style.transition = 'opacity 0.3s';
    requestAnimationFrame(() => { $('login-screen').style.opacity = '1'; });
  }, 300);
}

function applyRole() {
  const isDentiste = APP.role === 'dentiste';
  $('sb-user-name').textContent = APP.user;
  $('sb-user-role').textContent = isDentiste ? 'Dentiste' : 'Secrétaire';
  $('sb-avatar').textContent = isDentiste ? 'D' : 'S';
  $('sb-avatar').style.background = isDentiste ? 'var(--accent)' : 'var(--cyan)';
  $('tb-role-badge').textContent = isDentiste ? 'Dentiste' : 'Secrétaire';
  $('tb-role-badge').style.background = isDentiste ? 'var(--accent-dim)' : 'var(--cyan-dim)';
  $('tb-role-badge').style.color = isDentiste ? 'var(--accent)' : 'var(--cyan)';
  // Restrict ordonnances for secretary
  if (!isDentiste) $('nav-ord').style.opacity = '0.5';
}
