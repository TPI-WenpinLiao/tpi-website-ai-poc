// Colour chapters — the prototype's script (#166). Everything works and reads without it.
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

// Entrances: reveal once as each part enters; never leave content hidden.
(() => {
  const targets = document.querySelectorAll('[data-reveal]');
  // Entrances run on wide screens only; on a phone the page is long and every part is simply there.
  if (!matchMedia('(min-width: 900px)').matches || !('IntersectionObserver' in window)) { targets.forEach((el) => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -5% 0px', threshold: 0.02 });
  targets.forEach((el) => io.observe(el));
  addEventListener('load', () => setTimeout(() => {
    targets.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in'); });
  }, 2500));
})();

// Signature move — index with preview: pointing at or tabbing to a rule shows its document in the
// fixed frame (240ms crossfade) and dims the other rows. The frame stays in its column.
(() => {
  const root = document.querySelector('.list');
  if (!root) return;
  const frame = root.querySelector('.index__frame');
  const [a, b] = frame.querySelectorAll('img');
  const caption = frame.querySelector('figcaption');
  let front = a, back = b, current = a.getAttribute('src');
  const show = (row) => {
    const src = row.dataset.preview;
    caption.textContent = row.dataset.caption;
    if (src === current) return;
    current = src;
    back.src = src;
    back.alt = row.dataset.alt; front.alt = '';
    const swap = () => { back.classList.remove('is-hidden'); front.classList.add('is-hidden'); [front, back] = [back, front]; };
    if (back.complete) swap(); else back.addEventListener('load', swap, { once: true });
  };
  root.querySelectorAll('.index__row').forEach((row) => {
    row.addEventListener('pointerenter', () => show(row));
    row.addEventListener('focus', () => show(row));
  });
})();

// Features: deal the cards onto the black stage as the wrapper scrolls past (wide screens, motion allowed).
(() => {
  const fan = document.querySelector('.fan');
  if (!fan) return;
  const cards = [...fan.querySelectorAll('.card')];
  const wide = matchMedia('(min-width: 1120px)');
  let ticking = false;
  const place = () => {
    ticking = false;
    if (!wide.matches || reduce.matches) { cards.forEach((c) => (c.style.transform = '')); return; }
    const r = fan.getBoundingClientRect();
    const span = fan.offsetHeight - innerHeight;
    const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 1;
    // the fan stays centred on the stage: one card sits in the middle, each new card shifts the group left
    const dealt = Math.min(3, Math.max(0, p * 3.4));
    const shift = 125 * (3 - dealt);
    cards.forEach((card, i) => {
      const rot = parseFloat(card.style.getPropertyValue('--r')) || 0;
      const t = i === 0 ? 1 : Math.min(1, Math.max(0, dealt - (i - 1)));
      const e = 1 - Math.pow(1 - t, 3);
      card.style.transform = `translate(${shift}px, ${(1 - e) * 110}vh) rotate(${rot * e}deg)`;
    });
  };
  const ask = () => { if (!ticking) { ticking = true; requestAnimationFrame(place); } };
  addEventListener('scroll', ask, { passive: true });
  addEventListener('resize', ask);
  place();
})();

// The live thing: Token 用量監控. Switching it swaps the field between orange (on) and grey (off)
// and changes one word of the heading. Without script the page shows the on state.
(() => {
  const section = document.querySelector('.showcase');
  if (!section) return;
  const sw = section.querySelector('.switch');
  const word = section.querySelector('[data-word]');
  const value = section.querySelector('.control__value');
  sw.addEventListener('click', () => {
    const on = sw.getAttribute('aria-checked') !== 'true';
    sw.setAttribute('aria-checked', String(on));
    section.classList.toggle('is-off', !on);
    word.textContent = on ? word.dataset.on : word.dataset.off;
    value.textContent = on ? '開啟' : '關閉';
  });
})();
