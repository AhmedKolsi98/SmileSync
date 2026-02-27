// Theme System
export function getSavedTheme() {
  return localStorage.getItem('smilesync-theme') || 'dark';
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('smilesync-theme', theme);
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.textContent = theme === 'light' ? '☾' : '☀';
  }
}

export function toggleTheme() {
  const currentTheme = getSavedTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
}

export function initTheme() {
  const theme = getSavedTheme();
  applyTheme(theme);
}