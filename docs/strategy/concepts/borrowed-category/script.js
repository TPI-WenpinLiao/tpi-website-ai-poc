// borrowed-category prototype: shutter, entrances, case index, OrientAI switch. No dependencies.
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Signature move: open the hero arch once the page has painted.
  const shutter = document.querySelector('.shutter');
  if (shutter) requestAnimationFrame(() => requestAnimationFrame(() => shutter.classList.add('is-in')));

  // Entrances: stagger the parts of each section as it enters, once.
  const sections = document.querySelectorAll('[data-section]');
  sections.forEach((section) => {
    section.querySelectorAll('[data-reveal]').forEach((el, i) => el.style.setProperty('--i', String(Math.min(i, 8))));
  });
  const show = (section) => section.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
  if (reduce || !('IntersectionObserver' in window)) {
    sections.forEach(show);
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        show(entry.target);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });
    sections.forEach((section) => io.observe(section));
  }

  // Case index: hover or focus moves the active name and swaps the fixed preview.
  const items = [...document.querySelectorAll('.work-item')];
  const pics = [...document.querySelectorAll('.work-frame-pics img')];
  const activate = (n) => {
    items.forEach((item, i) => item.classList.toggle('is-active', i === n));
    pics.forEach((pic, i) => pic.classList.toggle('is-active', i === n));
  };
  items.forEach((item, i) => {
    item.addEventListener('mouseenter', () => activate(i));
    item.addEventListener('focusin', () => activate(i));
  });

  // OrientAI: the switch swaps the field colour, one word of the heading and its value.
  const section = document.querySelector('.show');
  const sw = section && section.querySelector('.switch');
  if (sw) {
    const word = section.querySelector('.show-word');
    const value = sw.querySelector('.switch-value');
    sw.addEventListener('click', () => {
      const on = sw.getAttribute('aria-checked') !== 'true';
      sw.setAttribute('aria-checked', String(on));
      section.dataset.state = on ? 'on' : 'off';
      word.textContent = on ? '自己的' : '外部的';
      value.textContent = on ? '開啟' : '關閉';
    });
  }
})();
