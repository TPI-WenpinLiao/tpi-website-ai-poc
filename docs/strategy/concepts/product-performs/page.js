// The product performs — the page's motion and its one live thing. No library.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---- hero reel: one API request passes each check, one frame per step of the held stage ---- */
  const track = document.querySelector('[data-reel]');
  const strip = track.querySelector('[data-strip]');
  const stage = track.querySelector('.hero__stage');
  const frames = [...strip.querySelectorAll('[data-frame]')];
  const caption = document.querySelector('[data-caption]');
  const captions = [
    ['識別認證', 'OAuth 2.0、OIDC 與 API Key 授權方式。介面示意。'],
    ['針對金融檢查，完善 API 管理', '一個 API 請求逐項通過檢查。介面示意。'],
    ['即時主控台完整保留 API 活動與軌跡', '請求接進核心銀行系統。介面示意。'],
    ['既有的大型主機', '照片：IBM System/360 Model 40 的控制面板，京都 KCG 博物館。'],
  ];
  let reelStep = -1;
  const setReel = (step) => {
    if (step === reelStep) return;
    reelStep = step;
    strip.style.setProperty('--step', step);
    frames.forEach((f, i) => {
      const rows = f.querySelectorAll('.ui-row');
      rows.forEach((r, k) => {
        // a frame ahead of the request still waits; the current one passes its checks in order
        r.classList.toggle('is-pass', i < step || (i === step));
        r.style.setProperty('--d', `${120 + k * 90}ms`);
      });
    });
    const [b, t] = captions[step];
    caption.innerHTML = `<b>${b}</b>${t}`;
  };
  const pinned = () => getComputedStyle(stage).position === 'sticky';
  const onScroll = () => {
    if (pinned()) {
      const r = track.getBoundingClientRect();
      const run = track.offsetHeight - innerHeight;
      const p = run > 0 ? clamp(-r.top / run, 0, 0.999) : 0;
      setReel(Math.floor(p * frames.length));
    } else setReel(2);
    if (work) workScroll();
  };

  /* ---- cases: the held stage changes case once per screen ---- */
  const work = document.querySelector('[data-work]');
  const cases = [...work.querySelectorAll('[data-case]')];
  let caseNow = -1;
  const workStage = work.querySelector('.work__stage');
  const workScroll = () => {
    let i = 0;
    if (getComputedStyle(workStage).position === 'sticky') {
      const r = work.getBoundingClientRect();
      const run = work.offsetHeight - innerHeight;
      i = Math.floor(clamp(-r.top / run, 0, 0.999) * cases.length);
    }
    if (i === caseNow) return;
    caseNow = i;
    cases.forEach((c, k) => { c.classList.toggle('is-now', k === i); c.classList.toggle('is-past', k < i); });
  };

  let ticking = false;
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; onScroll(); }); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---- section entrances: heading, then text, then the picture; once ---- */
  const groups = new Map();
  document.querySelectorAll('[data-in]').forEach((el) => {
    const sec = el.closest('section, footer') || document.body;
    const n = groups.get(sec) || 0;
    groups.set(sec, n + 1);
    el.style.setProperty('--d', `${Math.min(n, 4) * 70}ms`);
  });
  // checked on every scroll frame, so a jump past a section (a link, a fast scroll) still reveals it
  let waiting = [...document.querySelectorAll('[data-in]')];
  const reveal = () => {
    if (!waiting.length) return;
    const edge = innerHeight * 0.95;
    waiting = waiting.filter((el) => { if (el.getBoundingClientRect().top < edge) { el.classList.add('is-in'); return false; } return true; });
  };
  addEventListener('scroll', () => requestAnimationFrame(reveal), { passive: true });
  reveal();

  /* ---- OrientAI shelf: the panel at the centre is lit and named ---- */
  const shelf = document.querySelector('[data-shelf-row]');
  const panels = [...shelf.querySelectorAll('.panel')];
  const shelfText = document.querySelector('[data-shelf-text]');
  let lit = 0;
  const light = () => {
    const mid = shelf.getBoundingClientRect().left + shelf.clientWidth / 2;
    let best = 0, d = Infinity;
    panels.forEach((p, i) => { const r = p.getBoundingClientRect(); const x = Math.abs(r.left + r.width / 2 - mid); if (x < d) { d = x; best = i; } });
    if (best === lit && panels[best].classList.contains('is-lit')) return;
    lit = best;
    panels.forEach((p, i) => p.classList.toggle('is-lit', i === best));
    const cap = panels[best].querySelector('figcaption');
    shelfText.classList.add('is-swapping');
    setTimeout(() => {
      shelfText.innerHTML = cap.innerHTML;
      shelfText.classList.remove('is-swapping');
    }, reduce.matches ? 0 : 200);
  };
  panels.forEach((p) => p.classList.remove('is-lit'));
  panels[0].classList.add('is-lit');
  shelf.addEventListener('scroll', () => requestAnimationFrame(light), { passive: true });
  const go = (dir) => {
    const next = panels[clamp(lit + dir, 0, panels.length - 1)];
    shelf.scrollTo({ left: next.offsetLeft + next.offsetWidth / 2 - shelf.clientWidth / 2, behavior: reduce.matches ? 'auto' : 'smooth' });
  };
  document.querySelectorAll('[data-shelf-go]').forEach((b) => b.addEventListener('click', () => go(Number(b.dataset.shelfGo))));
  // drag with a mouse; touch and trackpads scroll natively
  let drag = null;
  shelf.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; drag = { x: e.clientX, left: shelf.scrollLeft }; shelf.style.scrollSnapType = 'none'; });
  addEventListener('pointermove', (e) => { if (drag) shelf.scrollLeft = drag.left - (e.clientX - drag.x); });
  addEventListener('pointerup', () => { if (!drag) return; drag = null; shelf.style.scrollSnapType = ''; go(0); });

  /* ---- the live thing: drag through the four stages of SysTalk.ai's AI onboarding ---- */
  const range = document.querySelector('[data-range]');
  const stagesEl = document.querySelector('[data-stages]');
  const clause = stagesEl.querySelector('[data-clause]');
  const ui = stagesEl.querySelector('[data-stage-ui]');
  const rows = [...ui.querySelectorAll('[data-stage-row]')];
  const names = [...stagesEl.querySelectorAll('[data-stage-names] li')];
  const fill = stagesEl.querySelector('[data-fill]');
  const STAGES = [['導入前', 'AI 導入情境分析'], ['導入前', '解決方案搭配建議'], ['導入前', '效益評估'], ['導入中', '模型評估、微調']];
  const setStage = (n) => {
    const [order, name] = STAGES[n];
    range.setAttribute('aria-valuetext', `${order}：${name}`);
    fill.style.setProperty('--fill', `${(n / (STAGES.length - 1)) * 100}%`);
    names.forEach((li, i) => li.classList.toggle('is-now', i === n));
    const swap = () => {
      clause.innerHTML = `<span class="order">${order}</span><span>${name}</span>`;
      rows.forEach((r, i) => {
        r.classList.toggle('is-now', i === n);
        r.classList.toggle('is-pass', i < n);
        r.querySelector('[data-stage-state]').textContent = i < n ? '完成' : i === n ? '進行中' : '待進行';
      });
      clause.classList.remove('is-swapping');
      ui.classList.remove('is-swapping');
    };
    if (reduce.matches) return swap();
    clause.classList.add('is-swapping');
    ui.classList.add('is-swapping');
    setTimeout(swap, 200);
  };
  range.addEventListener('input', () => setStage(Number(range.value)));
  names.forEach((li, i) => li.addEventListener('click', () => { range.value = i; setStage(i); }));
  setStage(0);
})();
