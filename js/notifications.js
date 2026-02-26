// ══════════════════════════════════════════════════════════
// NOTIFICATIONS
// ══════════════════════════════════════════════════════════

function renderNotifications() {
  const list = $('notif-list'); list.innerHTML = '';
  NOTIFICATIONS.forEach(n => {
    const item = el('div', 'notif-item');
    item.innerHTML = `<div style="display:flex;align-items:flex-start;gap:8px;"><span style="font-size:16px;">${n.icon}</span><div><div class="notif-title">${n.title}</div><div class="notif-sub">${n.sub}</div></div></div>`;
    list.appendChild(item);
  });
}
