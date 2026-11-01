// t-gateway: one WebGL world under the whole page (docs/strategy/concepts/directions.md「方向一」).
// The T of the TPIsoftware logo is a gate: grey existing systems below, orange pulses (API, data)
// and magenta pulses (AI) run through it. Scroll drives three held scenes over one fixed canvas:
//   gate     hero → the camera dives through the T's stem → the path forks to 金融 and 政府
//   modules  the stem cracks into four product modules, then walls rise round the AI block
//   logo     every part folds back into the logo symbol
// Loaded only when motion is allowed and WebGL 2 exists (the inline gate in index.html).
import {
  WebGLRenderer, Scene, PerspectiveCamera, Color, Vector3, Group, Mesh, InstancedMesh, Object3D,
  MeshStandardMaterial, MeshBasicMaterial, CapsuleGeometry, ExtrudeGeometry, PlaneGeometry,
  CatmullRomCurve3, DirectionalLight, HemisphereLight, FogExp2, NeutralToneMapping, SRGBColorSpace,
  Vector2, Quaternion, DoubleSide, MathUtils, Matrix4,
} from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const html = document.documentElement;
const LIVE = html.classList.contains('live');
const PHONE = !LIVE;

// ---------- brand geometry: src/assets/brand/logo-symbol-color.svg ----------
const T_PATH = 'M 29.988281 36.554688 L 29.988281 79.171875 C 29.988281 82.050781 31.726562 85.691406 37.808594 85.691406 L 89.636719 85.691406 C 98.398438 85.691406 100.714844 91.046875 100.714844 95.726562 L 100.714844 214.398438 C 100.714844 217.277344 102.984375 220.914062 108.535156 220.914062 L 154.183594 220.914062 C 179.746094 220.914062 186.382812 211.179688 186.382812 199.175781 L 186.382812 139.90625 C 185.289062 88.183594 227.171875 56.375 272.0625 39.167969 C 277.398438 36.945312 282.71875 34.917969 288 33.082031 C 289.671875 32.5 289.265625 30.035156 287.492188 30.035156 L 37.808594 30.035156 C 32.339844 30.035156 29.988281 33.671875 29.988281 36.554688';
// the same outline cut off at y = 141: the head that stays when the stem cracks into modules
const HEAD_PATH = T_PATH.replace(/L 100\.714844 214\.398438 C [^L]+L 154\.183594 220\.914062 C [^L]+L 186\.382812 139\.90625/, 'L 100.714844 141 L 186.382812 141 L 186.382812 139.90625');
const SQUARE_PATH = 'M 260.074219 165.441406 C 257.402344 165.695312 255.367188 167.652344 255.367188 173.246094 L 255.367188 214.382812 C 255.367188 217.273438 257.730469 220.914062 263.203125 220.914062 L 349.886719 220.914062 C 355.902344 220.914062 357.722656 217.273438 357.722656 214.386719 C 357.722656 197.175781 357.722656 143.890625 357.722656 130.570312 C 357.722656 129.292969 356.28125 128.558594 355.246094 129.304688 C 342.976562 138.15625 320.675781 159.613281 260.074219 165.441406';
const ELLIPSE_PATH = 'M 345.308594 79.15625 C 350.285156 91.839844 335.125 109.652344 311.445312 118.945312 C 287.765625 128.238281 264.535156 125.492188 259.558594 112.808594 C 254.582031 100.125 269.742188 82.308594 293.421875 73.015625 C 317.101562 63.722656 340.332031 66.472656 345.308594 79.15625';
const S = 6 / 191;                 // world units per SVG unit: the T is 6 units tall
const LIFT = 0.13;                 // the T stands on the slabs
const svgToWorld = (x, y) => new Vector3((x - 143.5) * S, (221 - y) * S + LIFT, 0);

function extrude(d) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg"><g transform="translate(-143.5 221) scale(1 -1)"><path d="${d}"/></g></svg>`;
  const shapes = new SVGLoader().parse(svg).paths.flatMap((p) => p.toShapes(true));
  const depth = 38;
  const g = new ExtrudeGeometry(shapes, { depth, bevelEnabled: true, bevelThickness: 3, bevelSize: 2.4, bevelSegments: 3, curveSegments: 28 });
  g.translate(0, 0, -depth / 2);
  g.scale(S, S, S);
  // a path that ends on its own start point leaves a zero-length edge; its bevel vector is NaN,
  // and one NaN pixel spreads over the whole screen through the bloom
  let bad = 0;
  for (const name of ['position', 'normal', 'uv']) {
    const a = g.attributes[name].array;
    for (let i = 0; i < a.length; i++) if (!Number.isFinite(a[i])) { a[i] = 0; bad++; }
  }
  if (bad) g.computeVertexNormals();
  // zero-length normals (collinear control points) turn into NaN in the lighting: point them out
  const n = g.attributes.normal;
  for (let i = 0; i < n.count; i++) {
    const l = Math.hypot(n.getX(i), n.getY(i), n.getZ(i));
    if (!(l > 1e-6)) n.setXYZ(i, 0, 0, 1);
  }
  return g;
}

// ---------- colours (src/styles/tokens.css) ----------
const C = {
  ink950: new Color('#0a0812'), ink900: new Color('#120f1d'), ink800: new Color('#221d33'), ink700: new Color('#3a3550'),
  ink500: new Color('#6c6785'), ink300: new Color('#b9b5cc'), ink200: new Color('#dcdae6'),
  purple900: new Color('#381850'), purple700: new Color('#662e8d'), purple400: new Color('#a277d6'), purple300: new Color('#bf9de8'),
  orange500: new Color('#ff6329'), magenta400: new Color('#d55ae9'), magenta500: new Color('#b824d1'), logoGrey: new Color('#8d98b1'),
};

// A standard material whose bevels glow: the T's edge light (directions.md「光的規則」). The mask is the
// object-space normal: front and back faces (|z| = 1) and side walls (z = 0) stay dark, bevels light.
function edgeMaterial({ color, edge, intensity, roughness = 0.42, metalness = 0.35, emissive, side }) {
  const m = new MeshStandardMaterial({ color, roughness, metalness, emissive: emissive ?? new Color(0) });
  if (side !== undefined) m.side = side;
  const uEdge = { value: edge.clone().multiplyScalar(intensity) };
  m.userData.uEdge = uEdge;
  m.userData.edgeBase = edge.clone();
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uEdge = uEdge;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vObjN;')
      .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\nvObjN = objectNormal;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vObjN;\nuniform vec3 uEdge;')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n{ float nz = abs(normalize(vObjN).z); float bev = smoothstep(0.05, 0.22, nz) * (1.0 - smoothstep(0.86, 0.97, nz)); totalEmissiveRadiance += uEdge * bev; }');
  };
  return m;
}
const setEdge = (m, k) => m.userData.uEdge.value.copy(m.userData.edgeBase).multiplyScalar(k);

// ---------- renderer ----------
const tier = LIVE ? { dpr: Math.min(devicePixelRatio, 1.75), density: 1, bloom: true } : { dpr: Math.min(devicePixelRatio, 1.5), density: 0.5, bloom: false };
const host = LIVE ? document.querySelector('.world') : document.querySelector('.hero-pic');
let renderer;
try {
  renderer = new WebGLRenderer({ antialias: LIVE, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: false });
} catch (e) {
  console.warn('t-gateway: WebGL renderer failed, showing the still version', e);
  html.classList.remove('motion', 'live');
  throw e;
}
renderer.setPixelRatio(tier.dpr);
renderer.outputColorSpace = SRGBColorSpace;
renderer.toneMapping = NeutralToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.setClearColor(C.ink950, 1);
host.appendChild(renderer.domElement);
renderer.domElement.setAttribute('aria-hidden', 'true');

const scene = new Scene();
scene.background = C.ink950.clone();
scene.fog = new FogExp2(C.ink950.getHex(), 0.034);
const camera = new PerspectiveCamera(38, 1.6, 0.05, 120);

scene.add(new HemisphereLight(new Color('#b4b2c2'), new Color('#0a0812'), 0.6));
const key = new DirectionalLight(new Color('#e9e4ff'), 2.0);
key.position.set(-6, 10, 9);
scene.add(key);
const rim = new DirectionalLight(C.purple400, 1.6);
rim.position.set(7, 6, -9);
scene.add(rim);

// ---------- the world ----------
const world = new Group();
scene.add(world);

// existing systems: a 4 × 4 platform of matte grey slabs, never glowing
const SLAB = 1.7, GAP = 0.32;
const slabGeo = new RoundedBoxGeometry(SLAB, 0.3, SLAB, 2, 0.06);
const slabMat = new MeshStandardMaterial({ color: new Color('#76738a'), roughness: 0.95, metalness: 0 });
const SLABS = 36;
const slabs = new InstancedMesh(slabGeo, slabMat, SLABS);
const slabHome = [];
for (let i = 0; i < SLABS; i++) {
  const x = ((i % 6) - 2.5) * (SLAB + GAP);
  const z = (Math.floor(i / 6) - 2.5) * (SLAB + GAP);
  slabHome.push(new Vector3(x, -0.1, z));
}
world.add(slabs);
const ground = new Mesh(new PlaneGeometry(240, 240), new MeshStandardMaterial({ color: C.ink900, roughness: 1, metalness: 0 }));
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.26;
world.add(ground);

// the two system clusters the industry paths lead to
const clusterGeo = new RoundedBoxGeometry(0.9, 1, 0.9, 2, 0.05);
const clusterSpots = [];
for (const side of [-1, 1]) {
  for (let i = 0; i < 9; i++) {
    const h = 0.45 + ((i * 7 + (side > 0 ? 3 : 0)) % 5) * 0.38;
    clusterSpots.push({ p: new Vector3(side * 5.5 + ((i % 3) - 1) * 1.15, h / 2 - 0.25, -12.6 + (Math.floor(i / 3) - 1) * 1.15), h });
  }
}
const clusters = new InstancedMesh(clusterGeo, slabMat, clusterSpots.length);
{
  const o = new Object3D();
  clusterSpots.forEach((c, i) => { o.position.copy(c.p); o.scale.set(1, c.h, 1); o.updateMatrix(); clusters.setMatrixAt(i, o.matrix); });
}
world.add(clusters);

// the T, and the same T in parts (head + four stem slabs) for the products scene
const tMat = edgeMaterial({ color: new Color('#45265f'), edge: C.purple400, intensity: 3.2, roughness: 0.36, metalness: 0.2, side: DoubleSide });
const tFull = new Mesh(extrude(T_PATH), tMat);
tFull.position.y = 0;
const tGroup = new Group();
tGroup.add(tFull);
world.add(tGroup);
const head = new Mesh(extrude(HEAD_PATH), tMat);
head.visible = false;
tGroup.add(head);

const MOD_W = 85.7 * S + 4.8 * S, MOD_H = 19.4 * S, MOD_D = 44 * S, GROW = 2.7;
const modGeo = new RoundedBoxGeometry(MOD_W, MOD_H, MOD_D, 3, 0.09);
{ // morph target: the top half moves up by GROW, so a slab grows into a tall module without stretching its bevels
  const pos = modGeo.attributes.position;
  const tall = new Float32Array(pos.array.length);
  for (let i = 0; i < pos.count; i++) {
    tall[i * 3] = 0; tall[i * 3 + 1] = pos.getY(i) > 0 ? GROW : 0; tall[i * 3 + 2] = 0;
  }
  modGeo.morphAttributes.position = [new (pos.constructor)(tall, 3)];
  modGeo.morphTargetsRelative = true;
}
const modMats = [0, 1, 2, 3].map((i) => edgeMaterial({ color: new Color('#45265f'), roughness: 0.36, metalness: 0.2, edge: i === 1 ? C.magenta400 : C.purple400, intensity: 1.2 }));
const mods = modMats.map((m) => { const mesh = new Mesh(modGeo, m); mesh.morphTargetInfluences = [0]; mesh.visible = false; tGroup.add(mesh); return mesh; });
const stackY = [0, 1, 2, 3].map((i) => (221 - (151 + 20 * i)) * S + LIFT);
const rowX = [-4.65, -1.55, 1.55, 4.65];

// new services: three pale panels to the right; the AI model: a magenta block
const panelMat = new MeshStandardMaterial({ color: C.ink200, roughness: 0.6, metalness: 0, transparent: true, opacity: 0.3, emissive: C.orange500, emissiveIntensity: 0.05, depthWrite: false });
const panels = [0, 1, 2].map((i) => {
  const m = new Mesh(new RoundedBoxGeometry(1.8, 0.8, 0.06, 2, 0.02), panelMat);
  m.position.set(6.7, 1.55 + i * 1.0, -0.4);
  m.rotation.y = -0.45;
  world.add(m);
  return m;
});
const aiMat = edgeMaterial({ color: new Color('#3d0f48'), edge: C.magenta400, intensity: 3.5, emissive: C.magenta500.clone().multiplyScalar(0.35), roughness: 0.3 });
const ai = new Mesh(new RoundedBoxGeometry(0.95, 0.95, 0.95, 3, 0.12), aiMat);
world.add(ai);
const AI_HERO = new Vector3(5.85, 6.45, 0.1);
const AI_WALLED = new Vector3(1.55, 0.66, 3.9);

// industry channels: flat lanes with glowing long edges, growing out from behind the T
const chanMat = edgeMaterial({ color: new Color('#160c20'), edge: C.purple400, intensity: 2.4, roughness: 0.5 });
const chanA = new Vector3(0.8, 0.12, -2.2), chanB = new Vector3(4.7, 0.12, -10.6);
const channels = [-1, 1].map((side) => {
  const a = chanA.clone().setX(chanA.x * side), b = chanB.clone().setX(chanB.x * side);
  const len = a.distanceTo(b);
  const pivot = new Group();
  pivot.position.copy(a);
  pivot.rotation.y = Math.atan2(b.x - a.x, b.z - a.z);
  const lane = new Mesh(new RoundedBoxGeometry(0.9, 0.12, len, 2, 0.05), chanMat);
  lane.rotation.y = 0;
  lane.position.z = len / 2;
  // the long edges of a lane run along local z: turn the mask's axis by rotating the geometry
  lane.geometry.rotateY(Math.PI / 2);
  lane.rotation.y = -Math.PI / 2;
  pivot.add(lane);
  world.add(pivot);
  return pivot;
});

// the walls round the AI block (OrientAI: the data stays on the enterprise side)
const wallMat = new MeshStandardMaterial({ color: C.ink300, roughness: 0.85, metalness: 0, transparent: true, opacity: 0.55, depthWrite: false });
const walls = new Group();
for (let i = 0; i < 4; i++) {
  const w = new Mesh(new RoundedBoxGeometry(2.4, 1, 0.08, 2, 0.03), wallMat);
  w.geometry.translate(0, 0.5, 0);
  const a = (i * Math.PI) / 2;
  w.position.set(Math.sin(a) * 1.2, -0.05, Math.cos(a) * 1.2);
  w.rotation.y = a;
  walls.add(w);
}
walls.position.copy(AI_WALLED).setY(0.05);
world.add(walls);

// the logo's two grey parts, for the last scene
const logoMat = new MeshStandardMaterial({ color: C.logoGrey, roughness: 0.6, metalness: 0, emissive: C.logoGrey, emissiveIntensity: 0.12 });
const centred = (d, at) => { const g = extrude(d); const c = svgToWorld(at[0], at[1]); g.translate(-c.x, -(c.y - LIFT), 0); const m = new Mesh(g, logoMat); m.userData.home = c; m.position.copy(c); return m; };
const logoSquare = centred(SQUARE_PATH, [306.5, 175.1]);
const logoEllipse = centred(ELLIPSE_PATH, [302.4, 96]);
tGroup.add(logoSquare, logoEllipse);

// ---------- pulses: short capsules that only travel along paths ----------
const PULSE_MAX = 220;
const pulseMesh = new InstancedMesh(new CapsuleGeometry(0.05, 0.36, 4, 8), new MeshBasicMaterial({ color: 0xffffff, toneMapped: false }), PULSE_MAX);
pulseMesh.frustumCulled = false;
world.add(pulseMesh);
const pulses = [];
const hot = (c, k) => c.clone().multiplyScalar(k);
const ORANGE = hot(C.orange500, 2.6), MAGENTA = hot(C.magenta400, 2.6);
function lane(points, color, n, speed, group) {
  const curve = new CatmullRomCurve3(points.map((p) => new Vector3(...p)), false, 'centripetal');
  const len = curve.getLength();
  const count = Math.max(2, Math.round(n * tier.density));
  for (let i = 0; i < count && pulses.length < PULSE_MAX; i++) {
    pulses.push({ curve, len, u0: i / count + Math.random() * 0.04, speed: speed * (0.9 + Math.random() * 0.2), group });
    pulseMesh.setColorAt(pulses.length - 1, color);
  }
}
const Z = 0.82; // just in front of the T's face
for (const [i, x] of [-0.72, 0, 0.72].entries()) {
  const start = [[-2.6, 0.14, 3.7], [0.3, 0.14, 4.1], [2.4, 0.14, 3.1]][i];
  lane([start, [x * 0.8, 0.16, 1.5], [x, 0.4, Z], [x, 1.55 + i * 0.2, Z], [1.1, 1.9 + i * 0.22, Z], [2.6, 2.0 + i * 0.4, 0.5], [5.9, 1.55 + i * 1.0, -0.12]], ORANGE, 9, 2.2, 'hero');
}
lane([[-1.5, 0.14, 4.4], [0.9, 0.16, 1.6], [1.0, 0.45, Z], [1.0, 2.3, Z], [1.3, 3.25, Z], [2.15, 4.35, Z], [3.25, 5.15, Z], [4.25, 5.7, Z], [5.4, 6.25, 0.4]], MAGENTA, 9, 2.0, 'hero');
lane([[-3.3, 0.14, 2.6], [-0.3, 0.16, 1.4], [0.45, 0.45, Z], [0.55, 2.6, Z], [1.05, 3.6, Z], [1.9, 4.6, Z], [3.0, 5.35, Z], [4.4, 5.85, Z], [5.5, 6.3, 0.3]], MAGENTA, 7, 1.8, 'hero');
for (const side of [-1, 1]) {
  for (const off of [-0.2, 0.2]) {
    const a = chanA.clone().setX(chanA.x * side), b = chanB.clone().setX(chanB.x * side);
    const dir = new Vector3().subVectors(b, a).normalize();
    const n = new Vector3(dir.z, 0, -dir.x).multiplyScalar(off);
    lane([[0, 0.35, -0.9], [a.x + n.x, 0.32, a.z + n.z], [(a.x + b.x) / 2 + n.x, 0.32, (a.z + b.z) / 2 + n.z], [b.x + n.x, 0.32, b.z + n.z], [side * 5.5, 0.9, -12.3]], ORANGE, 7, 2.6, side < 0 ? 'fin' : 'gov');
  }
}
for (let m = 0; m < 4; m++) {
  const x = rowX[m];
  for (const off of [-0.6, 0.6]) {
    lane([[x + off * 1.6, 0.14, 4.0], [x + off, 0.16, 1.6], [x + off, 0.42, Z], [x + off, 0.42 + MOD_H + GROW - 0.2, Z]], m === 1 ? MAGENTA : ORANGE, 5, 1.6, `mod${m}`);
  }
}
for (const [dx, dz] of [[-2.6, 2.2], [2.4, 2.4], [-1.8, -1.6]]) {
  lane([[AI_WALLED.x + dx, 0.14, AI_WALLED.z + dz], [AI_WALLED.x + dx * 0.5, 0.2, AI_WALLED.z + dz * 0.5], [AI_WALLED.x + dx * 0.22, 0.5, AI_WALLED.z + dz * 0.22], [AI_WALLED.x, 0.66, AI_WALLED.z]], ORANGE, 5, 1.4, 'walled');
}

// ---------- vignettes: the three AI results, rendered as stills for the quiet section ----------
const V0 = new Vector3(60, 0, 0);
const vig = new Group();
vig.position.copy(V0);
vig.visible = false;
world.add(vig);
const vigSlabs = new InstancedMesh(slabGeo, slabMat, 9);
{ const q = new Object3D(); for (let i = 0; i < 9; i++) { q.position.set(((i % 3) - 1) * (SLAB + GAP), -0.1, (Math.floor(i / 3) - 1) * (SLAB + GAP)); q.updateMatrix(); vigSlabs.setMatrixAt(i, q.matrix); } }
vig.add(vigSlabs);
const vigAi = new Mesh(ai.geometry, aiMat);
vigAi.position.set(0, 0.75, 0);
vigAi.rotation.set(0.45, 0.6, 0.2);
vig.add(vigAi);
const sheetMat = new MeshStandardMaterial({ color: C.ink200, roughness: 0.7, metalness: 0 });
const sheets = new InstancedMesh(new RoundedBoxGeometry(0.9, 0.03, 0.66, 1, 0.01), sheetMat, 12);
const towers = new InstancedMesh(new RoundedBoxGeometry(0.75, 1, 0.75, 2, 0.05), slabMat, 4);
vig.add(sheets, towers);
const VIG = {
  claim: { sheets: [0, 1, 2, 3, 4].map((k) => [-2.0, 0.08 + k * 0.055, 0.7, 1, 0.12 * k]), towers: [] },
  filing: { sheets: [[-2.3, 0.08, 1.2, 0.7, 0.4], [-1.9, 0.08, 0.1, 1.25, -0.3], [-1.4, 0.08, 1.5, 0.55, 0.9], [-2.4, 0.08, -0.7, 0.9, 0.2], [1.7, 0.08, 0.6, 1, 0], [1.7, 0.135, 0.6, 1, 0], [1.7, 0.19, 0.6, 1, 0]], towers: [] },
  fraud: { sheets: [], towers: [[-1.9, 0.75, -1.6, 1.5], [1.9, 0.6, -1.6, 1.2], [-1.9, 0.55, 1.6, 1.1], [1.9, 0.8, 1.6, 1.6]] },
};
const vl = (pts, n, g) => lane(pts.map(([x, y, z]) => [x + V0.x, y + V0.y, z + V0.z]), MAGENTA, n, 1.4, g);
vl([[-2.0, 0.4, 0.7], [-1.3, 0.55, 0.45], [-0.6, 0.7, 0.2], [0, 0.75, 0]], 5, 'vclaim');
vl([[-2.1, 0.3, 1.0], [-1.4, 0.5, 0.8], [-0.6, 0.7, 0.3], [0, 0.75, 0]], 4, 'vclaim');
vl([[-2.2, 0.2, 0.4], [-1.2, 0.6, 0.3], [0, 0.75, 0], [1.0, 0.5, 0.4], [1.7, 0.3, 0.6]], 7, 'vfiling');
for (const [x, y, z] of VIG.fraud.towers) {
  vl([[0, 0.75, 0], [x * 0.5, 0.95, z * 0.5], [x * 0.92, y + 0.2, z * 0.92]], 3, 'vfraud');
  vl([[x * 0.92, y - 0.2, z * 0.92], [x * 0.5, 0.45, z * 0.5], [0, 0.6, 0]], 3, 'vfraud');
}
function showVignette(name) {
  vig.visible = true;
  const v = VIG[name];
  const q = new Object3D();
  for (let i = 0; i < 12; i++) {
    const sh = v.sheets[i];
    if (sh) { q.position.set(sh[0], sh[1], sh[2]); q.scale.set(sh[3], 1, sh[3]); q.rotation.set(0, sh[4], 0); } else q.scale.setScalar(0.0001);
    q.updateMatrix(); sheets.setMatrixAt(i, q.matrix);
  }
  for (let i = 0; i < 4; i++) {
    const t = v.towers[i];
    if (t) { q.position.set(t[0], t[3] / 2 - 0.05, t[2]); q.scale.set(1, t[3], 1); q.rotation.set(0, 0, 0); } else q.scale.setScalar(0.0001);
    q.updateMatrix(); towers.setMatrixAt(i, q.matrix);
  }
  sheets.instanceMatrix.needsUpdate = true;
  towers.instanceMatrix.needsUpdate = true;
  frameCam({ pos: V0.clone().add(V(3.4, 3.1, 5.0)), target: V0.clone().add(V(-0.3, 0.45, 0.2)), fov: 34 });
  const st = baseState();
  st.panels = 0; st.aiScale = 0.0001; st.w = { [`v${name}`]: 1 };
  return st;
}

const UP = new Vector3(0, 1, 0);
const dummy = new Object3D();
const tmpV = new Vector3();
function updatePulses(time, weights) {
  for (let i = 0; i < pulses.length; i++) {
    const p = pulses[i];
    const w = weights[p.group] ?? 0;
    if (w <= 0.001) { dummy.scale.setScalar(0); dummy.updateMatrix(); pulseMesh.setMatrixAt(i, dummy.matrix); continue; }
    const u = (p.u0 + (time * p.speed) / p.len) % 1;
    p.curve.getPointAt(u, dummy.position);
    p.curve.getTangentAt(u, tmpV);
    dummy.quaternion.setFromUnitVectors(UP, tmpV.normalize());
    const s = w * MathUtils.smoothstep(u, 0, 0.06) * (1 - MathUtils.smoothstep(u, 0.9, 1));
    dummy.scale.set(s, s, s);
    dummy.updateMatrix();
    pulseMesh.setMatrixAt(i, dummy.matrix);
  }
  pulseMesh.instanceMatrix.needsUpdate = true;
  if (pulseMesh.instanceColor) pulseMesh.instanceColor.needsUpdate = true;
}

// ---------- post ----------
let composer = null, bloom = null;
if (tier.bloom) {
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  bloom = new UnrealBloomPass(new Vector2(800, 500), 1.1, 0.42, 0.7);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
}

// ---------- states ----------
const ss = (a, b, x) => MathUtils.smoothstep(x, a, b);
const lerp = MathUtils.lerp;
const vlerp = (a, b, t) => new Vector3().lerpVectors(a, b, t);
const curvePos = (pts) => new CatmullRomCurve3(pts.map((p) => new Vector3(...p)), false, 'centripetal');
const V = (x, y, z) => new Vector3(x, y, z);

// camera framings (position, target, fov)
const CAM = {
  hero: { pos: V(-5.6, 1.1, 17.5), target: V(1.0, 3.2, 0), fov: 38, shift: [0.2, 0.17] },
  ind: { pos: V(0, 8.6, -1.6), target: V(0, -0.6, -9.6), fov: 46 },
  modFar: { pos: V(-4.0, 6.6, 34), target: V(-4.0, 4.6, 0), fov: 38 },
  mod: { pos: V(-4.0, 6.2, 20.5), target: V(-4.0, 4.7, 0), fov: 38 },
  walled: { pos: V(-3.2, 7.2, 17.5), target: V(-3.0, 3.6, 0), fov: 38 },
  logo: { pos: V(-3.3, 4.3, 22), target: V(-3.3, 4.1, 0), fov: 38 },
  phone: { pos: V(1.3, 3.0, 20.5), target: V(1.3, 3.25, 0), fov: 38 },
};
const divePos = curvePos([[-5.6, 1.1, 17.5], [-2.7, 1.45, 8.6], [-0.3, 1.5, 3.0], [0, 1.45, 0.9], [0, 1.5, -1.2], [0, 3.8, -2.6], [0, 8.6, -1.6]]);
const diveTarget = curvePos([[1.0, 3.2, 0], [0.2, 2.0, 0], [0, 1.55, -2], [0, 1.4, -4], [0, 1.0, -6.5], [0, 0.2, -8.5], [0, -0.6, -9.6]]);

// shift: moves the picture by a fraction of the screen (setViewOffset), so the subject sits where the
// layout left room for it without turning the camera
function frameCam(f) {
  camera.position.copy(f.pos);
  camera.fov = f.fov;
  const [sx, sy] = f.shift ?? [0, 0];
  if (sx || sy) camera.setViewOffset(W, H, -sx * W, -sy * H, W, H); else camera.clearViewOffset();
  camera.updateProjectionMatrix();
  camera.lookAt(f.target);
}
const mixShift = (a, b, t) => { const x = a.shift ?? [0, 0], y = b.shift ?? [0, 0]; return [lerp(x[0], y[0], t), lerp(x[1], y[1], t)]; };
const mixCam = (a, b, t) => ({ pos: vlerp(a.pos, b.pos, t), target: vlerp(a.target, b.target, t), fov: lerp(a.fov, b.fov, t), shift: mixShift(a, b, t) });

// st: everything the world can do, as numbers. apply() turns them into transforms.
function baseState() {
  return { split: 0, grow: 0, headLift: 0, lit: [0, 0, 0, 0], panels: 1, chan: 0, aiPos: AI_HERO.clone(), aiScale: 1, walls: 0, fold: 0, edge: 1, w: { hero: 1 } };
}
function stateGate(p) {
  const st = baseState();
  const u = ss(0.12, 0.54, p);
  if (u <= 0) frameCam(CAM.hero);
  else {
    const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
    frameCam({ pos: divePos.getPoint(e), target: diveTarget.getPoint(e), fov: lerp(38, 46, ss(0.5, 1, e)), shift: CAM.hero.shift.map((v) => v * (1 - ss(0, 0.3, e))) });
  }
  st.chan = ss(0.4, 0.62, p);
  st.w = { hero: 1 - ss(0.5, 0.7, p) * 0.6, fin: st.chan, gov: st.chan };
  return st;
}
function stateModules(p) {
  const st = baseState();
  st.panels = 0;
  st.split = ss(0.05, 0.17, p);
  st.grow = ss(0.13, 0.24, p);
  st.headLift = ss(0.05, 0.2, p);
  const active = activeModule(p);
  st.lit = [0, 1, 2, 3].map((i) => (p < 0.2 ? 0.25 : i === active ? 1 : i < active ? 0.45 : 0.2));
  const orient = ss(0.7, 0.82, p);
  st.walls = ss(0.74, 0.9, p);
  st.aiPos = vlerp(V(AI_WALLED.x, 9, AI_WALLED.z - 2), AI_WALLED, ss(0.66, 0.8, p));
  st.aiScale = ss(0.64, 0.74, p);
  if (orient > 0) st.lit = st.lit.map((l) => lerp(l, 0.25, orient));
  const cam = p < 0.2 ? mixCam(CAM.modFar, CAM.mod, ss(0, 0.2, p)) : mixCam(CAM.mod, CAM.walled, ss(0.7, 0.86, p));
  frameCam(cam);
  st.w = {};
  for (let i = 0; i < 4; i++) st.w[`mod${i}`] = p > 0.2 && p < 0.84 && i === active ? 1 - orient : 0;
  st.w.walled = st.walls;
  return st;
}
function stateLogo(p) {
  const end = stateModules(1);
  const st = baseState();
  const a = ss(0.05, 0.75, p);
  st.panels = 0;
  st.grow = 1 - ss(0.05, 0.3, p);
  st.split = 1 - ss(0.22, 0.55, p);
  st.headLift = 1 - ss(0.25, 0.6, p);
  st.walls = 1 - ss(0.0, 0.25, p);
  st.fold = ss(0.35, 0.75, p);
  st.lit = end.lit.map((l) => lerp(l, 0.25, a));
  st.aiPos = vlerp(AI_WALLED, logoEllipse.userData.home, ss(0.3, 0.7, p));
  st.aiScale = 1 - st.fold;
  st.w = { walled: 1 - ss(0, 0.3, p) };
  st.edge = 1;
  frameCam(mixCam(CAM.walled, CAM.logo, ss(0.0, 0.7, p)));
  return st;
}
const activeModule = (p) => MathUtils.clamp(Math.floor((p - 0.2) / 0.125), 0, 3);

const o = new Object3D();
function apply(st, time) {
  // the T: whole until it cracks, then head + four modules
  const parts = st.split > 0.001 || st.grow > 0.001 || st.headLift > 0.001;
  tFull.visible = !parts;
  head.visible = parts;
  head.position.set(0, st.headLift * 1.05, -st.headLift * 2.6);
  for (let i = 0; i < 4; i++) {
    const m = mods[i];
    m.visible = parts;
    const hh = MOD_H / 2;
    const stackPos = V(0, stackY[i], 0);
    const rowPos = V(rowX[i], 0.05 + hh + 0.02, 0);
    const t = st.split;
    // each slab leaves the stack on its own beat, so the crack reads as four pieces
    const ti = MathUtils.clamp(t * 1.6 - i * 0.2, 0, 1);
    const e = ti * ti * (3 - 2 * ti);
    m.position.copy(vlerp(stackPos, rowPos, e));
    m.position.z += Math.sin(e * Math.PI) * 1.4;
    m.rotation.y = Math.sin(e * Math.PI) * 0.35 * (i % 2 ? 1 : -1);
    m.morphTargetInfluences[0] = st.grow;
    setEdge(modMats[i], 0.6 + st.lit[i] * 3.0);
  }
  // existing systems: slabs stay home, then fold into the logo's grey square
  const sq = logoSquare.userData.home;
  for (let i = 0; i < SLABS; i++) {
    const h = slabHome[i];
    const f = MathUtils.clamp(st.fold * 1.4 - (i % 5) * 0.08, 0, 1);
    o.position.copy(vlerp(h, sq, f));
    o.scale.setScalar(Math.max(0.001, 1 - f));
    o.rotation.set(0, f * 1.2, 0);
    o.updateMatrix();
    slabs.setMatrixAt(i, o.matrix);
  }
  slabs.instanceMatrix.needsUpdate = true;
  slabs.visible = st.fold < 0.999;
  ground.material.opacity = 1;
  logoSquare.scale.setScalar(Math.max(0.0001, st.fold));
  logoSquare.visible = st.fold > 0.001;
  logoEllipse.scale.setScalar(Math.max(0.0001, ss(0.4, 1, st.fold)));
  logoEllipse.visible = st.fold > 0.001;
  clusters.visible = st.chan > 0.001;
  // services panels and the AI block
  panels.forEach((m) => { m.visible = st.panels > 0.01; });
  ai.visible = st.aiScale > 0.001;
  ai.position.copy(st.aiPos);
  ai.position.y += Math.sin(time * 1.3) * 0.06 * (1 - st.fold);
  ai.scale.setScalar(Math.max(0.0001, st.aiScale));
  ai.rotation.set(0.45, time * 0.35, 0.2);
  // channels grow out from the stem
  channels.forEach((c) => { c.visible = st.chan > 0.001; c.scale.set(1, 1, Math.max(0.0001, st.chan)); });
  walls.visible = st.walls > 0.001;
  walls.children.forEach((w) => { w.scale.y = Math.max(0.0001, st.walls * 1.6); });
  updatePulses(time, st.w);
}

// ---------- size, render ----------
let W = 1, H = 1;
function resize() {
  const r = host.getBoundingClientRect();
  W = Math.max(1, Math.round(LIVE ? innerWidth : r.width));
  H = Math.max(1, Math.round(LIVE ? innerHeight : r.height));
  renderer.setSize(W, H, false);
  camera.aspect = W / H;
  camera.updateProjectionMatrix();
  if (composer) { composer.setSize(W, H); composer.setPixelRatio(tier.dpr); }
}
function draw() { if (composer) composer.render(); else renderer.render(scene, camera); }

// ---------- scroll ----------
gsap.registerPlugin(ScrollTrigger);
const scenes = [...document.querySelectorAll('.scene[data-scene]')];
const [gateEl, modEl, logoEl] = scenes;
const casesEl = document.querySelector('#cases');
const prog = { gate: 0, mod: 0, logo: 0, hero: 0 };
const time0 = performance.now();
let frozenTime = null;
const now = () => (frozenTime ?? (performance.now() - time0) / 1000);

function phaseState() {
  const c = casesEl.getBoundingClientRect();
  if (c.top + c.height / 2 > innerHeight / 2) return stateGate(prog.gate);
  if (logoEl.getBoundingClientRect().top > innerHeight) return stateModules(prog.mod);
  return stateLogo(prog.logo);
}

if (LIVE) {
  scenes.forEach((s) => { s.classList.add('is-live'); s.classList.remove('is-rest'); });
  const track = (el, k, start = 'top top') => ScrollTrigger.create({ trigger: el, start, end: 'bottom bottom', onUpdate: (self) => { prog[k] = self.progress; } });
  track(gateEl, 'gate');
  track(modEl, 'mod');
  track(logoEl, 'logo', 'top bottom');

  const scrub = (el, build, start = 'top top') => {
    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: el, start, end: 'bottom bottom', scrub: true } });
    build(tl);
    tl.set({}, {}, 1);
    return tl;
  };
  scrub(gateEl, (tl) => {
    tl.to('.hero h1', { y: -90, autoAlpha: 0, duration: 0.1, ease: 'power2.in' }, 0.08)
      .to('.hero-copy', { y: -60, autoAlpha: 0, duration: 0.09, ease: 'power2.in' }, 0.07)
      .fromTo('.ind h2', { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, duration: 0.09, ease: 'power2.out' }, 0.48)
      .fromTo('.door', { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: 0.08, stagger: 0.04, ease: 'power2.out' }, 0.58);
  });
  scrub(modEl, (tl) => {
    // OrientAI joins the index instead of replacing it: the four products stay readable above it
    const lift = () => -(document.querySelector('.orient').offsetHeight + 16 - document.querySelector('.prod-foot').offsetHeight - 16);
    tl.to('.prod-foot', { autoAlpha: 0, duration: 0.04 }, 0.7)
      .fromTo('.prod-index', { y: 0 }, { y: lift, duration: 0.07, ease: 'power2.inOut' }, 0.71)
      .fromTo('.orient', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.07, ease: 'power2.out' }, 0.76);
  });
  scrub(logoEl, (tl) => {
    tl.fromTo('.contact h2', { y: 50 }, { y: 0, duration: 0.4, ease: 'power1.out' }, 0)
      .fromTo('.contact-side', { y: 80 }, { y: 0, duration: 0.45, ease: 'power1.out' }, 0);
  }, 'top bottom');

  // the product index follows the lit module
  const links = [...document.querySelectorAll('.prod-list a')];
  const count = document.querySelector('.prod-count');
  let shown = -1;
  ScrollTrigger.create({ trigger: modEl, start: 'top top', end: 'bottom bottom', onUpdate: (self) => {
    const a = activeModule(self.progress);
    if (a === shown) return;
    shown = a;
    links.forEach((l, i) => l.classList.toggle('is-on', i === a));
    count.textContent = `第 ${a + 1} 個，共 4 個`;
  } });
  links[0].classList.add('is-on');
  shown = 0;

  // in-page links land where their section is readable inside a held scene
  const jump = { '#industries': () => gateEl.offsetTop + innerHeight * 2 * 0.86, '#products': () => modEl.offsetTop + innerHeight * 3 * 0.25 };
  document.addEventListener('click', (ev) => {
    const a = ev.target.closest('a[href^="#"]');
    if (!a || !jump[a.getAttribute('href')]) return;
    ev.preventDefault();
    window.scrollTo({ top: jump[a.getAttribute('href')](), behavior: 'smooth' });
    history.replaceState(null, '', a.getAttribute('href'));
  });
} else {
  scenes.forEach((s) => s.classList.add('is-rest'));
  ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom top', onUpdate: (self) => { prog.hero = self.progress; } });
}

// entrances for the quiet section, once (motion layer, references/motion.md)
gsap.utils.toArray('.cases h2, .case, .cases .more').forEach((el, i) => {
  gsap.fromTo(el, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out', delay: el.matches('.case') ? 0.09 * (i - 1) : 0, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
});

// hero tags: projected from two slabs (directions.md: system names from the facts)
const tags = [...document.querySelectorAll('.tags .tag')];
const tagAt = [V(-3.03, 0.06, 3.03), V(3.03, 0.06, 1.01)];
function placeTags(visible) {
  if (!LIVE) return;
  const top = document.querySelector('.hero').getBoundingClientRect().top;
  tags.forEach((t, i) => {
    if (!visible) { t.hidden = true; return; }
    tmpV.copy(tagAt[i]).project(camera);
    t.hidden = false;
    t.style.left = `${((tmpV.x + 1) / 2) * W}px`;
    t.style.top = `${((1 - tmpV.y) / 2) * H - top}px`;
  });
}

// ---------- loop ----------
let ready = false, running = true, last = 0;
function frame() {
  if (!running) return;
  requestAnimationFrame(frame);
  if (document.hidden) return;
  let st;
  if (LIVE) {
    const c = casesEl.getBoundingClientRect();
    if (c.top <= 0 && c.bottom >= innerHeight) return; // the quiet section covers the world: pause
    st = phaseState();
    placeTags(prog.gate < 0.06);
  } else {
    const r = host.getBoundingClientRect();
    if (r.bottom < 0) return;
    st = baseState();
    const f = { ...CAM.phone, target: CAM.phone.target.clone().add(V(0, prog.hero * 3.4, 0)) };
    frameCam(f);
  }
  apply(st, now());
  draw();
  if (!ready) { ready = true; host.classList.add('is-ready'); }
}
resize();
addEventListener('resize', () => { resize(); ScrollTrigger.refresh(); });
requestAnimationFrame(frame);

// ---------- stills: the same world rendered at each scene's stop (README「靜態圖」) ----------
const SHOTS = {
  'poster-hero': () => { const st = stateGate(0); return st; },
  'still-hero': () => { const st = stateGate(0); frameCam({ pos: V(-3.2, 1.0, 15.5), target: V(1.2, 3.35, 0), fov: 38 }); return st; },
  'still-industries': () => { const st = stateGate(1); frameCam({ pos: V(0, 5.6, -2.4), target: V(0, -0.4, -12.8), fov: 44 }); return st; },
  'still-products': () => { const st = stateModules(0.8); st.walls = 1; st.aiScale = 1; st.aiPos = AI_WALLED.clone(); st.lit = [1, 1, 1, 1]; st.w = { mod0: 1, mod1: 1, mod2: 1, mod3: 1, walled: 1 }; frameCam({ pos: V(0.6, 6.0, 19.5), target: V(0.4, 2.3, 0), fov: 38 }); return st; },
  'still-logo': () => { const st = stateLogo(1); frameCam({ pos: V(1.6, 3.2, 17.0), target: V(1.6, 3.05, 0), fov: 38 }); return st; },
  'phone-hero': () => { const st = stateGate(0); frameCam(CAM.phone); return st; },
  'door-fin': () => { const st = stateGate(1); frameCam({ pos: V(-1.6, 2.6, -6.2), target: V(-5.3, 0.6, -12.4), fov: 34 }); return st; },
  'door-gov': () => { const st = stateGate(1); frameCam({ pos: V(1.6, 2.6, -6.2), target: V(5.3, 0.6, -12.4), fov: 34 }); return st; },
  'case-claim': () => showVignette('claim'),
  'case-filing': () => showVignette('filing'),
  'case-fraud': () => showVignette('fraud'),
};
window.__tg = {
  capture(name, w, h, quality = 0.88) {
    running = false;
    frozenTime = 3.2;
    const keep = { W, H };
    renderer.setPixelRatio(1);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    if (composer) { composer.setPixelRatio(1); composer.setSize(w, h); }
    vig.visible = false;
    const st = SHOTS[name]();
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    apply(st, frozenTime);
    draw();
    const url = renderer.domElement.toDataURL('image/webp', quality);
    W = keep.W; H = keep.H;
    return url;
  },
  tagAt: () => tagAt.map((v) => v.toArray()),
  project(points) { return points.map((p) => { const v = V(...p).project(camera); return [(v.x + 1) / 2, (1 - v.y) / 2]; }); },
  state: () => ({ ...prog }),
  dbg: { slabs, ai, logoSquare, logoEllipse, tFull, head, mods, pulseMesh, walls, clusters, channels, panels, get composer() { return composer; }, set composer(v) { composer = v; } },
};
