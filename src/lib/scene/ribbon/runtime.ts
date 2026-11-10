// The live ribbon scene on the home page (#167, ADR 0003「ribbon-route」). Loaded only by
// HomeTemplate's dynamic import, after the load event, the LCP and an idle callback, on desktop with
// motion allowed, so three.js never sits on the critical path. No GSAP: the hero pin and the cases
// pin are CSS sticky, and this file drives the camera and the text from the scroll position.
//
// Two places show the one world (world.ts):
//   route  the hero and the industries share one sticky canvas. While the hero is held the camera
//          rises from 21° to straight above; after that it pans with the page, one CSS pixel to one
//          pixel of map, so the map, the ribbon's tail and the industries' text scroll together.
//          The tail and the fork are built from the box of the fork picture, the same shape the
//          static picture shows, so both versions end the branches on the same two entries.
//   cases  a framed close-up that walks the magenta stretch while the section is held; the block of
//          the result on screen lights up and an HTML label names its work.
//
// DOM contract (HomeTemplate): [data-ribbon-route] with its stage [data-ribbon-slot="route"] and
// the map labels [data-ribbon-anchor]; [data-ribbon-hero] and its words [data-ribbon-copy];
// the fork picture [data-ribbon-fork]; [data-ribbon-cases] with [data-ribbon-slot="cases"],
// [data-ribbon-case] panels (name in [data-ribbon-case-name]), the optional [data-ribbon-count]
// (only locales with a count template have one) and
// [data-ribbon-case-label]. The route gets data-scene="ready" once the first frame is on the page.
import { NoToneMapping, PCFShadowMap, SRGBColorSpace, WebGLRenderer } from 'three';
import {
  applyView,
  buildWorld,
  casesView,
  clamp,
  FORK,
  HALF_W,
  heroStart,
  mixView,
  newCamera,
  paletteFrom,
  plan,
  project,
  smooth,
  tailWorld,
  type AnchorName,
  type View,
} from './world';

// A task that runs longer than 50 ms blocks input, and Lighthouse counts it in TBT. Evaluating
// three.js, building the world, compiling its shaders and drawing the first frame each take tens of
// ms, so each runs in its own task (#127).
const nextTask = () => new Promise<void>((resolve) => setTimeout(resolve, 0));
// The longest each wait before the canvas joins the page may take. Both normally take tens of ms;
// if a driver never reports done, the canvas joins the page anyway once this has passed (#136).
// scripts/design/scene-wait.mjs reads this value.
const WAIT_LIMIT_MS = 1000;
const elapsed = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Resolves once the GPU has run every command issued so far, checking once per task, or after WAIT_LIMIT_MS */
async function gpuDone(gl: WebGLRenderingContext | WebGL2RenderingContext) {
  if (!(gl instanceof WebGL2RenderingContext)) return;
  const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
  if (!sync) return;
  gl.flush();
  const deadline = performance.now() + WAIT_LIMIT_MS;
  do await nextTask();
  while (gl.clientWaitSync(sync, 0, 0) === gl.TIMEOUT_EXPIRED && performance.now() < deadline);
  gl.deleteSync(sync);
}

// px between the hero words and the highest label; the most the hero view zooms out to keep them apart
const LABEL_GAP = 24;
const MAX_ZOOM_OUT = 1.8;
// The ribbon draws itself from the core system through the city once, in this long
const DRAW_MS = 1200;
const DRAW_DELAY_MS = 100;
// The hero words leave while the camera rises: start and length, as shares of the hero's hold
const COPY_OUT = { start: 0.08, length: 0.3 };
// The cases: when each result hands over to the next, as shares of the section's hold
const HANDOVERS = [0.31, 0.64];
const FADE = 0.06;
// How fast the shown cases progress follows the scroll position, per frame (a light scrub)
const CASES_FOLLOW = 0.16;

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const required = <T extends Element>(root: ParentNode, selector: string) => {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`ribbon scene: ${selector} is missing`);
  return el;
};

interface Options {
  canvas: HTMLCanvasElement;
  context: WebGL2RenderingContext;
  route: HTMLElement;
  cases: HTMLElement;
}

/** Builds the world one step per task and starts the scroll loop; returns a function that stops it */
export async function mount({ canvas, context, route, cases }: Options): Promise<() => void> {
  const hero = required<HTMLElement>(route, '[data-ribbon-hero]');
  const copy = required<HTMLElement>(hero, '[data-ribbon-copy]');
  const forkBox = required<HTMLElement>(route, '[data-ribbon-fork]');
  const slots = { route: required<HTMLElement>(route, '[data-ribbon-slot="route"]'), cases: required<HTMLElement>(cases, '[data-ribbon-slot="cases"]') };
  const routeLabels = [...route.querySelectorAll<HTMLElement>('[data-ribbon-anchor]')];
  const caseLabel = required<HTMLElement>(cases, '[data-ribbon-case-label]');
  const panels = [...cases.querySelectorAll<HTMLElement>('[data-ribbon-case]')];
  const count = cases.querySelector<HTMLElement>('[data-ribbon-count]');
  const names = panels.map((p) => required<HTMLElement>(p, '[data-ribbon-case-name]').textContent?.trim() ?? '');
  const countText = (n: number) => (count?.dataset.template ?? '{n}/{total}').replace('{n}', String(n + 1)).replace('{total}', String(panels.length));

  await nextTask();
  const style = getComputedStyle(route);
  const world = buildWorld(paletteFrom((t) => style.getPropertyValue(t)));
  const renderer = new WebGLRenderer({ canvas, context });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NoToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  // The light and the blocks never move and the camera doesn't change the shadow map, so it is drawn
  // only when the ribbon changes (built, or finished drawing), not on every frame: on a software
  // renderer every frame of the draw-in otherwise was a long task (#167, lighthouse-3d.mjs desktop)
  renderer.shadowMap.autoUpdate = false;
  const updateShadows = () => {
    renderer.shadowMap.needsUpdate = true;
  };
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  canvas.setAttribute('aria-hidden', 'true');
  const cam = newCamera();

  let mode: 'route' | 'cases' = 'route';
  let size: [number, number] = [1, 1];
  const layout = { heroTop: 0, held: 1, copyBottom: 0, labelH: 0, casesTop: 0, casesHeld: 1 };
  const state = { draw: 0, casesP: 0, current: 0 };

  const measure = () => {
    const el = slots[mode];
    size = [el.clientWidth || innerWidth, el.clientHeight || innerHeight];
    renderer.setSize(size[0], size[1], false);
    const y = scrollY;
    const hr = hero.getBoundingClientRect();
    layout.heroTop = hr.top + y;
    // the scroll position where the hero lets go
    layout.held = hr.bottom + y - innerHeight;
    const cr = cases.getBoundingClientRect();
    layout.casesTop = cr.top + y;
    layout.casesHeld = Math.max(1, cr.height - innerHeight);
    // where the hero words end on the stuck stage (its top is the screen's top), and how tall a label is
    layout.copyBottom = copy.getBoundingClientRect().bottom - hr.top - Math.max(0, y - layout.heroTop);
    layout.labelH = (routeLabels[0]?.offsetHeight ?? 0) + 8;
    // the tail: the fork picture's box, its top on the city edge, the stage's centre on x = 0 (the
    // stage stops growing past --layout-max-width and centres, so it needn't start at the screen's edge)
    const fb = forkBox.getBoundingClientRect();
    const stageW = slots.route.clientWidth || innerWidth;
    const stageLeft = slots.route.getBoundingClientRect().left;
    const f = { ...FORK.wide, w: fb.width || FORK.wide.w, h: fb.height || FORK.wide.h, halfW: HALF_W * (fb.width / stageW || 1) };
    const cx = (fb.left - stageLeft + fb.width / 2 - stageW / 2) * ((2 * HALF_W) / stageW);
    const t = tailWorld(world, f, cx);
    world.ribbon.build(t.main, t.branch);
    world.ribbon.draw(state.draw);
    updateShadows();
  };

  // The hero view, zoomed out until every labelled stop sits below the hero words: on a wide, short
  // screen the city would otherwise rise behind the lead and the buttons (the front edge stays on the
  // bottom edge, so in this orthographic view a stop's distance from the bottom shrinks by the zoom)
  const heroView = (aspect: number): View => {
    const v = heroStart();
    applyView(cam, world, v, aspect);
    const top = Math.min(...routeLabels.map((el) => project(cam, world.anchors[el.dataset.ribbonAnchor as AnchorName]).y));
    const free = (layout.copyBottom + layout.labelH + LABEL_GAP) / size[1];
    if (top < free) v.halfW *= Math.min((1 - top) / Math.max(0.05, 1 - free), MAX_ZOOM_OUT);
    return v;
  };
  // Rising while the hero is held, then a plan that pans with the page
  const routeView = (): View => {
    const aspect = size[0] / size[1];
    const y = scrollY;
    const top = plan(aspect);
    if (y < layout.held) {
      const p = clamp((y - layout.heroTop) / Math.max(1, layout.held - layout.heroTop));
      return mixView(heroView(aspect), top, smooth(clamp((p - 0.04) / 0.9)));
    }
    const pan = (y - layout.held) * ((2 * HALF_W) / size[0]);
    return { ...top, target: [top.target[0], 0, top.target[2] + pan] };
  };

  const place = (el: HTMLElement, p: { x: number; y: number }, show: boolean) => {
    el.style.translate = `${(p.x * size[0]).toFixed(1)}px ${(p.y * size[1]).toFixed(1)}px`;
    el.style.visibility = show && p.x > 0.02 && p.x < 0.98 && p.y > 0.04 && p.y < 1 ? 'visible' : 'hidden';
  };

  // The words leave while the camera rises
  const fadeCopy = () => {
    const p = clamp((scrollY - layout.heroTop) / Math.max(1, layout.held - layout.heroTop));
    const k = clamp((p - COPY_OUT.start) / COPY_OUT.length);
    copy.style.opacity = String(1 - k);
    copy.style.translate = `0 ${(-30 * k).toFixed(2)}%`;
    copy.style.visibility = k >= 1 ? 'hidden' : '';
  };

  // One result at a time: the panel on screen and the count follow the scrubbed progress
  const showCases = (p: number) => {
    panels.forEach((panel, i) => {
      const inAt = i === 0 ? -1 : (HANDOVERS[i - 1] ?? 1) + 0.03;
      const outAt = HANDOVERS[i] ?? 2;
      const fadeIn = clamp((p - inAt) / FADE);
      const fadeOut = clamp((p - outAt + 0.03) / FADE);
      const a = Math.min(fadeIn, 1 - fadeOut);
      panel.style.opacity = String(a);
      panel.style.translate = `0 ${((1 - fadeIn) * 32 - fadeOut * 24).toFixed(1)}px`;
      panel.style.visibility = a <= 0.01 ? 'hidden' : 'visible';
      panel.toggleAttribute('inert', a < 0.5);
    });
    const n = p < (HANDOVERS[0] ?? 1) ? 0 : p < (HANDOVERS[1] ?? 1) ? 1 : 2;
    if (n !== state.current) {
      state.current = n;
      if (count) count.textContent = countText(n);
      caseLabel.textContent = names[n] ?? '';
    }
  };

  let raf = 0;
  let shown = 0;
  // set when the canvas joins the page
  let drawStart = Infinity;
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };
  function tick(now: number) {
    raf = 0;
    if (document.hidden) return;
    if (state.draw < 1) {
      state.draw = easeInOut(clamp((now - drawStart) / DRAW_MS));
      world.ribbon.draw(state.draw);
      if (state.draw >= 1) updateShadows();
      kick();
    }
    fadeCopy();
    const target = clamp((scrollY - layout.casesTop) / layout.casesHeld);
    const d = target - shown;
    shown += Math.abs(d) < 1e-4 ? d : d * CASES_FOLLOW;
    if (Math.abs(d) > 1e-4) kick();
    showCases(shown);
    const next = cases.getBoundingClientRect().top <= 1 ? 'cases' : 'route';
    if (next !== mode) {
      mode = next;
      slots[mode].append(canvas);
      // Off the canvas the label is back on the static picture's --x/--y (HomeTemplate)
      if (mode === 'route') caseLabel.style.translate = '';
      measure();
    }
    if (mode === 'route') {
      if (route.getBoundingClientRect().bottom < 0) return;
      world.lightAi([0, 0, 0]);
      applyView(cam, world, routeView(), size[0] / size[1]);
      renderer.render(world.scene, cam);
      // a label never sits on the hero words while they are still on screen
      const words = Number(copy.style.opacity || 1) > 0.02 ? copy.getBoundingClientRect().bottom - slots.route.getBoundingClientRect().top : -Infinity;
      for (const el of routeLabels) {
        const p = project(cam, world.anchors[el.dataset.ribbonAnchor as AnchorName]);
        place(el, p, state.draw >= 1 && p.y * size[1] - layout.labelH > words);
      }
    } else {
      if (cases.getBoundingClientRect().bottom < 0) return;
      world.lightAi([1, clamp((shown - 0.3) / 0.08), clamp((shown - 0.63) / 0.08)]);
      applyView(cam, world, casesView(world, shown), size[0] / size[1]);
      renderer.render(world.scene, cam);
      const anchor = world.anchors.ai[state.current];
      if (anchor) place(caseLabel, project(cam, anchor), true);
    }
  }

  measure();
  caseLabel.textContent = names[0] ?? '';
  if (count) count.textContent = countText(0);
  // Compile the shaders and draw one frame before the canvas is on the page, then wait for the GPU
  // to finish it, each wait at most WAIT_LIMIT_MS (#127, #136)
  await nextTask();
  world.ribbon.draw(0);
  applyView(cam, world, routeView(), size[0] / size[1]);
  await Promise.race([renderer.compileAsync(world.scene, cam), elapsed(WAIT_LIMIT_MS)]);
  renderer.render(world.scene, cam);
  await gpuDone(renderer.getContext());

  slots.route.append(canvas);
  drawStart = performance.now() + DRAW_DELAY_MS;
  route.dataset.scene = 'ready';
  cases.dataset.scene = 'ready';
  const onResize = () => {
    measure();
    kick();
  };
  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', kick);
  // the fonts and the pictures change the heights measure() read
  void document.fonts.ready.then(onResize);
  kick();

  return () => {
    cancelAnimationFrame(raf);
    removeEventListener('scroll', kick);
    removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', kick);
    for (const p of panels) {
      p.style.removeProperty('opacity');
      p.style.removeProperty('translate');
      p.style.removeProperty('visibility');
      p.removeAttribute('inert');
    }
    copy.removeAttribute('style');
    renderer.dispose();
    canvas.remove();
    delete route.dataset.scene;
    delete cases.dataset.scene;
  };
}
