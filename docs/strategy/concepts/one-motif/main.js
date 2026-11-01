// One motif — #166 concept prototype. No library. Every part leaves the page readable without it.
document.documentElement.classList.add('js');

// Entrances: the parts of each section arrive in reading order (style.css, scroll-driven); this only
// numbers them within their section so the later parts start a little later.
(() => {
  const count = new Map();
  for (const el of document.querySelectorAll('[data-reveal]')) {
    const key = el.closest('section, footer') || document.body;
    const n = count.get(key) || 0;
    el.style.setProperty('--n', String(Math.min(n, 5)));
    count.set(key, n + 1);
  }
})();

// Signature move: index with preview. Pointing at a row (or focusing inside it) shows its picture
// in the one framed plate beside the table, and the other rows step back to the soft ink.
(() => {
  const frame = document.querySelector('.frame');
  if (!frame) return;
  const pictures = [...frame.querySelectorAll('img[data-src-key]')];
  const caption = frame.querySelector('.frame__cap');
  const first = { key: pictures[0]?.dataset.srcKey, caption: caption?.textContent };
  const show = (key, text) => {
    pictures.forEach((img) => img.classList.toggle('is-on', img.dataset.srcKey === key));
    if (caption && text) caption.textContent = text;
  };
  document.querySelectorAll('.list .rows').forEach((rows) => {
    const all = [...rows.querySelectorAll('.row')];
    const point = (row) => {
      rows.classList.add('is-pointing');
      all.forEach((r) => r.classList.toggle('is-active', r === row));
      show(row.dataset.preview, row.dataset.caption);
    };
    const leave = () => { rows.classList.remove('is-pointing'); all.forEach((r) => r.classList.remove('is-active')); };
    all.forEach((row) => {
      row.addEventListener('pointerenter', () => point(row));
      row.addEventListener('focusin', () => point(row));
    });
    rows.addEventListener('pointerleave', leave);
    rows.addEventListener('focusout', (e) => { if (!rows.contains(e.relatedTarget)) leave(); });
  });
  document.querySelector('.list__groups')?.addEventListener('pointerleave', () => show(first.key, first.caption));
})();

// The live thing: tick the financial-inspection items; the line under the list names what was ticked.
(() => {
  const list = document.querySelector('.checks');
  const out = document.querySelector('.checks__out');
  if (!list || !out) return;
  list.addEventListener('change', () => {
    const ticked = [...list.querySelectorAll('input:checked')].map((i) => i.nextElementSibling.nextElementSibling.textContent);
    out.textContent = ticked.length
      ? `已勾選 ${ticked.length} 項：${ticked.join('、')}。都在 digiRunner 針對金融檢查的 API 管理裡。`
      : '';
  });
})();

// OrientAI tabs: without script every panel shows; with it, one at a time, arrow keys move along the row.
(() => {
  const tabs = [...document.querySelectorAll('.show__tabs [role="tab"]')];
  if (!tabs.length) return;
  const select = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
      else if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
      else if (step) { e.preventDefault(); select(tabs[(i + step + tabs.length) % tabs.length], true); }
    });
  });
  select(tabs[0]);
})();
