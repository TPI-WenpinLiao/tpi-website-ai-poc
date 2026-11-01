// ribbon-route: the system map and the brand ribbon (#166 round 4, docs/strategy/concepts/directions.md;
// revised 2026-11-01 after the user's notes, README「修正紀錄」).
//
// One ribbon for the whole page. It leaves the core system, runs through the city past the products, the
// AI model and the new services, leaves the map at its front edge, and on the white ground of section 2
// forks into two branches that end on the two industry entries. One three.js world, two places to show it:
//
//   route  the hero and section 2 share one sticky canvas (#route .route__stage). While the hero is held,
//          the camera rises from 31° to straight above; after that the camera pans with the page, one CSS
//          pixel to one pixel of map, so the map, the ribbon's tail and the section's text scroll together.
//          The tail and the fork are built from the box of the fork picture (.fork__img), the same shape
//          the static picture shows, so both versions end the branches on the same two entries.
//   cases  a framed close-up (#cases .cases__slot) that walks the magenta stretch while the section is
//          held; the block of the result on screen lights up and an HTML label names its work.
//
// Loaded only on desktop with motion allowed (the inline script in index.html decides). Without WebGL 2
// it removes html.want-3d and marks the scenes .is-rest, so the static pictures show instead.
// ?capture renders named views for the static pictures (capture.mjs) and skips the page.
import {
  WebGLRenderer, Scene, OrthographicCamera, Color, Fog, Vector3,
  BoxGeometry, PlaneGeometry, BufferGeometry, Float32BufferAttribute, Uint32BufferAttribute,
  InstancedMesh, Mesh, MeshLambertMaterial, MeshBasicMaterial, ShadowMaterial, Object3D,
  DirectionalLight, HemisphereLight, CatmullRomCurve3, DoubleSide, PCFShadowMap, SRGBColorSpace, NoToneMapping,
} from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// tokens.css
const HEX = {
  ink0: '#ffffff', ink50: '#f6f5fa', ink100: '#ecebf3', ink200: '#dcdae6', ink600: '#534e69', ink700: '#3a3550',
  purple500: '#7d45a3', magenta500: '#b824d1', orange500: '#ff6329',
};
const C = Object.fromEntries(Object.entries(HEX).map(([k, v]) => [k, new Color(v)]));

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const rad = (d) => (d * Math.PI) / 180;
const rng = (seed) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

// ---------------------------------------------------------------- the route
// x right, z towards the viewer (down the page in the plan view), y up. [x, z, lift]
const CITY_ROUTE = [[-9.1, 2.0, 0.55], [-7.6, 2.0, 0.42], [-6.2, 1.5, 0.44], [-5.0, 0.6, 0.56], [-3.6, 0.3, 0.5],
  [-2.1, 0.8, 0.36], [-0.8, 1.9, 0.42], [0.8, 2.4, 0.52], [2.5, 2.0, 0.6], [4.0, 1.2, 0.46], [5.6, 1.0, 0.4],
  [7.1, 1.9, 0.44], [7.9, 3.6, 0.5], [7.4, 5.4, 0.46], [5.8, 6.5, 0.42], [3.6, 7.1, 0.44], [1.8, 8.1, 0.46],
  [1.0, 9.4, 0.46], [0.8, 10.6, 0.45]];
const CORE = [-9.75, 2.0];
const CITY_EDGE = 10.45; // the front edge of the blocks: the hero's bottom edge in every view
const RIBBON_W = 0.36;
const LIFT = 0.45;
const HALF_W = 10.6; // half the visible width of the hero and plan views, in world units
const LABEL_GAP = 24; // px between the hero words and the highest label
const MAX_ZOOM_OUT = 1.8;
const POSTER_LABEL = [0.566, 0.458]; // where the first AI block sits on case-1.webp (capture.mjs, labels.json)

// The fork picture's box (the static picture and, in the live page, the same box with the picture hidden).
// Fractions of the box: the two branch ends sit on the left edge of the two entries' columns.
const FORK = {
  wide: { w: 2560, h: 720, left: 0.046, right: 0.521, halfW: HALF_W },
  tall: { w: 900, h: 720, left: 0.093, right: 0.54, halfW: 6.4 },
};
/** The tail in box fractions [fx, fy]: from the entry at the top over to the right column, the fork, two ends. */
function tailFractions(fe, f) {
  const mid = lerp(fe, f.right, 0.5);
  return {
    main: [[fe, 0.12], [lerp(fe, f.right, 0.12), 0.19], [mid, 0.27], [lerp(fe, f.right, 0.88), 0.35], [f.right, 0.43], [f.right, 0.5], [f.right, 0.72], [f.right, 0.935]],
    branch: [[f.right, 0.5], [f.right, 0.58], [f.right - 0.012, 0.65], [f.right - 0.05, 0.7], [lerp(f.right, f.left, 0.5), 0.73],
      [f.left + 0.05, 0.76], [f.left + 0.012, 0.8], [f.left, 0.86], [f.left, 0.935]],
  };
}

const v3 = (a) => new Vector3(a[0], a[2] ?? LIFT, a[1]); // [x, z, lift] → Vector3(x, y, z)

/** Points spaced evenly along the curve. */
function spaced(curve, step) {
  const dense = curve.getSpacedPoints(Math.max(20, Math.round(curve.getLength() / step)));
  return { pts: dense, length: curve.getLength() };
}

/** A flat band along pts, banked into its bends, coloured along its length, its far end cut on a slant. */
function ribbonGeometry(pts, colourAt) {
  const n = pts.length;
  const T = pts.map((p, i) => pts[Math.min(n - 1, i + 1)].clone().sub(pts[Math.max(0, i - 1)]).normalize());
  const bend = T.map((t, i) => {
    const a = T[Math.max(0, i - 3)], b = T[Math.min(n - 1, i + 3)];
    return a.x * b.z - a.z * b.x;
  });
  const bank = bend.map((_, i) => {
    let s = 0, c = 0;
    for (let j = Math.max(0, i - 8); j <= Math.min(n - 1, i + 8); j++) { s += bend[j]; c++; }
    // flat on the blank ground below the map (the plan view would show a bank as a pinch)
    return clamp((-s / c) * 2.4, -0.7, 0.7) * (1 - smooth(clamp((pts[i].z - CITY_EDGE + 0.6) / 0.8)));
  });
  const pos = [], col = [], idx = [];
  const up = new Vector3(0, 1, 0), side = new Vector3(), lift = new Vector3();
  for (let i = 0; i < n; i++) {
    const t = T[i];
    side.set(-t.z, 0, t.x).normalize();
    lift.crossVectors(t, side).normalize();
    if (lift.dot(up) < 0) lift.negate();
    const s = side.clone().multiplyScalar(Math.cos(bank[i])).addScaledVector(lift, Math.sin(bank[i]));
    const half = RIBBON_W / 2;
    const L = pts[i].clone().addScaledVector(s, half), R = pts[i].clone().addScaledVector(s, -half);
    if (i === n - 1) { L.addScaledVector(t, RIBBON_W * 0.42); R.addScaledVector(t, -RIBBON_W * 0.42); } // the logo's slanted cut
    pos.push(L.x, L.y, L.z, R.x, R.y, R.z);
    const c = colourAt(i / (n - 1), pts[i]);
    col.push(c.r, c.g, c.b, c.r, c.g, c.b);
    if (i < n - 1) { const a = 2 * i; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new Float32BufferAttribute(col, 3));
  g.setIndex(new Uint32BufferAttribute(idx, 1));
  g.computeVertexNormals();
  return g;
}

/** Colour stops along the city route: [[at, Color], …]. */
const ramp = (stops) => (u) => {
  for (let i = 1; i < stops.length; i++) {
    if (u <= stops[i][0]) {
      const [a, ca] = stops[i - 1], [b, cb] = stops[i];
      return ca.clone().lerp(cb, smooth(clamp((u - a) / (b - a || 1))));
    }
  }
  return stops[stops.length - 1][1].clone();
};
const cityColour = ramp([[0, C.purple500], [0.3, C.purple500], [0.4, C.magenta500], [0.6, C.magenta500], [0.7, C.orange500], [1, C.orange500]]);

function flatter(mat, amount) {
  mat.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', `outgoingLight = mix(outgoingLight, diffuseColor.rgb, ${amount.toFixed(2)});\n#include <opaque_fragment>`);
  };
  return mat;
}
function occluded(mat) {
  mat.onBeforeCompile = (sh) => {
    sh.vertexShader = 'varying float vAoY;\n' + sh.vertexShader.replace('#include <project_vertex>', `#include <project_vertex>
      vec4 aoP = vec4(transformed, 1.0);
      #ifdef USE_INSTANCING
        aoP = instanceMatrix * aoP;
      #endif
      vAoY = (modelMatrix * aoP).y;`);
    sh.fragmentShader = 'varying float vAoY;\n' + sh.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
      diffuseColor.rgb *= mix(0.74, 1.0, smoothstep(0.0, 0.42, vAoY));`);
  };
  return mat;
}

// ---------------------------------------------------------------- the world
function buildWorld() {
  const scene = new Scene();
  scene.background = C.ink0.clone();
  scene.fog = new Fog(C.ink0.clone(), 60, 80);

  const cityCurve = new CatmullRomCurve3(CITY_ROUTE.map(v3), false, 'centripetal');
  const city = spaced(cityCurve, 0.04);
  const exit = city.pts[city.pts.length - 1].clone();

  const ribbonMat = flatter(new MeshLambertMaterial({ vertexColors: true, side: DoubleSide }), 0.62);
  const main = new Mesh(new BufferGeometry(), ribbonMat);
  const branch = new Mesh(new BufferGeometry(), ribbonMat);
  for (const m of [main, branch]) { m.castShadow = true; m.frustumCulled = false; scene.add(m); }
  const ribbon = { main, branch, cityLength: city.length, mainSegs: 0, citySegs: 0, branchSegs: 0 };

  /** Rebuilds the ribbon: the city route, then the tail and the branch through world points. */
  ribbon.build = (tailMain, tailBranch) => {
    const all = [...CITY_ROUTE.slice(0, -1).map(v3), ...tailMain.map(v3)];
    const curve = new CatmullRomCurve3(all, false, 'chordal');
    const sp = spaced(curve, 0.04);
    const cityShare = city.length / sp.length;
    main.geometry.dispose();
    main.geometry = ribbonGeometry(sp.pts, (u) => (u <= cityShare ? cityColour(u / cityShare) : C.orange500.clone()));
    ribbon.mainSegs = sp.pts.length - 1;
    ribbon.citySegs = Math.round(cityShare * ribbon.mainSegs);
    const b = spaced(new CatmullRomCurve3(tailBranch.map(v3), false, 'chordal'), 0.04);
    branch.geometry.dispose();
    branch.geometry = ribbonGeometry(b.pts, () => C.orange500.clone());
    ribbon.branchSegs = b.pts.length - 1;
  };
  /** k = 0…1 draws the city route (the load animation); at 1 the tail and the branch are there too. */
  ribbon.draw = (k) => {
    const segs = k >= 1 ? ribbon.mainSegs : Math.floor(k * ribbon.citySegs);
    main.geometry.setDrawRange(0, segs * 6);
    main.visible = segs > 0;
    branch.visible = k >= 1;
  };

  const routePts = city.pts;
  const distToRoute = (x, z) => {
    let d = Infinity;
    for (let i = 0; i < routePts.length; i += 2) { const p = routePts[i]; d = Math.min(d, Math.hypot(p.x - x, p.z - z)); }
    return d;
  };
  const sideOf = (u, s) => {
    const i = Math.round(u * (city.pts.length - 1));
    const a = city.pts[Math.max(0, i - 2)], b = city.pts[Math.min(city.pts.length - 1, i + 2)];
    const t = b.clone().sub(a).normalize();
    const p = city.pts[i];
    return new Vector3(p.x - t.z * s, 0, p.z + t.x * s);
  };

  // the blocks the scene names, placed first; the city fills in around them
  const specials = [];
  const special = (kind, x, z, w, d, h, extra = {}) => specials.push({ kind, x, z, w, d, h, ...extra });
  special('core', CORE[0], CORE[1], 1.05, 1.05, 1.5);
  const ai = [0.44, 0.5, 0.56].map((u, i) => { const p = sideOf(u, i % 2 ? -0.98 : 0.98); return { x: p.x, z: p.z, u }; });
  ai.forEach((p, i) => special('ai', p.x, p.z, 0.72, 0.72, 0.62 + i * 0.12, { index: i }));
  const model = sideOf(0.36, -1.02);
  special('model', model.x, model.z, 0.8, 0.8, 0.95);
  const products = {
    digirunner: sideOf(0.1, -0.98),
    viki: sideOf(0.2, 0.98),
    gadodido: sideOf(0.29, -0.98),
    greenswift: sideOf(0.66, 0.98),
  };
  for (const [name, p] of Object.entries(products)) special('product', p.x, p.z, 0.7, 0.7, 0.8, { name });
  const legacy = new Vector3(-6.9, 0, 3.5);
  special('legacy', legacy.x, legacy.z, 0.9, 0.9, 1.25);
  const enclosure = new Vector3(10.4, 0, -5.4);
  special('enclosed', enclosure.x, enclosure.z, 0.7, 0.7, 0.55);
  for (const [dx, dz] of [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]) special('wall', enclosure.x + dx * 1.15, enclosure.z + dz * 1.15, 0.8, 0.8, 0.95 + ((dx + dz + 2) % 3) * 0.1);

  const r = rng(20051108);
  const blocks = [];
  for (let i = -15; i <= 15; i++) {
    for (let j = -10; j <= 10; j++) {
      const skip = r() < 0.07;
      const w = 0.54 + r() * 0.18, d = 0.54 + r() * 0.18;
      let h = 0.3 + Math.pow(r(), 2.3) * 1.55;
      if (r() < 0.05) h += 0.9;
      const x = i + (r() - 0.5) * 0.1, z = j + (r() - 0.5) * 0.1;
      const tint = r();
      if (skip) continue;
      const dr = distToRoute(x, z);
      if (dr < 0.68) continue;
      if (dr < 1.45) h = Math.min(h, 0.3 + (dr - 0.68) * 0.35); // the blocks along the route stay low, so the ribbon reads
      if (specials.some((s) => Math.abs(s.x - x) < (s.w + w) / 2 + 0.12 && Math.abs(s.z - z) < (s.d + d) / 2 + 0.12)) continue;
      blocks.push({ x, z: Math.min(z, CITY_EDGE - d / 2), w, d, h, tint });
    }
  }
  // the new services: the regular blocks beside the orange stretch get orange roofs
  const services = [];
  const servicesAt = [sideOf(0.7, 1.3), sideOf(0.75, 1.3), sideOf(0.72, -1.3)];
  for (let k = blocks.length - 1; k >= 0; k--) {
    const b = blocks[k];
    if (servicesAt.some((e) => Math.hypot(e.x - b.x, e.z - b.z) < 0.7)) { services.push(b); blocks.splice(k, 1); }
  }

  const box = new BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
  const blockMat = occluded(new MeshLambertMaterial({ color: 0xffffff }));
  const cityMesh = new InstancedMesh(box, blockMat, blocks.length);
  const o = new Object3D();
  blocks.forEach((b, i) => {
    o.position.set(b.x, 0, b.z); o.scale.set(b.w, b.h, b.d); o.updateMatrix();
    cityMesh.setMatrixAt(i, o.matrix);
    cityMesh.setColorAt(i, C.ink0.clone().lerp(C.ink100, b.tint * 0.9));
  });
  cityMesh.castShadow = true; cityMesh.receiveShadow = true;
  scene.add(cityMesh);

  const sideMat = occluded(new MeshLambertMaterial({ color: 0xffffff }));
  const greyMat = occluded(new MeshLambertMaterial({ color: C.ink200 }));
  const darkMat = occluded(new MeshLambertMaterial({ color: C.ink700 }));
  const roof = (c) => new MeshBasicMaterial({ color: c.clone() });
  const orangeRoof = roof(C.orange500), purpleRoof = roof(C.purple500), magentaRoof = roof(C.magenta500);
  const meshes = { ai: [], product: {} };
  const place = (b, mats) => {
    const m = new Mesh(box, mats);
    m.position.set(b.x, 0, b.z); m.scale.set(b.w, b.h, b.d);
    m.castShadow = true; m.receiveShadow = true;
    scene.add(m);
    return m;
  };
  const withRoof = (top) => [sideMat, sideMat, top, sideMat, sideMat, sideMat];
  for (const b of services) meshes.service = place(b, withRoof(orangeRoof));
  for (const s of specials) {
    if (s.kind === 'core') meshes.core = place(s, darkMat);
    else if (s.kind === 'legacy') meshes.legacy = place(s, greyMat);
    else if (s.kind === 'model') meshes.model = place(s, withRoof(magentaRoof));
    else if (s.kind === 'ai') { const top = roof(C.ink0); meshes.ai[s.index] = place(s, withRoof(top)); meshes.ai[s.index].userData.top = top; }
    else if (s.kind === 'product') meshes.product[s.name] = place(s, withRoof(purpleRoof));
    else if (s.kind === 'enclosed') meshes.enclosed = place(s, withRoof(magentaRoof));
    else if (s.kind === 'wall') place(s, sideMat);
  }
  // the service block nearest the middle of the three carries the label
  const sc = servicesAt[0];
  meshes.service = services.reduce((best, b) => (Math.hypot(b.x - sc.x, b.z - sc.z) < Math.hypot(best.x - sc.x, best.z - sc.z) ? b : best), services[0]);

  const ground = new Mesh(new PlaneGeometry(160, 160).rotateX(-Math.PI / 2), new ShadowMaterial({ color: C.ink700, opacity: 0.16 }));
  ground.receiveShadow = true;
  scene.add(ground);
  scene.userData.ground = ground;

  const hemi = new HemisphereLight(0xffffff, C.ink200, 2.1);
  scene.add(hemi);
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

  // the points the HTML labels hang from (the top of each block)
  const top = (m) => new Vector3(m.position?.x ?? m.x, (m.scale?.y ?? m.h), m.position?.z ?? m.z);
  const anchors = {
    core: top(meshes.core), legacy: top(meshes.legacy), product: top(meshes.product.viki), model: top(meshes.model), service: top(meshes.service),
    ai: meshes.ai.map(top),
  };

  return { scene, ribbon, exit, meshes, ai, products, enclosure, anchors };
}

// ---------------------------------------------------------------- the camera
// A view: target [x, y, z], pitch and yaw in degrees, halfW = half the visible width in world units,
// sx / sy = where the target sits on screen (-1…1).
function viewAt(world, kind, p = 0, aspect = 1.6) {
  switch (kind) {
    // the front edge of the city on the bottom edge of the screen
    case 'heroStart': return { target: [-0.9, 0, CITY_EDGE], pitch: 21, yaw: -6, halfW: HALF_W, sx: 0, sy: -1, fog: 9.5 };
    case 'plan': return { target: [0, 0, CITY_EDGE - HALF_W / aspect], pitch: 90, yaw: 0, halfW: HALF_W, sx: 0, sy: 0 };
    case 'cases': {
      const a = world.ai[0], b = world.ai[2];
      return { target: [lerp(a.x - 0.5, b.x + 0.3, p), 0, lerp(a.z, b.z, p)], pitch: 44, yaw: lerp(-26, -14, p), halfW: 3.4, sx: 0, sy: -0.15 };
    }
    default: return null;
  }
}
const mixView = (a, b, t) => ({
  fog: a.fog != null || b.fog != null ? lerp(a.fog ?? 0, b.fog ?? 0, t) : undefined,
  target: a.target.map((v, i) => lerp(v, b.target[i], t)),
  pitch: lerp(a.pitch, b.pitch, t), yaw: lerp(a.yaw, b.yaw, t), halfW: lerp(a.halfW, b.halfW, t), sx: lerp(a.sx, b.sx, t), sy: lerp(a.sy, b.sy, t),
});
const DIST = 60;
function applyView(cam, scene, v, aspect, fogColour) {
  const halfH = v.halfW / aspect;
  cam.left = -v.halfW; cam.right = v.halfW; cam.top = halfH; cam.bottom = -halfH;
  const pitch = rad(Math.min(v.pitch, 89.99)), yaw = rad(v.yaw);
  const target = new Vector3(...v.target);
  const back = new Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
  cam.position.copy(target).addScaledVector(back, DIST);
  cam.up.set(-Math.sin(yaw), 0, -Math.cos(yaw));
  cam.lookAt(target);
  cam.updateMatrixWorld();
  const right = new Vector3().setFromMatrixColumn(cam.matrixWorld, 0), up = new Vector3().setFromMatrixColumn(cam.matrixWorld, 1);
  cam.position.addScaledVector(right, -v.sx * v.halfW).addScaledVector(up, -v.sy * halfH);
  cam.near = 1; cam.far = 160;
  cam.updateProjectionMatrix(); cam.updateMatrixWorld();
  // the back rows dissolve into the ground colour when the camera is low; none when it looks straight down
  const high = smooth(clamp((v.pitch - 40) / 40));
  // (fog: how far behind the target the fading starts, for views whose target is the city's front edge)
  scene.fog.near = DIST + lerp(v.fog ?? 0.4 * (v.halfW / 12), 80, high);
  scene.fog.far = scene.fog.near + lerp(v.fog ? 7 : 6 * (v.halfW / 12) + 1, 80, high);
  scene.fog.color.copy(fogColour);
  scene.userData.ground.material.opacity = lerp(0.17, 0.05, high);
  scene.background.copy(fogColour);
}

/** World points of the tail for a fork box whose top edge is the city edge, centred on x = cx. */
function tailWorld(world, f, cx, fe) {
  const boxH = 2 * f.halfW * (f.h / f.w);
  const at = ([fx, fy]) => [cx + (fx - 0.5) * 2 * f.halfW, CITY_EDGE + fy * boxH, LIFT];
  const t = tailFractions(fe ?? 0.5 + (world.exit.x - cx) / (2 * f.halfW), f);
  return { main: t.main.map(at), branch: t.branch.map(at) };
}

// ---------------------------------------------------------------- the page
const html = document.documentElement;
const capture = /[?&]capture\b/.test(location.search);

function rest(reason) {
  console.warn('ribbon-route: showing the static pictures (' + reason + ')');
  html.classList.remove('want-3d');
  document.querySelectorAll('.scene').forEach((s) => { s.classList.remove('is-live'); s.classList.add('is-rest'); });
}

function start() {
  let renderer;
  try {
    renderer = new WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: capture });
    if (!renderer.capabilities.isWebGL2) throw new Error('no WebGL 2');
  } catch (e) {
    rest(e.message || 'WebGL failed');
    return;
  }
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NoToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  const canvas = renderer.domElement;
  canvas.className = 'gl';
  canvas.setAttribute('aria-hidden', 'true');

  const world = buildWorld();
  const cam = new OrthographicCamera(-1, 1, 1, -1, 1, 160);
  const lightAi = (levels) => world.meshes.ai.forEach((m, i) => m.userData.top.color.copy(C.ink0).lerp(C.magenta500, levels[i]));
  const project = (p) => { const v = p.clone().project(cam); return { x: (v.x + 1) / 2, y: (1 - v.y) / 2 }; };
  const draw = (v, size, ground = C.ink0, levels = [0, 0, 0]) => {
    lightAi(levels);
    applyView(cam, world.scene, v, size[0] / size[1], ground);
    renderer.render(world.scene, cam);
  };

  if (capture) {
    // capture.mjs: one view at a time; returns the picture and where the named anchors land on it
    window.__ribbon = {
      FORK,
      shot(job) {
        const { w, h } = job;
        renderer.setPixelRatio(1);
        renderer.setSize(w, h, false);
        const aspect = w / h;
        if (job.tail) {
          const f = FORK[job.tail.box];
          const t = tailWorld(world, f, job.tail.cx, job.tail.fe);
          world.ribbon.build(t.main, t.branch);
        } else {
          const t = tailWorld(world, FORK.wide, 0);
          world.ribbon.build(t.main, t.branch);
        }
        world.ribbon.draw(1);
        const v = job.view.kind ? { ...viewAt(world, job.view.kind, job.view.p || 0, aspect), ...job.view.o } : job.view;
        draw(v, [w, h], job.ground ? new Color(job.ground) : C.ink0, job.levels || [0, 0, 0]);
        const where = {};
        for (const [k, p] of Object.entries(world.anchors)) {
          if (Array.isArray(p)) p.forEach((q, i) => { where[`${k}${i}`] = project(q); });
          else where[k] = project(p);
        }
        where.exit = project(new Vector3(world.exit.x, LIFT, CITY_EDGE));
        return { url: canvas.toDataURL('image/webp', 0.9), where };
      },
      focus: (name) => { const m = world.meshes.product[name]; return [m.position.x, 0, m.position.z]; },
      exitX: world.exit.x,
      enclosure: [world.enclosure.x, 0, world.enclosure.z],
      viewAt: (k, p, a) => viewAt(world, k, p, a),
    };
    document.body.appendChild(canvas);
    return;
  }

  const route = document.getElementById('route');
  const hero = document.getElementById('top');
  const forkBox = route.querySelector('.fork__img');
  const cases = document.getElementById('cases');
  const slots = { route: route.querySelector('.gl-slot'), cases: cases.querySelector('.gl-slot') };
  const routeLabels = [...route.querySelectorAll('.map-label--live')];
  const caseLabel = cases.querySelector('.map-label--live');
  for (const s of [route, cases]) { s.classList.remove('is-rest'); s.classList.add('is-live'); }

  let mode = 'route';
  let size = [1, 1];
  const copy = hero.querySelector('.hero__copy');
  const layout = { heroTop: 0, held: 1, copyBottom: 0, labelH: 0 };
  const state = { draw: 0, casesP: 0, sCases: 0 };

  const measure = () => {
    const el = slots[mode];
    size = [el.clientWidth || innerWidth, el.clientHeight || innerHeight];
    renderer.setSize(size[0], size[1], false);
    const y = scrollY;
    const hr = hero.getBoundingClientRect();
    layout.heroTop = hr.top + y;
    layout.held = hr.bottom + y - innerHeight; // the scroll position where the hero lets go
    // where the hero words end on the stuck stage (its top is the screen's top), and how tall a label is
    layout.copyBottom = copy.getBoundingClientRect().bottom - copy.closest('.hero__stage').getBoundingClientRect().top;
    layout.labelH = routeLabels[0].offsetHeight + 8;
    // the tail: the fork picture's box, its top on the city edge, the page's centre on x = 0
    const fb = forkBox.getBoundingClientRect();
    const f = { ...FORK.wide, w: fb.width || FORK.wide.w, h: fb.height || FORK.wide.h, halfW: HALF_W * (fb.width / (slots.route.clientWidth || fb.width) || 1) };
    const cx = ((fb.left + fb.width / 2) - (slots.route.clientWidth || innerWidth) / 2) * (2 * HALF_W / (slots.route.clientWidth || innerWidth));
    const t = tailWorld(world, f, cx);
    world.ribbon.build(t.main, t.branch);
    world.ribbon.draw(state.draw);
    // before the cases scene takes the canvas, its slot shows the first stop's picture: label that block
    if (mode === 'route') {
      caseLabel.style.translate = `${(POSTER_LABEL[0] * slots.cases.clientWidth).toFixed(1)}px ${(POSTER_LABEL[1] * slots.cases.clientHeight).toFixed(1)}px`;
      caseLabel.style.visibility = 'visible';
    }
  };

  // the route view for the current scroll position: rising while the hero is held, then a plan that pans
  // the hero view, zoomed out until every labelled stop sits below the hero words: on a wide, short screen
  // the city would otherwise rise behind the lead and the buttons (the front edge stays on the bottom edge,
  // so in this orthographic view a stop's distance from the bottom shrinks by the zoom factor)
  const heroView = (aspect) => {
    const v = viewAt(world, 'heroStart', 0, aspect);
    applyView(cam, world.scene, v, aspect, C.ink0);
    const top = Math.min(...routeLabels.map((el) => project(world.anchors[el.dataset.anchor]).y));
    const free = (layout.copyBottom + layout.labelH + LABEL_GAP) / size[1];
    if (top < free) v.halfW *= Math.min((1 - top) / Math.max(0.05, 1 - free), MAX_ZOOM_OUT);
    return v;
  };
  const routeView = () => {
    const aspect = size[0] / size[1];
    const y = scrollY;
    const plan = viewAt(world, 'plan', 0, aspect);
    if (y < layout.held) {
      const p = clamp((y - layout.heroTop) / Math.max(1, layout.held - layout.heroTop));
      return mixView(heroView(aspect), plan, smooth(clamp((p - 0.04) / 0.9)));
    }
    // the stage stays stuck until the route's end leaves the top (its negative margin), so the map pans all the way
    const pan = (y - layout.held) * (2 * HALF_W / size[0]);
    return { ...plan, target: [plan.target[0], 0, plan.target[2] + pan] };
  };

  // the cases: one result at a time while the camera walks the magenta stretch
  const panels = gsap.utils.toArray(cases.querySelectorAll('.case'));
  const count = cases.querySelector('.cases__count');
  const names = panels.map((p) => p.querySelector('.case__name').textContent);
  gsap.set(panels.slice(1), { autoAlpha: 0, y: 32 });
  const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: cases, start: 'top top', end: 'bottom bottom', scrub: 0.4 } });
  tl.to(panels[0], { autoAlpha: 0, y: -24, duration: 0.06, ease: 'power2.in' }, 0.28)
    .to(panels[1], { autoAlpha: 1, y: 0, duration: 0.07, ease: 'power2.out' }, 0.34)
    .to(panels[1], { autoAlpha: 0, y: -24, duration: 0.06, ease: 'power2.in' }, 0.61)
    .to(panels[2], { autoAlpha: 1, y: 0, duration: 0.07, ease: 'power2.out' }, 0.67)
    .to({}, { duration: 1 }, 0);
  let current = 0;
  ScrollTrigger.create({
    trigger: cases, start: 'top top', end: 'bottom bottom',
    onUpdate: (s) => {
      state.casesP = s.progress; kick();
      const n = s.progress < 0.31 ? 0 : s.progress < 0.64 ? 1 : 2;
      if (n !== current) { current = n; count.textContent = `第 ${n + 1} 則，共 3 則`; caseLabel.textContent = names[n]; }
    },
  });
  caseLabel.textContent = names[0];

  // the hero words leave while the camera rises
  gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: true } })
    .to(hero.querySelector('.hero__copy'), { yPercent: -30, autoAlpha: 0, duration: 0.3 }, 0.08)
    .to({}, { duration: 1 }, 0);

  // the signature move: the ribbon draws itself from the core system through the city, once, in 1.2s
  gsap.to(state, { draw: 1, duration: 1.2, ease: 'power2.inOut', delay: 0.1, onUpdate: () => { world.ribbon.draw(state.draw); kick(); } });

  let raf = 0;
  function kick() { if (!raf) raf = requestAnimationFrame(tick); }
  const place = (el, p, show) => {
    el.style.translate = `${(p.x * size[0]).toFixed(1)}px ${(p.y * size[1]).toFixed(1)}px`;
    el.style.visibility = show && p.x > 0.02 && p.x < 0.98 && p.y > 0.04 && p.y < 1 ? 'visible' : 'hidden';
  };
  function tick() {
    raf = 0;
    if (document.hidden) return;
    const next = cases.getBoundingClientRect().top <= 1 ? 'cases' : 'route';
    if (next !== mode) { mode = next; slots[mode].appendChild(canvas); measure(); }
    if (mode === 'route') {
      if (route.getBoundingClientRect().bottom < 0) return;
      draw(routeView(), size);
      // a label never sits on the hero words while they are still on screen (a very short screen can need
      // more zoom than MAX_ZOOM_OUT allows)
      const words = Number(getComputedStyle(copy).opacity) > 0.02 ? copy.getBoundingClientRect().bottom : -Infinity;
      routeLabels.forEach((el) => {
        const p = project(world.anchors[el.dataset.anchor]);
        place(el, p, state.draw >= 1 && p.y * size[1] - layout.labelH > words);
      });
    } else {
      if (cases.getBoundingClientRect().bottom < 0) return;
      const d = state.casesP - state.sCases;
      state.sCases += Math.abs(d) < 1e-4 ? d : d * 0.16;
      const p = state.sCases;
      draw(viewAt(world, 'cases', p, size[0] / size[1]), size, C.ink0, [1, clamp((p - 0.3) / 0.08), clamp((p - 0.63) / 0.08)]);
      place(caseLabel, project(world.anchors.ai[current]), true);
      if (Math.abs(d) > 1e-4) kick();
    }
  }

  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', () => { measure(); kick(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
  slots.route.appendChild(canvas);
  measure();
  html.classList.add('gl-ready');
  kick();
  // the fonts and the pictures change the heights the layout measured
  const again = () => { ScrollTrigger.refresh(); measure(); kick(); };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(again);
  addEventListener('load', again);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
else start();
