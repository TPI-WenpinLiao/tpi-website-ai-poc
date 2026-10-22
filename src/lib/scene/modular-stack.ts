// Direction B, Modular Stack (M3-07, #54): isometric blocks with glowing rims. The hero shows one
// assembled tower; scrolling into the chapters breaks it apart, flips each block a quarter turn
// and reassembles the blocks into four modules, one per product family. The module of the
// current chapter lifts, lights up and plays its own motion (EFFECTS); the camera glides between
// modules, holding on each one while its chapter is on screen.
// Blocks are one InstancedMesh; the rim is drawn in the fragment shader from the face UVs, so
// there is no edge geometry.
import { BoxGeometry, Color, InstancedBufferAttribute, InstancedMesh, Matrix4, Quaternion, ShaderMaterial, Vector3 } from 'three';
import { placeCamera, smoothstep, type SceneFactory } from './runtime';

// Blocks per module edge: desktop modules are 3×3×3, mobile 2×2×2 (tier density below 0.5)
const EDGE = { full: 3, reduced: 2 };
const MODULES = 4;
const BLOCK = 1;
const GAP = 0.18;
// Distance between module centers in the reassembled row
const MODULE_SPACING = 9;
const LIFT = 2.2;
const EXPLODE = 7;
const CAMERA_DISTANCE = 30;
// Narrow heroes have less room above the copy: frame the tower from further back
const NARROW_HERO_PULLBACK = 16;
// Narrow chapters: the panel sits at the bottom, so raise the camera target (world units) to bring
// the module down from under the scroll progress bar into the space above the panel
const NARROW_CHAPTER_DROP = 3;
const ORBIT_SWING = 0.35;
// Progress at which the tower has become four modules (the first chapter's center)
const SPLIT_END = 0.25;
// Share of each chapter step the camera holds on a module before gliding to the next (each end)
const DWELL = 0.3;
const Y_AXIS = new Vector3(0, 1, 0);
const SPIN_AXIS = new Vector3(1, 1, 0).normalize();

const VERTEX = /* glsl */ `
  attribute float aModule;
  uniform float uActive;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vColor;
  varying float vActive;

  void main() {
    vUv = uv;
    vNormal = normalize(mat3(modelMatrix * instanceMatrix) * normal);
    vColor = instanceColor;
    vActive = 1.0 - min(1.0, abs(aModule - uActive));
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uLight;
  uniform float uRim;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vColor;
  varying float vActive;

  void main() {
    float edge = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
    float rim = smoothstep(uRim, 0.0, edge);
    float shade = 0.55 + 0.45 * max(dot(vNormal, uLight), 0.0);
    vec3 face = mix(uBase, vColor, 0.18 + 0.22 * vActive) * shade;
    vec3 color = face + vColor * rim * (0.9 + 1.4 * vActive);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const createModularStack: SceneFactory = ({ scene, camera, tier, palette, view, isNarrow }) => {
  const edge = tier.density < 0.5 ? EDGE.reduced : EDGE.full;
  const perModule = edge ** 3;
  const count = perModule * MODULES;
  const step = BLOCK + GAP;

  // Row of modules runs along the camera's lateral axis, so all four stay in view
  const lateral = new Vector3(Math.cos(view.azimuth), 0, -Math.sin(view.azimuth));

  // Tower: the modules stacked on top of each other. Row: modules side by side.
  const tower: Vector3[] = [];
  const row: Vector3[] = [];
  const outward: Vector3[] = [];
  const axes: Vector3[] = [];
  // Block position in its module's own grid, centered on the module (x, z) and its middle layer (y)
  const cell: Vector3[] = [];
  const module = new Float32Array(count);
  const center = (edge - 1) / 2;
  for (let m = 0; m < MODULES; m += 1) {
    for (let k = 0; k < perModule; k += 1) {
      const x = (k % edge) - center;
      const z = (Math.floor(k / edge) % edge) - center;
      const y = Math.floor(k / edge ** 2);
      const local = new Vector3(x * step, y * step, z * step);
      tower.push(local.clone().setY(local.y + m * edge * step - (MODULES * edge * step) / 2));
      row.push(local.clone().addScaledVector(lateral, (m - (MODULES - 1) / 2) * MODULE_SPACING).setY(local.y - center * step));
      outward.push(new Vector3(x, (Math.random() - 0.5) * 2, z).normalize().multiplyScalar(EXPLODE * (0.6 + Math.random() * 0.6)));
      axes.push([new Vector3(1, 0, 0), new Vector3(0, 0, 1), new Vector3(0, 1, 0)][(m + k) % 3] ?? new Vector3(0, 1, 0));
      cell.push(new Vector3(x, y - center, z));
      module[m * perModule + k] = m;
    }
  }

  const geometry = new BoxGeometry(BLOCK, BLOCK, BLOCK);
  const uniforms = {
    uActive: { value: -1 },
    uBase: { value: palette.bg.clone().lerp(palette.line, 0.35) },
    uLight: { value: new Vector3(0.4, 1, 0.6).normalize() },
    uRim: { value: 0.06 },
  };
  const material = new ShaderMaterial({
    uniforms,
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
  });
  const blocks = new InstancedMesh(geometry, material, count);
  geometry.setAttribute('aModule', new InstancedBufferAttribute(module, 1));
  const color = new Color();
  for (let n = 0; n < count; n += 1) {
    const m = module[n] ?? 0;
    const [a, b, c] = palette.energy;
    const t = m / (MODULES - 1);
    color.copy(t < 0.5 ? a : b).lerp(t < 0.5 ? b : c, t < 0.5 ? t * 2 : t * 2 - 1);
    blocks.setColorAt(n, color);
  }
  blocks.frustumCulled = false;
  scene.add(blocks);

  const matrix = new Matrix4();
  const rotation = new Quaternion();
  const effectRotation = new Quaternion();
  const position = new Vector3();
  const local = new Vector3();
  const moved = new Vector3();
  const scale = new Vector3(1, 1, 1);
  const shell = 2.6 * step;
  const target = new Vector3();
  const towerCenter = new Vector3();

  /**
   * Each module's own motion while its chapter is on screen, at strength `a` (0–1). Takes the
   * block's cell and its offset from the module center (`local`, world-aligned), writes the moved
   * offset to `moved`, an extra rotation to `effectRotation` and a scale to `scale`.
   */
  const EFFECTS: ((c: Vector3, a: number, t: number) => void)[] = [
    // AI: the layers twist against each other
    (c, a, t) => {
      const angle = a * 0.9 * Math.sin(t * 0.9 + c.y * 1.1);
      moved.copy(local).applyAxisAngle(Y_AXIS, angle);
      effectRotation.setFromAxisAngle(Y_AXIS, angle);
    },
    // Digital transformation: a pulse runs out from the center and the blocks spin
    (c, a, t) => {
      const r = c.length();
      const wave = 0.5 + 0.5 * Math.sin(t * 1.8 - r * 1.4);
      moved.copy(local);
      if (r > 0) moved.addScaledVector(c, (a * wave * 1.2 * step) / r);
      effectRotation.setFromAxisAngle(SPIN_AXIS, a * t * 0.7);
    },
    // Security: the outer blocks orbit the core as a shield; the core beats
    (c, a, t) => {
      if (c.lengthSq() === 0) {
        moved.copy(local);
        effectRotation.identity();
        scale.setScalar(1 + a * 0.3 * Math.sin(t * 3));
        return;
      }
      const theta = Math.atan2(c.z, c.x) + c.y * 0.6 + t * 0.6;
      moved.set(Math.cos(theta) * shell, c.y * step * 0.9, Math.sin(theta) * shell).sub(local).multiplyScalar(a).add(local);
      effectRotation.setFromAxisAngle(Y_AXIS, -theta * a);
    },
    // ESG and energy: columns rise and fall like a level meter
    (c, a, t) => {
      const h = Math.sin(t * 2.2 + (c.x + c.z) * 1.1);
      moved.copy(local);
      moved.y += a * h * 0.7 * step;
      effectRotation.identity();
      scale.set(1, 1 + a * 0.5 * (0.5 + 0.5 * h), 1);
    },
  ];

  /**
   * Continuous chapter coordinate: -1 in the hero, m while chapter m is centered. Between two
   * chapters it holds on each end (DWELL) and eases across, so the camera never snaps.
   */
  const chapterAt = (progress: number) => {
    const c = Math.min(MODULES - 1, Math.max(-1, progress * MODULES - 1));
    const i = Math.floor(c);
    return i + smoothstep(DWELL, 1 - DWELL, c - i);
  };

  return {
    update({ progress, time, pointer }) {
      // 0 → SPLIT_END: break apart, flip and regroup; then one active module per chapter
      const split = smoothstep(0, SPLIT_END, progress);
      const burst = Math.sin(split * Math.PI);
      const chapter = chapterAt(progress);
      uniforms.uActive.value = chapter;

      for (let n = 0; n < count; n += 1) {
        const m = module[n] ?? 0;
        const c = cell[n] ?? position;
        const stagger = smoothstep(0, 1, split * 1.4 - ((n % perModule) / perModule) * 0.4);
        position.copy(tower[n] ?? position).lerp(row[n] ?? position, stagger).addScaledVector(outward[n] ?? position, burst);
        const a = Math.max(0, 1 - Math.abs(m - chapter));
        position.y += a * LIFT + Math.sin(time * 0.8 + m) * 0.15;
        rotation.setFromAxisAngle(axes[n] ?? Y_AXIS, stagger * Math.PI * 0.5);
        scale.setScalar(1);
        if (a > 0) {
          local.copy(c).multiplyScalar(step);
          EFFECTS[m]?.(c, a, time);
          position.add(moved.sub(local));
          rotation.premultiply(effectRotation);
        }
        blocks.setMatrixAt(n, matrix.compose(position, rotation, scale));
      }
      blocks.instanceMatrix.needsUpdate = true;

      // Hero frames the tower; chapters glide to the current module
      const followed = (Math.max(0, chapter) - (MODULES - 1) / 2) * MODULE_SPACING;
      target.copy(towerCenter).addScaledVector(lateral, followed * split);
      if (isNarrow()) target.y += NARROW_CHAPTER_DROP * split;
      const swing = tier.path === 'orbit' ? Math.sin(progress * Math.PI * 1.5) * ORBIT_SWING + pointer.x * 0.08 : 0;
      placeCamera(camera, {
        target,
        distance: CAMERA_DISTANCE + (isNarrow() ? NARROW_HERO_PULLBACK * (1 - split) : 0) - split * (tier.path === 'orbit' ? 8 : 4),
        elevation: view.elevation + (tier.parallax ? pointer.y * 0.05 : 0),
        azimuth: view.azimuth + swing,
      });
    },
    dispose() {
      geometry.dispose();
      material.dispose();
      blocks.dispose();
    },
  };
};

export default createModularStack;
