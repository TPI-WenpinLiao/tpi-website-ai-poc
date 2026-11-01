// ribbon-route: the system map and the brand ribbon (#166 round 4, docs/strategy/concepts/directions.md).
// One three.js world, two scroll scenes: the hero (#top) and the AI results (#cases). The canvas moves
// into whichever stage is on screen; nothing renders while neither is.
//
// Loaded only on desktop with motion allowed (the inline script in index.html decides). Without WebGL 2
// it removes html.want-3d and marks both scenes .is-rest, so the static pictures show instead.
// ?capture renders named views for the static pictures (capture.mjs) and skips the scroll scenes.
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

// ---------------------------------------------------------------- the ribbon routes
// x right, z towards the viewer, y up. The main route leaves the core system (left), forks, runs its
// magenta stretch past the three AI blocks and ends at the orange services (right); the branch goes
// from the fork to a second group of services at the back.
const MAIN = [[-10.1, 1.0, 0.55], [-8.4, 1.0, 0.4], [-6.9, 0.6, 0.44], [-5.6, -0.4, 0.56], [-4.3, -1.1, 0.5],
  [-2.7, -0.8, 0.36], [-1.3, 0.5, 0.42], [0.5, 1.3, 0.52], [2.4, 1.0, 0.6], [3.9, -0.2, 0.46], [5.3, -0.9, 0.36],
  [6.9, -0.5, 0.42], [8.3, 0.3, 0.5], [9.7, 0.5, 0.46]];
const BRANCH = [[-6.9, 0.6, 0.44], [-5.6, -0.4, 0.56], [-5.0, -1.9, 0.62], [-3.7, -3.1, 0.5], [-1.5, -3.8, 0.4],
  [1.1, -3.6, 0.46], [3.5, -4.3, 0.5], [5.8, -4.7, 0.44]];
const RIBBON_W = 0.36;

const v3 = (a) => new Vector3(a[0], a[2], a[1]); // [x, z, y] → Vector3(x, y, z)

/** Points spaced evenly along the curve from parameter t0 to t1. */
function spaced(curve, t0, t1, step) {
  const dense = [];
  for (let i = 0; i <= 2000; i++) dense.push(curve.getPoint(lerp(t0, t1, i / 2000)));
  const acc = [0];
  for (let i = 1; i < dense.length; i++) acc.push(acc[i - 1] + dense[i].distanceTo(dense[i - 1]));
  const total = acc[acc.length - 1];
  const n = Math.max(2, Math.round(total / step));
  const out = [];
  let k = 0;
  for (let i = 0; i <= n; i++) {
    const s = (total * i) / n;
    while (k < acc.length - 2 && acc[k + 1] < s) k++;
    const f = (s - acc[k]) / (acc[k + 1] - acc[k] || 1);
    out.push(dense[k].clone().lerp(dense[k + 1], f));
  }
  return { pts: out, length: total };
}

/** A flat band along pts, banked into its bends, coloured along its length, its far end cut on a slant. */
function ribbonGeometry(pts, colourAt) {
  const n = pts.length;
  const T = pts.map((p, i) => pts[Math.min(n - 1, i + 1)].clone().sub(pts[Math.max(0, i - 1)]).normalize());
  // signed curvature in plan, smoothed, decides the bank
  const bend = T.map((t, i) => {
    const a = T[Math.max(0, i - 3)], b = T[Math.min(n - 1, i + 3)];
    return a.x * b.z - a.z * b.x;
  });
  const bank = bend.map((_, i) => {
    let s = 0, c = 0;
    for (let j = Math.max(0, i - 8); j <= Math.min(n - 1, i + 8); j++) { s += bend[j]; c++; }
    return clamp((-s / c) * 2.4, -0.7, 0.7);
  });
  const pos = [], col = [], idx = [];
  const up = new Vector3(0, 1, 0), side = new Vector3(), lift = new Vector3();
  for (let i = 0; i < n; i++) {
    const t = T[i];
    side.set(-t.z, 0, t.x).normalize();
    lift.crossVectors(t, side).normalize(); // perpendicular to both: the band's normal before banking
    if (lift.dot(up) < 0) lift.negate();
    const s = side.clone().multiplyScalar(Math.cos(bank[i])).addScaledVector(lift, Math.sin(bank[i]));
    const half = RIBBON_W / 2;
    const L = pts[i].clone().addScaledVector(s, half), R = pts[i].clone().addScaledVector(s, -half);
    if (i === n - 1) { L.addScaledVector(t, RIBBON_W * 0.42); R.addScaledVector(t, -RIBBON_W * 0.42); } // the logo's slanted cut
    pos.push(L.x, L.y, L.z, R.x, R.y, R.z);
    const c = colourAt(i / (n - 1));
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

/** Colour stops along a route: [[at, Color], …]. */
const ramp = (stops) => (u) => {
  for (let i = 1; i < stops.length; i++) {
    if (u <= stops[i][0]) {
      const [a, ca] = stops[i - 1], [b, cb] = stops[i];
      return ca.clone().lerp(cb, smooth(clamp((u - a) / (b - a || 1))));
    }
  }
  return stops[stops.length - 1][1].clone();
};

// The ribbon keeps its brand colours: lit a little for its bends, mostly flat.
function flatter(mat, amount) {
  mat.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', `outgoingLight = mix(outgoingLight, diffuseColor.rgb, ${amount.toFixed(2)});\n#include <opaque_fragment>`);
  };
  return mat;
}
// Blocks darken towards the ground: a cheap stand-in for ambient occlusion.
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

  const mainCurve = new CatmullRomCurve3(MAIN.map(v3), false, 'centripetal');
  const branchCurve = new CatmullRomCurve3(BRANCH.map(v3), false, 'centripetal');
  const main = spaced(mainCurve, 0, 1, 0.04);
  const branch = spaced(branchCurve, 1 / (BRANCH.length - 1), 1, 0.04); // from the fork on
  const mainColour = ramp([[0, C.purple500], [0.3, C.purple500], [0.44, C.magenta500], [0.66, C.magenta500], [0.8, C.orange500], [1, C.orange500]]);
  const branchColour = ramp([[0, C.purple500], [0.4, C.purple500], [0.78, C.orange500], [1, C.orange500]]);

  const ribbonMat = flatter(new MeshLambertMaterial({ vertexColors: true, side: DoubleSide }), 0.62);
  const ribbons = [
    { mesh: new Mesh(ribbonGeometry(main.pts, mainColour), ribbonMat), segs: main.pts.length - 1, start: 0, length: main.length },
    { mesh: new Mesh(ribbonGeometry(branch.pts, branchColour), ribbonMat), segs: branch.pts.length - 1, start: 0, length: branch.length },
  ];
  // the branch starts drawing when the main ribbon reaches the fork
  const forkAt = main.pts.reduce((best, p, i) => (p.distanceTo(branch.pts[0]) < main.pts[best].distanceTo(branch.pts[0]) ? i : best), 0);
  ribbons[1].start = (forkAt / (main.pts.length - 1)) * main.length;
  for (const r of ribbons) { r.mesh.castShadow = true; scene.add(r.mesh); }

  const routePts = [...main.pts, ...branch.pts];
  const distToRoute = (x, z) => {
    let d = Infinity;
    for (let i = 0; i < routePts.length; i += 2) { const p = routePts[i]; d = Math.min(d, Math.hypot(p.x - x, p.z - z)); }
    return d;
  };
  const along = (route, u) => route.pts[Math.round(u * (route.pts.length - 1))];
  const sideOf = (route, u, s) => {
    const i = Math.round(u * (route.pts.length - 1));
    const a = route.pts[Math.max(0, i - 2)], b = route.pts[Math.min(route.pts.length - 1, i + 2)];
    const t = b.clone().sub(a).normalize();
    const p = route.pts[i];
    return new Vector3(p.x - t.z * s, 0, p.z + t.x * s);
  };

  // the blocks the scene names, placed first; the city fills in around them
  const specials = [];
  const special = (kind, x, z, w, d, h, extra = {}) => specials.push({ kind, x, z, w, d, h, ...extra });
  special('core', -10.6, 1.0, 1.05, 1.05, 1.5);
  const ai = [0.47, 0.555, 0.64].map((u, i) => { const p = sideOf(main, u, i % 2 ? -0.98 : 0.98); return { x: p.x, z: p.z, u }; });
  ai.forEach((p, i) => special('ai', p.x, p.z, 0.72, 0.72, 0.62 + i * 0.12, { index: i }));
  const products = {
    digirunner: sideOf(main, 0.215, -0.98),
    viki: sideOf(main, 0.4, 0.98),
    gadodido: sideOf(branch, 0.5, 0.98),
    greenswift: sideOf(branch, 0.84, -0.98),
  };
  for (const [name, p] of Object.entries(products)) special('product', p.x, p.z, 0.7, 0.7, 0.8, { name });
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
      blocks.push({ x, z, w, d, h, tint });
    }
  }
  // the services each route ends at: regular blocks near the two ends get orange roofs
  const ends = [main.pts[main.pts.length - 1], branch.pts[branch.pts.length - 1]];
  const services = [];
  for (let k = blocks.length - 1; k >= 0; k--) {
    const b = blocks[k];
    if (ends.some((e) => Math.hypot(e.x - b.x, e.z - b.z) < 1.75)) { services.push(b); blocks.splice(k, 1); }
  }

  const box = new BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
  const blockMat = occluded(new MeshLambertMaterial({ color: 0xffffff }));
  const city = new InstancedMesh(box, blockMat, blocks.length);
  const o = new Object3D();
  blocks.forEach((b, i) => {
    o.position.set(b.x, 0, b.z); o.scale.set(b.w, b.h, b.d); o.updateMatrix();
    city.setMatrixAt(i, o.matrix);
    city.setColorAt(i, C.ink0.clone().lerp(C.ink100, b.tint * 0.9));
  });
  city.castShadow = true; city.receiveShadow = true;
  scene.add(city);

  const sideMat = occluded(new MeshLambertMaterial({ color: 0xffffff }));
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
  for (const b of services) place(b, withRoof(orangeRoof));
  for (const s of specials) {
    if (s.kind === 'core') meshes.core = place(s, darkMat);
    else if (s.kind === 'ai') { const top = roof(C.ink0); top.userData.lit = 0; meshes.ai[s.index] = place(s, withRoof(top)); meshes.ai[s.index].userData.top = top; }
    else if (s.kind === 'product') meshes.product[s.name] = place(s, withRoof(purpleRoof));
    else if (s.kind === 'enclosed') meshes.enclosed = place(s, withRoof(magentaRoof));
    else if (s.kind === 'wall') place(s, sideMat);
  }

  const ground = new Mesh(new PlaneGeometry(120, 120).rotateX(-Math.PI / 2), new ShadowMaterial({ color: C.ink700, opacity: 0.16 }));
  ground.receiveShadow = true;
  scene.add(ground);
  scene.userData.ground = ground;

  const hemi = new HemisphereLight(0xffffff, C.ink200, 2.1);
  scene.add(hemi);
  const sun = new DirectionalLight(0xffffff, 1.55);
  sun.position.set(-7, 14, 9);
  sun.target.position.set(0, 0, 0);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -18, right: 18, top: 14, bottom: -14, near: 1, far: 50 });
  sun.shadow.radius = 3;
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.02;
  scene.add(sun, sun.target);

  return { scene, ribbons, main, branch, meshes, ai, products, enclosure, mainLength: main.length };
}

// ---------------------------------------------------------------- the camera
// A view: target [x, y, z], pitch and yaw in degrees, halfW = half the visible width in world units,
// sx / sy = where the target sits on screen (-1…1).
function viewAt(world, kind, p = 0) {
  const pt = (u) => { const q = world.main.pts[Math.round(clamp(u) * (world.main.pts.length - 1))]; return [q.x, 0, q.z]; };
  switch (kind) {
    case 'heroStart': return { target: [-1.2, 0, 0.6], pitch: 31, yaw: -8, halfW: 10.6, sx: 0, sy: -0.84 };
    case 'heroPlan': return { target: [-1.4, 0, -1.3], pitch: 89.5, yaw: 0, halfW: 10.6, sx: 0, sy: -0.04 };
    case 'cases': {
      const u = lerp(world.ai[0].u - 0.025, world.ai[2].u + 0.01, p);
      return { target: pt(u), pitch: 42, yaw: lerp(-30, -18, p), halfW: 4.3, sx: -0.3, sy: -0.3 };
    }
    default: return null;
  }
}
const mixView = (a, b, t) => ({
  target: a.target.map((v, i) => lerp(v, b.target[i], t)),
  pitch: lerp(a.pitch, b.pitch, t), yaw: lerp(a.yaw, b.yaw, t), halfW: lerp(a.halfW, b.halfW, t), sx: lerp(a.sx, b.sx, t), sy: lerp(a.sy, b.sy, t),
});
const DIST = 60;
function applyView(cam, scene, v, aspect, fogColour) {
  const halfH = v.halfW / aspect;
  cam.left = -v.halfW; cam.right = v.halfW; cam.top = halfH; cam.bottom = -halfH;
  const pitch = rad(v.pitch), yaw = rad(v.yaw);
  const target = new Vector3(...v.target);
  const back = new Vector3(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
  cam.position.copy(target).addScaledVector(back, DIST);
  cam.up.set(-Math.sin(yaw), 0, -Math.cos(yaw));
  cam.lookAt(target);
  cam.updateMatrixWorld();
  const right = new Vector3().setFromMatrixColumn(cam.matrixWorld, 0), up = new Vector3().setFromMatrixColumn(cam.matrixWorld, 1);
  cam.position.addScaledVector(right, -v.sx * v.halfW).addScaledVector(up, -v.sy * halfH);
  cam.near = 1; cam.far = 140;
  cam.updateProjectionMatrix(); cam.updateMatrixWorld();
  // the back rows dissolve into the ground colour when the camera is low; none when it looks straight down
  const high = smooth(clamp((v.pitch - 40) / 40));
  scene.fog.near = DIST + lerp(0.4 * (v.halfW / 12), 60, high);
  scene.fog.far = scene.fog.near + lerp(6 * (v.halfW / 12) + 1, 60, high);
  scene.fog.color.copy(fogColour);
  scene.userData.ground.material.opacity = lerp(0.17, 0.035, high);
  scene.background.copy(fogColour);
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
  const cam = new OrthographicCamera(-1, 1, 1, -1, 1, 140);

  let raf = 0;
  const state = { mode: 'hero', heroP: 0, casesP: 0, sHero: 0, sCases: 0, draw: capture ? 1 : 0, dirty: true };
  const setDraw = (k) => {
    const total = world.mainLength;
    for (const r of world.ribbons) {
      const drawn = clamp((k * total - r.start) / r.length);
      r.mesh.geometry.setDrawRange(0, Math.floor(drawn * r.segs) * 6);
      r.mesh.visible = drawn > 0;
    }
  };
  const lightAi = (levels) => world.meshes.ai.forEach((m, i) => m.userData.top.color.copy(C.ink0).lerp(C.magenta500, levels[i]));
  const project = (p) => { const v = p.clone().project(cam); return { x: (v.x + 1) / 2, y: (1 - v.y) / 2 }; };
  const coreAnchor = new Vector3(world.meshes.core.position.x, 1.5, world.meshes.core.position.z);

  function render(kind, p, size) {
    const [w, h] = size;
    let v, ground = C.ink0, levels = [0, 0, 0];
    if (kind === 'hero') v = mixView(viewAt(world, 'heroStart'), viewAt(world, 'heroPlan'), smooth(clamp((p - 0.06) / 0.88)));
    else if (kind === 'cases') {
      v = viewAt(world, 'cases', p); ground = C.ink50;
      levels = [1, clamp((p - 0.3) / 0.08), clamp((p - 0.63) / 0.08)];
    } else { v = kind; ground = kind.ground || C.ink0; levels = kind.levels || [1, 1, 1]; }
    lightAi(levels);
    applyView(cam, world.scene, v, w / h, ground);
    renderer.render(world.scene, cam);
  }

  if (capture) {
    // capture.mjs: one named view at a time, with the screen position of the core-system label
    window.__ribbon = {
      world,
      shot(view, w, h) {
        renderer.setPixelRatio(1);
        renderer.setSize(w, h, false);
        setDraw(1);
        const named = typeof view === 'string' ? viewAt(world, view) : null;
        const v = named ? { ...named, levels: [0, 0, 0] } : typeof view === 'string' ? view : { ...view, ground: view.ground ? new Color(view.ground) : C.ink0 };
        if (view === 'cases0') render('cases', 0, [w, h]);
        else if (view === 'cases1') render('cases', 0.5, [w, h]);
        else if (view === 'cases2') render('cases', 1, [w, h]);
        else render(v, 0, [w, h]);
        return { url: canvas.toDataURL('image/webp', 0.9), core: project(coreAnchor) };
      },
      focus: (name) => { const m = world.meshes.product[name]; return m ? [m.position.x, 0, m.position.z] : world.ai.map((a) => [a.x, 0, a.z]); },
      enclosure: [world.enclosure.x, 0, world.enclosure.z],
      viewAt: (k, p) => viewAt(world, k, p),
    };
    document.body.appendChild(canvas);
    return;
  }

  const hero = document.getElementById('top');
  const cases = document.getElementById('cases');
  const slots = { hero: hero.querySelector('.gl-slot'), cases: cases.querySelector('.gl-slot') };
  const label = hero.querySelector('.map-label--live');
  for (const s of [hero, cases]) { s.classList.remove('is-rest'); s.classList.add('is-live'); }
  slots.hero.appendChild(canvas);

  let size = [1, 1];
  const resize = () => {
    const el = slots[state.mode];
    size = [el.clientWidth || innerWidth, el.clientHeight || innerHeight];
    renderer.setSize(size[0], size[1], false);
    state.dirty = true;
  };

  // which stage is on screen
  const onScreen = { hero: true, cases: false };
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) onScreen[e.target === hero ? 'hero' : 'cases'] = e.isIntersecting;
    const next = onScreen.hero ? 'hero' : onScreen.cases ? 'cases' : null;
    if (next && next !== state.mode) { state.mode = next; slots[next].appendChild(canvas); resize(); }
    state.active = !!next;
    if (state.active) kick();
  });
  io.observe(hero);
  io.observe(cases);
  state.active = true;

  // the hero: the camera rises from 30° to straight above while the words leave
  ScrollTrigger.create({ trigger: hero, start: 'top top', end: 'bottom bottom', onUpdate: (s) => { state.heroP = s.progress; kick(); } });
  gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom bottom', scrub: 0.4 } })
    .to(hero.querySelector('.hero__copy'), { yPercent: -36, autoAlpha: 0, duration: 0.34 }, 0.1)
    .to(label, { autoAlpha: 0, duration: 0.14 }, 0.08)
    .to({}, { duration: 1 }, 0);

  // the cases: one result at a time, the camera walking the magenta stretch
  const panels = gsap.utils.toArray(cases.querySelectorAll('.case'));
  const count = cases.querySelector('.cases__count');
  gsap.set(panels.slice(1), { autoAlpha: 0, y: 48 });
  const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: cases, start: 'top top', end: 'bottom bottom', scrub: 0.4 } });
  tl.to(panels[0], { autoAlpha: 0, y: -40, duration: 0.06, ease: 'power2.in' }, 0.27)
    .to(panels[1], { autoAlpha: 1, y: 0, duration: 0.07, ease: 'power2.out' }, 0.34)
    .to(panels[1], { autoAlpha: 0, y: -40, duration: 0.06, ease: 'power2.in' }, 0.6)
    .to(panels[2], { autoAlpha: 1, y: 0, duration: 0.07, ease: 'power2.out' }, 0.67)
    .to({}, { duration: 1 }, 0);
  ScrollTrigger.create({
    trigger: cases, start: 'top top', end: 'bottom bottom',
    onUpdate: (s) => {
      state.casesP = s.progress; kick();
      const n = s.progress < 0.305 ? 1 : s.progress < 0.635 ? 2 : 3;
      if (count.dataset.n !== String(n)) { count.dataset.n = String(n); count.textContent = `第 ${n} 則，共 3 則`; }
    },
  });

  // the signature move: the ribbon draws itself from the core system to the services, once, in 1.2s
  gsap.to(state, { draw: 1, duration: 1.2, ease: 'power2.inOut', delay: 0.1, onUpdate: kick });

  function kick() { if (!raf) raf = requestAnimationFrame(tick); }
  function tick() {
    raf = 0;
    if (!state.active || document.hidden) return;
    const k = 0.16;
    const dh = state.heroP - state.sHero, dc = state.casesP - state.sCases;
    state.sHero += Math.abs(dh) < 1e-4 ? dh : dh * k;
    state.sCases += Math.abs(dc) < 1e-4 ? dc : dc * k;
    setDraw(state.draw);
    if (state.mode === 'hero') render('hero', state.sHero, size);
    else render('cases', state.sCases, size);
    if (state.mode === 'hero' && label) {
      const s = project(coreAnchor);
      label.style.translate = `${(s.x * size[0]).toFixed(1)}px ${(s.y * size[1]).toFixed(1)}px`;
    }
    if (Math.abs(dh) > 1e-4 || Math.abs(dc) > 1e-4 || state.draw < 1) kick();
  }

  addEventListener('resize', () => { resize(); kick(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
  resize();
  html.classList.add('gl-ready');
  kick();
  // the fonts and the pictures change the heights the triggers measured
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
else start();
