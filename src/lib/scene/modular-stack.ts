// Direction B, Modular Stack (M3-07, #54): isometric blocks with glowing rims. The hero shows one
// assembled tower; scrolling into the chapters breaks it apart, flips each block a quarter turn
// and reassembles the blocks into four modules, one per product family. The module of the
// current chapter lifts and lights up.
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
const ORBIT_SWING = 0.35;
// Progress at which the tower has become four modules (the first chapter's center)
const SPLIT_END = 0.25;

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

const createModularStack: SceneFactory = ({ scene, camera, tier, palette, view, narrow }) => {
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
  const position = new Vector3();
  const scale = new Vector3(1, 1, 1);
  const target = new Vector3();
  const towerCenter = new Vector3();

  return {
    update({ progress, time, pointer }) {
      // 0 → SPLIT_END: break apart, flip and regroup; then one active module per chapter
      const split = smoothstep(0, SPLIT_END, progress);
      const burst = Math.sin(split * Math.PI);
      const active = progress < SPLIT_END * 0.5 ? -1 : Math.min(MODULES - 1, Math.round(progress * MODULES) - 1);
      uniforms.uActive.value += (active - uniforms.uActive.value) * 0.08;

      for (let n = 0; n < count; n += 1) {
        const m = module[n] ?? 0;
        const stagger = smoothstep(0, 1, split * 1.4 - (n % perModule) / perModule * 0.4);
        position.copy(tower[n] ?? position).lerp(row[n] ?? position, stagger).addScaledVector(outward[n] ?? position, burst);
        const lift = Math.max(0, 1 - Math.abs(m - uniforms.uActive.value));
        position.y += lift * LIFT + Math.sin(time * 0.8 + m) * 0.15;
        rotation.setFromAxisAngle(axes[n] ?? position, stagger * Math.PI * 0.5);
        blocks.setMatrixAt(n, matrix.compose(position, rotation, scale));
      }
      blocks.instanceMatrix.needsUpdate = true;

      // Hero frames the tower; chapters pan to the active module
      const followed = active < 0 ? 0 : (active - (MODULES - 1) / 2) * MODULE_SPACING;
      target.copy(towerCenter).addScaledVector(lateral, followed * split);
      const swing = tier.path === 'orbit' ? Math.sin(progress * Math.PI * 1.5) * ORBIT_SWING + pointer.x * 0.08 : 0;
      placeCamera(camera, {
        target,
        distance: CAMERA_DISTANCE + (narrow ? NARROW_HERO_PULLBACK * (1 - split) : 0) - split * (tier.path === 'orbit' ? 8 : 4),
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
