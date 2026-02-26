// ══════════════════════════════════════════════════════════
// THEME SYSTEM
// ══════════════════════════════════════════════════════════

function getSavedTheme() {
  return localStorage.getItem('smilesync-theme') || 'dark';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('smilesync-theme', theme);
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.textContent = theme === 'light' ? '☾' : '☀';
  }
}

function toggleTheme() {
  const currentTheme = getSavedTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
}

// Initialize theme on page load
(function initTheme() {
  const theme = getSavedTheme();
  applyTheme(theme);
})();
