// Shared runtime for the 3D scroll scenes (M3-07, #54). Loaded only by Scene3D's dynamic import,
// after the page's load event, so three.js never sits on the critical path (ADR 0003).
// The camera is aligned with the CSS 3D fallback: --scene-angle-x/-z give the isometric view and
// --perspective the field of view. Colors come from the surface's semantic tokens.
import { Color, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { createSurface, pickTier, type SceneSurface, type Tier } from './tiers';

// Layout follows the CSS: scripts can't read @custom-media, so this is --bp-lg-down from
// src/styles/media.css. Read it live, since the viewport can cross it after the scene starts.
const narrowLayout = () => matchMedia('(width < 64rem)').matches;

// How fast the damped progress follows the scroll position, per second
const PROGRESS_DAMPING = 6;

// Fraction of the viewport the scene's center moves off the middle: to the end side on wide
// layouts, up on narrow ones once the hero has scrolled away (chapters, panel at the bottom)
const FOCUS_SHIFT = { wide: 0.22, narrow: 0.3 };
// Narrow heroes: share of the visual area's height the scene's subject fills (fitDistance)
const NARROW_FILL = 0.8;

export interface Palette {
  bg: Color;
  /** The three stops of --gradient-energy: purple, magenta, orange */
  energy: [Color, Color, Color];
  line: Color;
}

export interface Frame {
  /** Scroll progress through the scene track, 0–1, damped so it never jumps between frames */
  progress: number;
  /** Seconds since the scene started */
  time: number;
  /** Pointer position, -1–1 on both axes; stays 0 without parallax */
  pointer: { x: number; y: number };
}

export interface SceneContext {
  scene: Scene;
  camera: PerspectiveCamera;
  tier: Tier;
  palette: Palette;
  /** Camera elevation and azimuth from --scene-angle-x/-z, radians */
  view: { elevation: number; azimuth: number };
  /** Whether the page uses the narrow layout right now (--bp-lg-down) */
  isNarrow: () => boolean;
  /** Reads a unitless number token (e.g. --scene-rim-width) from the host's computed style */
  readNumber: (name: string) => number;
  /** Chapters in the track after the hero (SceneChapter, data-scene-chapter) */
  chapters: number;
  /** Scene3D's `family`: show only that product family's module (product pages) */
  family?: number;
  /**
   * Narrow layout: camera distance at which an object `size` world units tall fills the hero's
   * visual area (PageHero's data-hero-visual). Undefined on wide layouts and without one.
   */
  fitDistance: (size: number) => number | undefined;
}

export interface SceneInstance {
  update(frame: Frame): void;
  dispose(): void;
}

export type SceneFactory = (ctx: SceneContext) => SceneInstance;

/** Puts the camera at the shared isometric angle, `distance` away from `target`. */
export function placeCamera(
  camera: PerspectiveCamera,
  { target, distance, elevation, azimuth }: { target: Vector3; distance: number; elevation: number; azimuth: number },
) {
  const flat = Math.cos(elevation) * distance;
  camera.position.set(
    target.x + Math.sin(azimuth) * flat,
    target.y + Math.sin(elevation) * distance,
    target.z + Math.cos(azimuth) * flat,
  );
  camera.lookAt(target);
}

export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

const css = (el: Element, name: string) => getComputedStyle(el).getPropertyValue(name).trim();

function readNumber(el: Element, name: string): number {
  const value = css(el, name);
  const n = Number(value);
  if (value === '' || !Number.isFinite(n)) throw new Error(`expected ${name} to be a number, got "${value}"`);
  return n;
}

function readAngle(value: string): number {
  const m = /^(-?[\d.]+)deg$/.exec(value);
  if (!m) throw new Error(`expected an angle in deg, got "${value}"`);
  return (Number(m[1]) * Math.PI) / 180;
}

function readLength(value: string): number {
  const m = /^([\d.]+)(rem|px)$/.exec(value);
  if (!m) throw new Error(`expected a length in rem or px, got "${value}"`);
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return Number(m[1]) * (m[2] === 'rem' ? rem : 1);
}

function readPalette(el: Element): Palette {
  const stops = css(el, '--gradient-energy').match(/#[0-9a-f]{6}/gi);
  if (!stops || stops.length !== 3) throw new Error('--gradient-energy must have three hex stops');
  return {
    bg: new Color(css(el, '--color-bg')),
    energy: [new Color(stops[0]), new Color(stops[1]), new Color(stops[2])],
    line: new Color(css(el, '--color-border-brand')),
  };
}

/**
 * CSS rotateX(a) tilts the ground plane `a` away from the viewer, so the camera sits 90° − a above
 * it; rotateZ(b) turns the plane, which is the camera's azimuth −b around the vertical axis.
 */
function readView(el: Element) {
  return {
    elevation: Math.PI / 2 - readAngle(css(el, '--scene-angle-x')),
    azimuth: -readAngle(css(el, '--scene-angle-z')),
  };
}

/** Vertical field of view that matches CSS `perspective` for a viewport `height` px tall */
const fovFor = (height: number, perspective: number) => (2 * Math.atan(height / 2 / perspective) * 180) / Math.PI;

interface MountOptions {
  host: HTMLElement;
  /** Element whose scroll-through drives progress (the hero plus its chapters) */
  track: HTMLElement;
  factory: SceneFactory;
  /** Called once the first frame is on the canvas */
  onReady: () => void;
  family?: number;
  /** The canvas and context Scene3D created to check for WebGL, used if its tier still applies */
  surface?: SceneSurface;
}

// A task that runs longer than 50 ms blocks input, and Lighthouse counts it in TBT. Evaluating
// three.js, creating the WebGL context, building the scene, compiling its shaders and drawing the
// first frame each take tens of ms on a slow phone, so each runs in its own task (#127).
const nextTask = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

/** Resolves once the GPU has run every command issued so far, checking once per task. */
async function gpuDone(gl: WebGLRenderingContext | WebGL2RenderingContext) {
  // three.js only renders with WebGL 2; the union is @types/three's
  if (!(gl instanceof WebGL2RenderingContext)) return;
  const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
  if (!sync) return;
  gl.flush();
  // The sync status only changes between tasks, and a 0 timeout returns at once
  do await nextTask();
  while (gl.clientWaitSync(sync, 0, 0) === gl.TIMEOUT_EXPIRED);
  gl.deleteSync(sync);
}

/**
 * Starts the scene, one step per task; returns a function that stops it and frees GPU resources,
 * also while it is still starting. The canvas joins the host only once its first frame is drawn
 * (onReady), so a scene being replaced can keep playing until then.
 */
export function mount(options: MountOptions): () => void {
  let stopped = false;
  let stop: (() => void) | undefined;
  void start(options, () => stopped).then((started) => {
    if (stopped) started?.();
    else stop = started;
  });
  return () => {
    if (stopped) return;
    stopped = true;
    stop?.();
  };
}

/** Builds the scene and starts its frame loop; resolves undefined if `stopped` turns true first. */
async function start({ host, track, factory, onReady, family, surface }: MountOptions, stopped: () => boolean) {
  // Creating a context is a task of its own; without one there is no scene (a rebuild on a
  // browser that just lost WebGL). The viewport may have crossed LOW_POWER while three.js
  // downloaded, before Scene3D listens for it, so Scene3D's context may be for the wrong tier.
  const tier = pickTier();
  const created = surface?.tier === tier ? surface : createSurface(tier);
  // Leave the task that evaluated the chunk or created the context
  await nextTask();
  if (stopped() || !created) return undefined;
  const { canvas, context } = created;
  const perspective = readLength(css(host, '--perspective'));
  const renderer = new WebGLRenderer({ canvas, context });
  const palette = readPalette(host);
  renderer.setClearColor(palette.bg, 1);

  await nextTask();
  if (stopped()) {
    renderer.dispose();
    return undefined;
  }
  const scene = new Scene();
  const camera = new PerspectiveCamera(50, 1, 0.1, 400);

  // Narrow heroes frame the scene in PageHero's visual area: between the breadcrumb row (or
  // whatever bar is above the hero) and the copy, measured at scroll 0 in the host's coordinates,
  // so no header or bar height is written here. Measured again on every resize.
  const heroVisual = track.querySelector<HTMLElement>('[data-hero-visual]');
  let visual: { top: number; bottom: number; pageBottom: number } | undefined;
  const measureVisual = () => {
    const r = heroVisual?.getBoundingClientRect();
    if (!r?.height || !narrowLayout()) return undefined;
    const hostTop = host.getBoundingClientRect().top;
    return { top: r.top + scrollY - hostTop, bottom: r.bottom + scrollY - hostTop, pageBottom: r.bottom + scrollY };
  };
  const fitDistance = (size: number) => {
    const h = host.clientHeight;
    if (!visual || !h) return undefined;
    const px = (visual.bottom - visual.top) * NARROW_FILL;
    return (size * h) / (px * 2 * Math.tan((camera.fov * Math.PI) / 360));
  };

  const instance = factory({
    scene,
    camera,
    tier,
    palette,
    view: readView(host),
    isNarrow: narrowLayout,
    readNumber: (name) => readNumber(host, name),
    chapters: Math.max(1, track.querySelectorAll('[data-scene-chapter]').length),
    family,
    fitDistance,
  });

  // Where the scene's center sits on the canvas. Wide: the end side, as the static image's subject
  // (Backdrop fade="hero"). Narrow: the middle of the hero's visual area, moving up with it as the
  // page scrolls and easing to the chapters' framing as the area scrolls away.
  const applyOffset = () => {
    const { clientWidth: w, clientHeight: h } = host;
    if (!w || !h) return;
    let shift = { x: -w * FOCUS_SHIFT.wide, y: 0 };
    if (narrowLayout()) {
      const chapters = h * FOCUS_SHIFT.narrow;
      // The visual area scrolls with the page, so the scene follows it like the static image does
      const hero = visual ? h / 2 - ((visual.top + visual.bottom) / 2 - scrollY) : chapters;
      const away = visual ? smoothstep(0, visual.pageBottom, scrollY) : 1;
      shift = { x: 0, y: hero + (chapters - hero) * away };
    }
    camera.setViewOffset(w, h, shift.x, shift.y, w, h);
    camera.updateProjectionMatrix();
  };

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = host;
    // A hidden host measures 0×0; keep the last size until it shows again
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio, tier.maxDpr));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = fovFor(h, perspective);
    visual = measureVisual();
    applyOffset();
  };
  resize();

  // Compile the shaders and draw one frame before the canvas is on the page, then wait for the GPU
  // to finish it. The first draw is when the driver finishes building the shaders (SwiftShader
  // compiles them to machine code then); on the page, the compositor would read the canvas back
  // and block the main thread until it's done.
  await nextTask();
  if (!stopped()) {
    await renderer.compileAsync(scene, camera);
    renderer.render(scene, camera);
    await gpuDone(renderer.getContext());
  }
  const release = () => {
    instance.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
  if (stopped()) {
    release();
    return undefined;
  }
  host.append(renderer.domElement);
  // Set here, not when the scene stops: the scene being replaced stops after this one has started
  host.dataset.sceneTier = tier.kind;

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);

  const pointer = { x: 0, y: 0 };
  const onPointer = (e: PointerEvent) => {
    pointer.x = (e.clientX / innerWidth) * 2 - 1;
    pointer.y = (e.clientY / innerHeight) * 2 - 1;
  };
  if (tier.parallax) addEventListener('pointermove', onPointer, { passive: true });

  // Progress runs from the track's top at the viewport top to its bottom at the viewport bottom
  const progress = () => {
    const r = track.getBoundingClientRect();
    const span = r.height - innerHeight;
    return span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
  };

  // Scenes see a damped progress: wheel and keyboard scrolling arrive in steps, and feeding those
  // straight into the camera reads as cuts. After a pause (hidden tab, track off screen) the large
  // time step lets it catch up at once.
  const start = performance.now();
  let last = start;
  let damped = progress();
  let raf = 0;
  let visible = true;
  let ready = false;
  const frame = (now: number) => {
    raf = 0;
    damped += (progress() - damped) * (1 - Math.exp(((last - now) / 1000) * PROGRESS_DAMPING));
    last = now;
    applyOffset();
    instance.update({ progress: damped, time: (now - start) / 1000, pointer });
    renderer.render(scene, camera);
    if (!ready) {
      ready = true;
      onReady();
    }
    schedule();
  };
  const schedule = () => {
    if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
  };

  // Stop drawing while the track is off screen or the tab is hidden
  const io = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false;
    host.hidden = !visible;
    schedule();
  });
  io.observe(track);
  document.addEventListener('visibilitychange', schedule);
  schedule();

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    resizeObserver.disconnect();
    removeEventListener('pointermove', onPointer);
    document.removeEventListener('visibilitychange', schedule);
    release();
  };
}
