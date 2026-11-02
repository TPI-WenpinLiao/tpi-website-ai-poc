// ribbon-route's three.js world (#166 concept, built for production in #167; ADR 0003「ribbon-route」).
// One white isometric system map and one ribbon: it leaves the core system, runs past the products,
// the AI model and the new services, leaves the map at its front edge and, below it, forks into two
// branches that end on the two industry entries. The live home page (page.ts) and the static
// pictures (capture.ts, scripts/design/ribbon-capture.mjs) render this same world.
// Ported from docs/strategy/concepts/ribbon-route/assets/scene.src.js; GSAP is gone (page.ts).
import {
  BoxGeometry,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  DirectionalLight,
  DoubleSide,
  Float32BufferAttribute,
  Fog,
  HemisphereLight,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Object3D,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShadowMaterial,
  Uint32BufferAttribute,
  Vector3,
  type Material,
} from 'three';

/** The colors the world is painted with, from tokens.css (--map-*, --ribbon-*) */
export interface MapPalette {
  ground: Color;
  tint: Color;
  legacy: Color;
  core: Color;
  start: Color;
  mid: Color;
  end: Color;
}

/** Token names of each palette entry; page.ts reads them from the computed style, capture from tokens.css */
export const PALETTE_TOKENS = {
  ground: '--map-ground',
  tint: '--map-block-tint',
  legacy: '--map-legacy',
  core: '--map-core',
  start: '--ribbon-start',
  mid: '--ribbon-mid',
  end: '--ribbon-end',
} as const satisfies Record<keyof MapPalette, string>;

export const paletteFrom = (read: (token: string) => string): MapPalette => {
  const entries = Object.entries(PALETTE_TOKENS).map(([key, token]) => {
    const value = read(token).trim();
    // The built CSS shortens #ffffff to #fff
    if (!/^#(?:[0-9a-f]{3}){1,2}$/i.test(value)) throw new Error(`${token} must be a hex color, got "${value}"`);
    return [key, new Color(value)];
  });
  return Object.fromEntries(entries) as MapPalette;
};

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (t: number) => t * t * (3 - 2 * t);
const rad = (d: number) => (d * Math.PI) / 180;
const rng = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};

// ---- the route
// x right, z towards the viewer (down the page in the plan view), y up. [x, z, lift]
type RoutePoint = readonly [number, number, number?];
const CITY_ROUTE: RoutePoint[] = [
  [-9.1, 2.0, 0.55], [-7.6, 2.0, 0.42], [-6.2, 1.5, 0.44], [-5.0, 0.6, 0.56], [-3.6, 0.3, 0.5],
  [-2.1, 0.8, 0.36], [-0.8, 1.9, 0.42], [0.8, 2.4, 0.52], [2.5, 2.0, 0.6], [4.0, 1.2, 0.46], [5.6, 1.0, 0.4],
  [7.1, 1.9, 0.44], [7.9, 3.6, 0.5], [7.4, 5.4, 0.46], [5.8, 6.5, 0.42], [3.6, 7.1, 0.44], [1.8, 8.1, 0.46],
  [1.0, 9.4, 0.46], [0.8, 10.6, 0.45],
];
const CORE = [-9.75, 2.0] as const;
/** The front edge of the blocks: the hero's bottom edge in every view */
export const CITY_EDGE = 10.45;
const RIBBON_W = 0.36;
export const LIFT = 0.45;
/** Half the visible width of the hero and plan views, in world units */
export const HALF_W = 10.6;

/** The fork picture's box: pixel size, and the branch ends as fractions of its width */
export interface ForkBox {
  w: number;
  h: number;
  left: number;
  right: number;
  halfW: number;
}
// The two branch ends sit on the left edge of the two entries' columns (HomeTemplate's grid)
export const FORK = {
  wide: { w: 2560, h: 720, left: 0.046, right: 0.521, halfW: HALF_W },
  tall: { w: 900, h: 720, left: 0.093, right: 0.54, halfW: 6.4 },
} as const satisfies Record<string, ForkBox>;

/** The tail in box fractions [fx, fy]: from the exit at the top over to the right column, the fork, two ends */
function tailFractions(fe: number, f: ForkBox) {
  const mid = lerp(fe, f.right, 0.5);
  return {
    main: [[fe, 0.12], [lerp(fe, f.right, 0.12), 0.19], [mid, 0.27], [lerp(fe, f.right, 0.88), 0.35], [f.right, 0.43], [f.right, 0.5], [f.right, 0.72], [f.right, 0.935]],
    branch: [[f.right, 0.5], [f.right, 0.58], [f.right - 0.012, 0.65], [f.right - 0.05, 0.7], [lerp(f.right, f.left, 0.5), 0.73], [f.left + 0.05, 0.76], [f.left + 0.012, 0.8], [f.left, 0.86], [f.left, 0.935]],
  } as { main: [number, number][]; branch: [number, number][] };
}

const v3 = (a: RoutePoint) => new Vector3(a[0], a[2] ?? LIFT, a[1]);

function spaced(curve: CatmullRomCurve3, step: number) {
  const length = curve.getLength();
  return { pts: curve.getSpacedPoints(Math.max(20, Math.round(length / step))), length };
}

/** A flat band along pts, banked into its bends, colored along its length, its far end cut on a slant */
function ribbonGeometry(pts: Vector3[], colorAt: (u: number) => Color) {
  const n = pts.length;
  const at = (i: number) => pts[clamp(i, 0, n - 1)] as Vector3;
  const T = pts.map((_, i) => at(i + 1).clone().sub(at(i - 1)).normalize());
  const tan = (i: number) => T[clamp(i, 0, n - 1)] as Vector3;
  const bend = T.map((_, i) => {
    const a = tan(i - 3);
    const b = tan(i + 3);
    return a.x * b.z - a.z * b.x;
  });
  const bank = bend.map((_, i) => {
    let s = 0;
    let c = 0;
    for (let j = Math.max(0, i - 8); j <= Math.min(n - 1, i + 8); j++) {
      s += bend[j] ?? 0;
      c++;
    }
    // flat on the blank ground below the map (the plan view would show a bank as a pinch)
    return clamp((-s / c) * 2.4, -0.7, 0.7) * (1 - smooth(clamp((at(i).z - CITY_EDGE + 0.6) / 0.8)));
  });
  const pos: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  const up = new Vector3(0, 1, 0);
  const side = new Vector3();
  const lift = new Vector3();
  for (let i = 0; i < n; i++) {
    const t = tan(i);
    side.set(-t.z, 0, t.x).normalize();
    lift.crossVectors(t, side).normalize();
    if (lift.dot(up) < 0) lift.negate();
    const b = bank[i] ?? 0;
    const s = side.clone().multiplyScalar(Math.cos(b)).addScaledVector(lift, Math.sin(b));
    const half = RIBBON_W / 2;
    const L = at(i).clone().addScaledVector(s, half);
    const R = at(i).clone().addScaledVector(s, -half);
    // the logo's slanted cut
    if (i === n - 1) {
      L.addScaledVector(t, RIBBON_W * 0.42);
      R.addScaledVector(t, -RIBBON_W * 0.42);
    }
    pos.push(L.x, L.y, L.z, R.x, R.y, R.z);
    const c = colorAt(i / (n - 1));
    col.push(c.r, c.g, c.b, c.r, c.g, c.b);
    if (i < n - 1) {
      const a = 2 * i;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new Float32BufferAttribute(col, 3));
  g.setIndex(new Uint32BufferAttribute(idx, 1));
  g.computeVertexNormals();
  return g;
}

/** Color stops along the city route */
const ramp = (stops: [number, Color][]) => (u: number) => {
  for (let i = 1; i < stops.length; i++) {
    const [b, cb] = stops[i] as [number, Color];
    if (u <= b) {
      const [a, ca] = stops[i - 1] as [number, Color];
      return ca.clone().lerp(cb, smooth(clamp((u - a) / (b - a || 1))));
    }
  }
  return (stops[stops.length - 1] as [number, Color])[1].clone();
};

/** Mixes some of the unlit color back in, so the ribbon reads as flat brand color under the light */
function flatter<M extends Material>(mat: M, amount: number) {
  mat.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', `outgoingLight = mix(outgoingLight, diffuseColor.rgb, ${amount.toFixed(2)});\n#include <opaque_fragment>`);
  };
  return mat;
}

/** Darkens the bottom of each block (a cheap ambient occlusion) */
function occluded<M extends Material>(mat: M) {
  mat.onBeforeCompile = (sh) => {
    sh.vertexShader = `varying float vAoY;\n${sh.vertexShader.replace(
      '#include <project_vertex>',
      `#include <project_vertex>
      vec4 aoP = vec4(transformed, 1.0);
      #ifdef USE_INSTANCING
        aoP = instanceMatrix * aoP;
      #endif
      vAoY = (modelMatrix * aoP).y;`,
    )}`;
    sh.fragmentShader = `varying float vAoY;\n${sh.fragmentShader.replace(
      '#include <color_fragment>',
      `#include <color_fragment>
      diffuseColor.rgb *= mix(0.74, 1.0, smoothstep(0.0, 0.42, vAoY));`,
    )}`;
  };
  return mat;
}

interface Block {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
}

/** The blocks the HTML labels hang from */
export type AnchorName = 'core' | 'legacy' | 'product' | 'model' | 'service';
export const PRODUCTS = ['digirunner', 'viki', 'gadodido', 'greenswift'] as const;
export type ProductName = (typeof PRODUCTS)[number];

export interface Ribbon {
  build(tailMain: RoutePoint[], tailBranch: RoutePoint[]): void;
  /** k = 0…1 draws the city route (the load animation); at 1 the tail and the branch are there too */
  draw(k: number): void;
}

export interface World {
  scene: Scene;
  ground: Mesh<PlaneGeometry, ShadowMaterial>;
  ribbon: Ribbon;
  exit: Vector3;
  anchors: Record<AnchorName, Vector3> & { ai: Vector3[] };
  /** Lights the three AI result blocks, 0–1 each */
  lightAi(levels: readonly number[]): void;
  /** The centre of a product block, for a close-up */
  product(name: ProductName): Vector3;
  /** The magenta block inside the wall (the OrientAI picture) */
  enclosure: Vector3;
  aiBlocks: { x: number; z: number }[];
  palette: MapPalette;
}

export function buildWorld(palette: MapPalette): World {
  const scene = new Scene();
  scene.background = palette.ground.clone();
  scene.fog = new Fog(palette.ground.clone(), 60, 80);

  const cityCurve = new CatmullRomCurve3(CITY_ROUTE.map(v3), false, 'centripetal');
  const city = spaced(cityCurve, 0.04);
  const cityPt = (i: number) => city.pts[clamp(i, 0, city.pts.length - 1)] as Vector3;
  const exit = cityPt(city.pts.length - 1).clone();
  const cityColor = ramp([
    [0, palette.start], [0.3, palette.start], [0.4, palette.mid], [0.6, palette.mid], [0.7, palette.end], [1, palette.end],
  ]);

  const ribbonMat = flatter(new MeshLambertMaterial({ vertexColors: true, side: DoubleSide }), 0.62);
  const main = new Mesh(new BufferGeometry(), ribbonMat);
  const branch = new Mesh(new BufferGeometry(), ribbonMat);
  for (const m of [main, branch]) {
    m.castShadow = true;
    m.frustumCulled = false;
    scene.add(m);
  }
  let mainSegs = 0;
  let citySegs = 0;
  const ribbon: Ribbon = {
    build(tailMain, tailBranch) {
      const all = [...CITY_ROUTE.slice(0, -1).map(v3), ...tailMain.map(v3)];
      const sp = spaced(new CatmullRomCurve3(all, false, 'chordal'), 0.04);
      const cityShare = city.length / sp.length;
      main.geometry.dispose();
      main.geometry = ribbonGeometry(sp.pts, (u) => (u <= cityShare ? cityColor(u / cityShare) : palette.end.clone()));
      mainSegs = sp.pts.length - 1;
      citySegs = Math.round(cityShare * mainSegs);
      const b = spaced(new CatmullRomCurve3(tailBranch.map(v3), false, 'chordal'), 0.04);
      branch.geometry.dispose();
      branch.geometry = ribbonGeometry(b.pts, () => palette.end.clone());
    },
    draw(k) {
      const segs = k >= 1 ? mainSegs : Math.floor(k * citySegs);
      main.geometry.setDrawRange(0, segs * 6);
      main.visible = segs > 0;
      branch.visible = k >= 1;
    },
  };

  const distToRoute = (x: number, z: number) => {
    let d = Infinity;
    for (let i = 0; i < city.pts.length; i += 2) {
      const p = cityPt(i);
      d = Math.min(d, Math.hypot(p.x - x, p.z - z));
    }
    return d;
  };
  const sideOf = (u: number, s: number) => {
    const i = Math.round(u * (city.pts.length - 1));
    const t = cityPt(i + 2).clone().sub(cityPt(i - 2)).normalize();
    const p = cityPt(i);
    return new Vector3(p.x - t.z * s, 0, p.z + t.x * s);
  };

  // the blocks the scene names, placed first; the city fills in around them
  const specials: (Block & { kind: string; index?: number; name?: ProductName })[] = [];
  const special = (kind: string, x: number, z: number, w: number, d: number, h: number, extra: { index?: number; name?: ProductName } = {}) =>
    specials.push({ kind, x, z, w, d, h, ...extra });
  special('core', CORE[0], CORE[1], 1.05, 1.05, 1.5);
  const aiBlocks = [0.44, 0.5, 0.56].map((u, i) => {
    const p = sideOf(u, i % 2 ? -0.98 : 0.98);
    return { x: p.x, z: p.z };
  });
  aiBlocks.forEach((p, i) => special('ai', p.x, p.z, 0.72, 0.72, 0.62 + i * 0.12, { index: i }));
  const model = sideOf(0.36, -1.02);
  special('model', model.x, model.z, 0.8, 0.8, 0.95);
  const productAt: Record<ProductName, Vector3> = {
    digirunner: sideOf(0.1, -0.98),
    viki: sideOf(0.2, 0.98),
    gadodido: sideOf(0.29, -0.98),
    greenswift: sideOf(0.66, 0.98),
  };
  for (const name of PRODUCTS) special('product', productAt[name].x, productAt[name].z, 0.7, 0.7, 0.8, { name });
  special('legacy', -6.9, 3.5, 0.9, 0.9, 1.25);
  const enclosure = new Vector3(10.4, 0, -5.4);
  special('enclosed', enclosure.x, enclosure.z, 0.7, 0.7, 0.55);
  for (const [dx, dz] of [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]] as const) {
    special('wall', enclosure.x + dx * 1.15, enclosure.z + dz * 1.15, 0.8, 0.8, 0.95 + ((dx + dz + 2) % 3) * 0.1);
  }

  const r = rng(20051108);
  const blocks: (Block & { tint: number })[] = [];
  for (let i = -15; i <= 15; i++) {
    for (let j = -10; j <= 10; j++) {
      const skip = r() < 0.07;
      const w = 0.54 + r() * 0.18;
      const d = 0.54 + r() * 0.18;
      let h = 0.3 + Math.pow(r(), 2.3) * 1.55;
      if (r() < 0.05) h += 0.9;
      const x = i + (r() - 0.5) * 0.1;
      const z = j + (r() - 0.5) * 0.1;
      const tint = r();
      if (skip) continue;
      const dr = distToRoute(x, z);
      if (dr < 0.68) continue;
      // the blocks along the route stay low, so the ribbon reads
      if (dr < 1.45) h = Math.min(h, 0.3 + (dr - 0.68) * 0.35);
      if (specials.some((s) => Math.abs(s.x - x) < (s.w + w) / 2 + 0.12 && Math.abs(s.z - z) < (s.d + d) / 2 + 0.12)) continue;
      blocks.push({ x, z: Math.min(z, CITY_EDGE - d / 2), w, d, h, tint });
    }
  }
  // the new services: the regular blocks beside the orange stretch get orange roofs
  const services: Block[] = [];
  const servicesAt = [sideOf(0.7, 1.3), sideOf(0.75, 1.3), sideOf(0.72, -1.3)];
  for (let k = blocks.length - 1; k >= 0; k--) {
    const b = blocks[k] as Block;
    if (servicesAt.some((e) => Math.hypot(e.x - b.x, e.z - b.z) < 0.7)) {
      services.push(b);
      blocks.splice(k, 1);
    }
  }

  const box = new BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
  const cityMesh = new InstancedMesh(box, occluded(new MeshLambertMaterial({ color: 0xffffff })), blocks.length);
  const o = new Object3D();
  blocks.forEach((b, i) => {
    o.position.set(b.x, 0, b.z);
    o.scale.set(b.w, b.h, b.d);
    o.updateMatrix();
    cityMesh.setMatrixAt(i, o.matrix);
    cityMesh.setColorAt(i, palette.ground.clone().lerp(palette.tint, b.tint * 0.9));
  });
  cityMesh.castShadow = true;
  cityMesh.receiveShadow = true;
  scene.add(cityMesh);

  const sideMat = occluded(new MeshLambertMaterial({ color: 0xffffff }));
  const roof = (c: Color) => new MeshBasicMaterial({ color: c.clone() });
  const withRoof = (top: Material) => [sideMat, sideMat, top, sideMat, sideMat, sideMat];
  const place = (b: Block, mats: Material | Material[]) => {
    const m = new Mesh(box, mats);
    m.position.set(b.x, 0, b.z);
    m.scale.set(b.w, b.h, b.d);
    m.castShadow = true;
    m.receiveShadow = true;
    scene.add(m);
    return m;
  };
  const orangeRoof = roof(palette.end);
  const purpleRoof = roof(palette.start);
  const magentaRoof = roof(palette.mid);
  for (const b of services) place(b, withRoof(orangeRoof));
  const aiTops: MeshBasicMaterial[] = [];
  const named: Partial<Record<string, Block>> = {};
  for (const s of specials) {
    if (s.kind === 'core') place(s, occluded(new MeshLambertMaterial({ color: palette.core })));
    else if (s.kind === 'legacy') place(s, occluded(new MeshLambertMaterial({ color: palette.legacy })));
    else if (s.kind === 'model') place(s, withRoof(magentaRoof));
    else if (s.kind === 'ai') {
      const top = roof(palette.ground);
      aiTops[s.index ?? 0] = top;
      place(s, withRoof(top));
    } else if (s.kind === 'product') place(s, withRoof(purpleRoof));
    else if (s.kind === 'enclosed') place(s, withRoof(magentaRoof));
    else place(s, sideMat);
    if (!named[s.kind] || s.name === 'viki') named[s.kind] = s;
  }
  // the service block nearest the first of the three carries the label
  const sc = servicesAt[0] as Vector3;
  const service = services.reduce<Block | undefined>(
    (best, b) => (!best || Math.hypot(b.x - sc.x, b.z - sc.z) < Math.hypot(best.x - sc.x, best.z - sc.z) ? b : best),
    undefined,
  );

  const ground = new Mesh(new PlaneGeometry(160, 160).rotateX(-Math.PI / 2), new ShadowMaterial({ color: palette.core, opacity: 0.16 }));
  ground.receiveShadow = true;
  scene.add(ground);

  scene.add(new HemisphereLight(0xffffff, palette.legacy, 2.1));
  const sun = new DirectionalLight(0xffffff, 1.55);
  sun.position.set(-7, 14, 13);
  sun.target.position.set(0, 0, 4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18, near: 1, far: 60 });
  sun.shadow.radius = 3;
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.02;
  scene.add(sun, sun.target);

  const top = (b: Block | undefined) => {
    if (!b) throw new Error('ribbon world: a labelled block is missing');
    return new Vector3(b.x, b.h, b.z);
  };
  const aiSpecials = specials.filter((s) => s.kind === 'ai').sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  return {
    scene,
    ground,
    ribbon,
    exit,
    anchors: { core: top(named.core), legacy: top(named.legacy), product: top(named.product), model: top(named.model), service: top(service), ai: aiSpecials.map(top) },
    lightAi(levels) {
      aiTops.forEach((m, i) => m.color.copy(palette.ground).lerp(palette.mid, levels[i] ?? 0));
    },
    product: (name) => productAt[name].clone(),
    enclosure,
    aiBlocks,
    palette,
  };
}

// ---- the camera
/** A view: target [x, y, z], pitch and yaw in degrees, halfW = half the visible width in world units,
 * sx / sy = where the target sits on screen (-1…1), fog = where the back rows fade */
export interface View {
  target: [number, number, number];
  pitch: number;
  yaw: number;
  halfW: number;
  sx: number;
  sy: number;
  fog?: number;
}

export const heroStart = (): View => ({ target: [-0.9, 0, CITY_EDGE], pitch: 21, yaw: -6, halfW: HALF_W, sx: 0, sy: -1, fog: 9.5 });
export const plan = (aspect: number): View => ({ target: [0, 0, CITY_EDGE - HALF_W / aspect], pitch: 90, yaw: 0, halfW: HALF_W, sx: 0, sy: 0 });
/** The close-up that walks the magenta stretch past the three AI blocks, p = 0…1 */
export const casesView = (world: World, p: number): View => {
  const a = world.aiBlocks[0] as { x: number; z: number };
  const b = world.aiBlocks[2] as { x: number; z: number };
  return { target: [lerp(a.x - 0.5, b.x + 0.3, p), 0, lerp(a.z, b.z, p)], pitch: 44, yaw: lerp(-26, -14, p), halfW: 3.4, sx: 0, sy: -0.15 };
};

export const mixView = (a: View, b: View, t: number): View => ({
  fog: a.fog !== undefined || b.fog !== undefined ? lerp(a.fog ?? 0, b.fog ?? 0, t) : undefined,
  target: [lerp(a.target[0], b.target[0], t), lerp(a.target[1], b.target[1], t), lerp(a.target[2], b.target[2], t)],
  pitch: lerp(a.pitch, b.pitch, t),
  yaw: lerp(a.yaw, b.yaw, t),
  halfW: lerp(a.halfW, b.halfW, t),
  sx: lerp(a.sx, b.sx, t),
  sy: lerp(a.sy, b.sy, t),
});

const DIST = 60;
export function applyView(cam: OrthographicCamera, world: World, v: View, aspect: number) {
  const halfH = v.halfW / aspect;
  cam.left = -v.halfW;
  cam.right = v.halfW;
  cam.top = halfH;
  cam.bottom = -halfH;
  const pitch = rad(Math.min(v.pitch, 89.99));
  const yaw = rad(v.yaw);
  const target = new Vector3(...v.target);
  const back = new Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
  cam.position.copy(target).addScaledVector(back, DIST);
  cam.up.set(-Math.sin(yaw), 0, -Math.cos(yaw));
  cam.lookAt(target);
  cam.updateMatrixWorld();
  const right = new Vector3().setFromMatrixColumn(cam.matrixWorld, 0);
  const up = new Vector3().setFromMatrixColumn(cam.matrixWorld, 1);
  cam.position.addScaledVector(right, -v.sx * v.halfW).addScaledVector(up, -v.sy * halfH);
  cam.near = 1;
  cam.far = 160;
  cam.updateProjectionMatrix();
  cam.updateMatrixWorld();
  // the back rows dissolve into the ground color when the camera is low; none when it looks straight down
  const high = smooth(clamp((v.pitch - 40) / 40));
  const fog = world.scene.fog as Fog;
  fog.near = DIST + lerp(v.fog ?? 0.4 * (v.halfW / 12), 80, high);
  fog.far = fog.near + lerp(v.fog ? 7 : 6 * (v.halfW / 12) + 1, 80, high);
  world.ground.material.opacity = lerp(0.17, 0.05, high);
}

/** Where a world point lands on the canvas, 0–1 from the top left */
export function project(cam: OrthographicCamera, p: Vector3) {
  const v = p.clone().project(cam);
  return { x: (v.x + 1) / 2, y: (1 - v.y) / 2 };
}

/** World points of the tail for a fork box whose top edge is the city edge, centred on x = cx */
export function tailWorld(world: World, f: ForkBox, cx: number, fe?: number) {
  const boxH = 2 * f.halfW * (f.h / f.w);
  const at = ([fx, fy]: [number, number]): RoutePoint => [cx + (fx - 0.5) * 2 * f.halfW, CITY_EDGE + fy * boxH, LIFT];
  const t = tailFractions(fe ?? 0.5 + (world.exit.x - cx) / (2 * f.halfW), f);
  return { main: t.main.map(at), branch: t.branch.map(at) };
}

export const newCamera = () => new OrthographicCamera(-1, 1, 1, -1, 1, 160);
