// gateway-console：頁籤、選單、段落進場、第 4 段的 sticky 片段切換。不用任何套件。
(() => {
  const d = document;
  const root = d.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');

  // A1 的「金融／政府」頁籤：點擊或左右鍵切換
  d.querySelectorAll('[role="tablist"]').forEach((list) => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        d.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        const n = tabs.length;
        const j = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: n - 1 }[e.key];
        if (j === undefined) return;
        e.preventDefault();
        select(tabs[(j + n) % n], true);
      });
    });
    select(tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0]);
  });

  // 375 寬的「選單」
  const menu = d.querySelector('.menu');
  const nav = d.getElementById('site-nav');
  if (menu && nav) {
    nav.setAttribute('data-closed', '');
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      nav.toggleAttribute('data-closed', !open);
    });
  }

  // 段落進場：每段的標題、文字、圖依序錯開 75ms，只觸發一次
  d.querySelectorAll('main section').forEach((sec) => {
    sec.querySelectorAll('[data-r]').forEach((el, i) => el.style.setProperty('--d', `${Math.min(i, 5) * 75}ms`));
  });
  const items = d.querySelectorAll('[data-r]');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach((el) => io.observe(el));
  }

  // 第 4 段：右側片段跟著左邊讀到的家族換內容
  const frags = [...d.querySelectorAll('.stage > .frag')];
  const show = (id) => frags.forEach((f) => f.classList.toggle('on', f.dataset.for === id));
  if ('IntersectionObserver' in window && frags.length) {
    show('digilism');
    const fo = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) show(en.target.dataset.fam); });
    }, { rootMargin: '-40% 0px -50% 0px' });
    d.querySelectorAll('.fam[data-fam]').forEach((f) => fo.observe(f));
  }
})();
