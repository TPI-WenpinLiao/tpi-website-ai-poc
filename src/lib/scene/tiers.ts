// When the home page plays the live ribbon scene, and the WebGL context it renders into (ADR 0003
// 「ribbon-route」, #167). Kept apart from ribbon/runtime.ts, which carries three.js: HomeTemplate
// creates the context before it downloads that chunk, to check for WebGL 2 (#127).

// Desktop only: a layout at least 64rem wide (--bp-lg-up in src/styles/media.css; scripts can't
// read @custom-media) and not a touch screen. Written as "not coarse", not "fine": headless
// Chromium reports pointer: none. HomeTemplate's inline script reads this query (define:vars) before
// the first paint, so the page takes the live layout (html.want-3d) without a shift.
export const LIVE = '(width >= 64rem) and (not (pointer: coarse)) and (prefers-reduced-motion: no-preference)';

// Network Information API is not in TypeScript's DOM lib. HomeTemplate's inline script can't import
// this, so it repeats the check (`c && c.saveData`): change both together
export const saveData = () => {
  const connection: unknown = Reflect.get(navigator, 'connection');
  return typeof connection === 'object' && connection !== null && Reflect.get(connection, 'saveData') === true;
};

export const wantsLive = () => matchMedia(LIVE).matches && !saveData();

/** A canvas with the WebGL 2 context the scene renders into; undefined when the browser can't */
export function createSurface(): { canvas: HTMLCanvasElement; context: WebGL2RenderingContext } | undefined {
  const canvas = document.createElement('canvas');
  // The attributes WebGLRenderer asks for when it creates the context itself (three r186)
  const context = canvas.getContext('webgl2', {
    alpha: false,
    depth: true,
    stencil: false,
    antialias: true,
    premultipliedAlpha: true,
    preserveDrawingBuffer: false,
    powerPreference: 'high-performance',
  });
  return context ? { canvas, context } : undefined;
}
