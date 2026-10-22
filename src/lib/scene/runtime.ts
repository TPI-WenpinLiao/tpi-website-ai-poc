// Shared runtime for the 3D scroll scenes (M3-07, #54). Loaded only by Scene3D's dynamic import,
// after the page's load event, so three.js never sits on the critical path (ADR 0003).
// The camera is aligned with the CSS 3D fallback: --scene-angle-x/-z give the isometric view and
// --perspective the field of view. Colors come from the surface's semantic tokens.
import { Color, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';

/** Rendering budget per device class; mobile is the degraded tier (#54 acceptance). */
export interface Tier {
  kind: 'desktop' | 'mobile';
  /** Cap on devicePixelRatio */
  maxDpr: number;
  /** Multiplier for particle and block counts */
  density: number;
  antialias: boolean;
  /** Camera follows the pointer */
  parallax: boolean;
  /** Camera path: 'orbit' moves on several axes, 'dolly' only along one */
  path: 'orbit' | 'dolly';
}

export const TIERS = {
  desktop: { kind: 'desktop', maxDpr: 2, density: 1, antialias: true, parallax: true, path: 'orbit' },
  mobile: { kind: 'mobile', maxDpr: 1.5, density: 0.35, antialias: false, parallax: false, path: 'dolly' },
} as const satisfies Record<Tier['kind'], Tier>;

// Layout follows the CSS: scripts can't read @custom-media, so this is --bp-lg-down from
// src/styles/media.css. Read it live, since the viewport can cross it after the scene starts.
const narrowLayout = () => matchMedia('(width < 64rem)').matches;
// The rendering budget also drops on touch devices, whatever their layout (a landscape tablet
// gets the desktop layout but the mobile tier). Picked once, when the scene starts.
const LOW_POWER = '(width < 64rem), (pointer: coarse)';

// How fast the damped progress follows the scroll position, per second
const PROGRESS_DAMPING = 6;

// Fraction of the viewport the scene's center moves off the middle
const FOCUS_SHIFT = { wide: 0.22, narrow: 0.3 };

export const pickTier = (): Tier => (matchMedia(LOW_POWER).matches ? TIERS.mobile : TIERS.desktop);

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
}

/** Starts the scene; returns a function that stops it and frees GPU resources. */
export function mount({ host, track, factory, onReady }: MountOptions): () => void {
  const tier = pickTier();
  const perspective = readLength(css(host, '--perspective'));
  const renderer = new WebGLRenderer({ antialias: tier.antialias, powerPreference: 'low-power' });
  const palette = readPalette(host);
  renderer.setClearColor(palette.bg, 1);
  host.append(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(50, 1, 0.1, 400);
  const instance = factory({
    scene,
    camera,
    tier,
    palette,
    view: readView(host),
    isNarrow: narrowLayout,
    readNumber: (name) => readNumber(host, name),
  });

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = host;
    // A hidden host measures 0×0; keep the last size until it shows again
    if (!w || !h) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio, tier.maxDpr));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = fovFor(h, perspective);
    // Center the scene where the static image's subject is: the end side on wide screens, the
    // upper part on narrow ones (Backdrop fade="hero")
    const shift = narrowLayout() ? { x: 0, y: h * FOCUS_SHIFT.narrow } : { x: -w * FOCUS_SHIFT.wide, y: 0 };
    camera.setViewOffset(w, h, shift.x, shift.y, w, h);
    camera.updateProjectionMatrix();
  };
  resize();
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
    instance.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
