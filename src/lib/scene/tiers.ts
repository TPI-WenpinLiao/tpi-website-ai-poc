// Rendering tiers and the WebGL context for the 3D scenes (ADR 0003). Kept apart from runtime.ts,
// which carries three.js: Scene3D creates the context before it downloads that chunk, both to
// check for WebGL and so the renderer doesn't create a second one (#127).

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

// The rendering budget drops on narrow layouts (--bp-lg-down in src/styles/media.css; scripts
// can't read @custom-media) and on touch devices, whatever their layout (a landscape tablet gets
// the desktop layout but the mobile tier). Picked when the scene starts; Scene3D restarts the
// scene when this query flips (a window resized across the breakpoint).
export const LOW_POWER = '(width < 64rem), (pointer: coarse)';

export const pickTier = (): Tier => (matchMedia(LOW_POWER).matches ? TIERS.mobile : TIERS.desktop);

/** A canvas with the WebGL 2 context a scene renders into, created for `tier`. */
export interface SceneSurface {
  tier: Tier;
  canvas: HTMLCanvasElement;
  context: WebGL2RenderingContext;
}

/**
 * Creates the canvas and its WebGL 2 context (three.js renders only with WebGL 2), with the
 * attributes WebGLRenderer asks for when it creates the context itself (three r186); undefined
 * when the browser can't.
 */
export function createSurface(tier: Tier): SceneSurface | undefined {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('webgl2', {
    alpha: true,
    depth: true,
    stencil: false,
    antialias: tier.antialias,
    premultipliedAlpha: true,
    preserveDrawingBuffer: false,
    powerPreference: 'low-power',
  });
  return context ? { tier, canvas, context } : undefined;
}
