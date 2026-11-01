// layer-fields：段落進場、第 4 段的問題切換、375 寬的選單。沒有這支 script 時內容照常全部顯示。
(() => {
  // 段落進場：進入視窗時加 .in，只觸發一次
  const sections = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -12% 0px' });
    sections.forEach((s) => io.observe(s));
  } else {
    sections.forEach((s) => s.classList.add('in'));
  }

  // 第 4 段：四個問題切換右邊的片段（role="tablist"，方向鍵切換）
  const tabs = [...document.querySelectorAll('.finder [role="tab"]')];
  const select = (tab, focus) => {
    for (const t of tabs) {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    }
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab, false));
    tab.addEventListener('keydown', (e) => {
      const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
      else if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
      else if (step) { e.preventDefault(); select(tabs[(i + step + tabs.length) % tabs.length], true); }
    });
  });
  if (tabs.length) select(tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0], false);

  // 375 寬：「選單」展開 header 的連結
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  toggle?.addEventListener('click', () => {
    const open = header.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
})();
