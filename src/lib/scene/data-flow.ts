// Direction A, Data Flow (M3-07, #54): a network of light points and beams. Particles stream from
// a source along a trunk that branches to four product-family hubs, then fan out to the products
// around each hub. Scrolling moves the camera forward along the trunk, one hub per chapter.
// Everything is generated here: particle paths are quadratic Béziers evaluated in the vertex
// shader, so the CPU only updates a few uniforms per frame.
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  LineBasicMaterial,
  LineSegments,
  Points,
  ShaderMaterial,
  Vector3,
} from 'three';
import { placeCamera, smoothstep, type SceneFactory } from './runtime';

// Desktop budget; the mobile tier scales counts by its density
const STREAM_PARTICLES = 5200;
const DUST_PARTICLES = 1400;
// Products per family hub, in nodes.csv order (AI, DigiLism, GadoSecurity, ESGswift)
const LEAVES = [9, 6, 2, 2];
// World layout along the camera's forward axis
const HUB_SPACING = 22;
const HUB_LATERAL = 9;
const LEAF_RADIUS = 6;
const CAMERA_DISTANCE = 34;
// The hero pulls back to show the whole network, like the static image
const OVERVIEW_DISTANCE = 88;
// Desktop camera swings around the target as it moves (radians)
const ORBIT_SWING = 0.28;

const VERTEX = /* glsl */ `
  attribute vec3 p0;
  attribute vec3 p1;
  attribute vec3 p2;
  attribute vec2 seed; // x: phase, y: speed
  attribute float hue;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec3 uFocus;
  uniform float uOverview; // 1 in the hero: every hub lit
  varying float vHue;
  varying float vFade;

  void main() {
    float t = fract(seed.x + uTime * seed.y);
    vec3 a = mix(p0, p1, t);
    vec3 b = mix(p1, p2, t);
    vec3 pos = mix(a, b, t);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    // Brighter near the hub the camera is on
    float focus = max(1.0 - smoothstep(4.0, 26.0, distance(pos, uFocus)), uOverview * 0.75);
    vFade = (0.35 + 0.65 * focus) * smoothstep(0.0, 0.08, t) * (1.0 - smoothstep(0.9, 1.0, t));
    vHue = hue;
    gl_PointSize = uSize * uPixelRatio * (0.6 + focus) * (30.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uColors[3];
  varying float vHue;
  varying float vFade;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float glow = smoothstep(0.5, 0.0, d);
    vec3 color = vHue < 0.5 ? mix(uColors[0], uColors[1], vHue * 2.0) : mix(uColors[1], uColors[2], vHue * 2.0 - 1.0);
    gl_FragColor = vec4(color * glow * vFade, 1.0);
  }
`;

const createDataFlow: SceneFactory = ({ scene, camera, tier, palette, view }) => {
  // Forward runs away from the camera along the ground; lateral is perpendicular to it
  const forward = new Vector3(-Math.sin(view.azimuth), 0, -Math.cos(view.azimuth));
  const lateral = new Vector3(forward.z, 0, -forward.x);
  const at = (f: number, l: number, y = 0) =>
    new Vector3().addScaledVector(forward, f).addScaledVector(lateral, l).setY(y);

  const source = at(-HUB_SPACING * 0.6, 0);
  const hubs = LEAVES.map((_, i) => at(HUB_SPACING * (i + 1), (i % 2 ? 1 : -1) * HUB_LATERAL, 1.5));
  const leaves = hubs.map((hub, i) =>
    Array.from({ length: LEAVES[i] ?? 0 }, (_, k) => {
      const angle = (k / (LEAVES[i] ?? 1)) * Math.PI * 2;
      return hub.clone().add(new Vector3(Math.cos(angle) * LEAF_RADIUS, Math.sin(angle * 2) * 1.5, Math.sin(angle) * LEAF_RADIUS));
    }),
  );

  // Segments: source → each hub along the trunk, and hub → each of its leaves
  type Segment = { p0: Vector3; p1: Vector3; p2: Vector3; hue: number; weight: number };
  const segments: Segment[] = [];
  hubs.forEach((hub, i) => {
    const hue = i / (hubs.length - 1);
    const bend = at(HUB_SPACING * (i + 0.5), 0, 0.5);
    segments.push({ p0: source, p1: bend, p2: hub, hue, weight: 3 });
    for (const leaf of leaves[i] ?? []) {
      segments.push({ p0: hub, p1: hub.clone().lerp(leaf, 0.5).setY(hub.y + 2.5), p2: leaf, hue: Math.min(1, hue + 0.25), weight: 1 });
    }
  });
  const totalWeight = segments.reduce((sum, s) => sum + s.weight, 0);

  const count = Math.round(STREAM_PARTICLES * tier.density);
  const p0 = new Float32Array(count * 3);
  const p1 = new Float32Array(count * 3);
  const p2 = new Float32Array(count * 3);
  const seed = new Float32Array(count * 2);
  const hue = new Float32Array(count);
  let n = 0;
  for (const s of segments) {
    const share = Math.round((count * s.weight) / totalWeight);
    for (let k = 0; k < share && n < count; k += 1, n += 1) {
      // Jitter the control point so each segment reads as a bundle of strands
      const j = () => (Math.random() - 0.5) * 2.4;
      s.p0.toArray(p0, n * 3);
      new Vector3(s.p1.x + j(), s.p1.y + j() * 0.5, s.p1.z + j()).toArray(p1, n * 3);
      new Vector3(s.p2.x + j() * 0.2, s.p2.y + j() * 0.2, s.p2.z + j() * 0.2).toArray(p2, n * 3);
      seed[n * 2] = Math.random();
      seed[n * 2 + 1] = 0.04 + Math.random() * 0.08;
      hue[n] = Math.min(1, Math.max(0, s.hue + (Math.random() - 0.5) * 0.3));
    }
  }

  const streamGeometry = new BufferGeometry();
  streamGeometry.setAttribute('position', new BufferAttribute(p2, 3));
  streamGeometry.setAttribute('p0', new BufferAttribute(p0, 3));
  streamGeometry.setAttribute('p1', new BufferAttribute(p1, 3));
  streamGeometry.setAttribute('p2', new BufferAttribute(p2, 3));
  streamGeometry.setAttribute('seed', new BufferAttribute(seed, 2));
  streamGeometry.setAttribute('hue', new BufferAttribute(hue, 1));
  streamGeometry.setDrawRange(0, n);
  const uniforms = {
    uTime: { value: 0 },
    uSize: { value: 4.2 },
    uPixelRatio: { value: Math.min(devicePixelRatio, tier.maxDpr) },
    uFocus: { value: hubs[0]?.clone() ?? new Vector3() },
    uOverview: { value: 1 },
    uColors: { value: palette.energy },
  };
  const streamMaterial = new ShaderMaterial({
    uniforms,
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    blending: AdditiveBlending,
    depthWrite: false,
    transparent: true,
  });
  // Particles move in the shader, so the CPU-side bounds are meaningless
  const streams = new Points(streamGeometry, streamMaterial);
  streams.frustumCulled = false;
  scene.add(streams);

  // Faint beams under the particles: each segment drawn as a polyline
  const STEPS = 16;
  const linePositions: number[] = [];
  for (const s of segments) {
    for (let k = 0; k < STEPS; k += 1) {
      for (const t of [k / STEPS, (k + 1) / STEPS]) {
        const a = s.p0.clone().lerp(s.p1, t);
        const b = s.p1.clone().lerp(s.p2, t);
        linePositions.push(...a.lerp(b, t).toArray());
      }
    }
  }
  const beamGeometry = new BufferGeometry();
  beamGeometry.setAttribute('position', new BufferAttribute(new Float32Array(linePositions), 3));
  const beamMaterial = new LineBasicMaterial({ color: palette.line, transparent: true, opacity: 0.55, blending: AdditiveBlending, depthWrite: false });
  scene.add(new LineSegments(beamGeometry, beamMaterial));

  // Hubs and leaves as bright static nodes, plus drifting dust for depth
  const dustCount = Math.round(DUST_PARTICLES * tier.density);
  const nodePoints = [source, ...hubs, ...leaves.flat()];
  const staticCount = nodePoints.length + dustCount;
  const sp0 = new Float32Array(staticCount * 3);
  const sseed = new Float32Array(staticCount * 2);
  const shue = new Float32Array(staticCount);
  nodePoints.forEach((p, k) => {
    p.toArray(sp0, k * 3);
    sseed[k * 2 + 1] = 0;
    shue[k] = k <= hubs.length ? 1 : 0.5;
  });
  const span = HUB_SPACING * (hubs.length + 2);
  for (let k = nodePoints.length; k < staticCount; k += 1) {
    at(Math.random() * span - HUB_SPACING, (Math.random() - 0.5) * 70, (Math.random() - 0.3) * 20).toArray(sp0, k * 3);
    sseed[k * 2] = Math.random();
    shue[k] = Math.random() * 0.6;
  }
  const staticGeometry = new BufferGeometry();
  staticGeometry.setAttribute('position', new BufferAttribute(sp0, 3));
  staticGeometry.setAttribute('p0', new BufferAttribute(sp0, 3));
  staticGeometry.setAttribute('p1', new BufferAttribute(sp0, 3));
  staticGeometry.setAttribute('p2', new BufferAttribute(sp0, 3));
  staticGeometry.setAttribute('seed', new BufferAttribute(sseed, 2));
  staticGeometry.setAttribute('hue', new BufferAttribute(shue, 1));
  const nodeMaterial = streamMaterial.clone();
  nodeMaterial.uniforms = { ...uniforms, uSize: { value: 10 } };
  const nodes = new Points(staticGeometry, nodeMaterial);
  nodes.frustumCulled = false;
  scene.add(nodes);

  // Camera stops: the middle of the network for the hero, then one hub per chapter
  const overview = hubs.reduce((sum, h) => sum.add(h), new Vector3()).divideScalar(hubs.length).lerp(source, 0.3);
  const waypoints = [overview, ...hubs];
  const last = hubs.length;
  const target = new Vector3();
  return {
    update({ progress, time, pointer }) {
      uniforms.uTime.value = time;
      const stop = progress * last;
      const i = Math.min(last - 1, Math.floor(stop));
      const from = waypoints[i] ?? source;
      const to = waypoints[i + 1] ?? from;
      target.copy(from).lerp(to, smoothstep(0, 1, stop - i));
      const focus = waypoints[Math.max(1, Math.round(stop))] ?? to;
      uniforms.uFocus.value.lerp(focus, 0.08);
      uniforms.uOverview.value = 1 - smoothstep(0, 1, stop);

      const swing = tier.path === 'orbit' ? Math.sin(progress * Math.PI * 2) * ORBIT_SWING + pointer.x * 0.08 : 0;
      placeCamera(camera, {
        target,
        distance:
          CAMERA_DISTANCE +
          (OVERVIEW_DISTANCE - CAMERA_DISTANCE) * (1 - smoothstep(0, 1, stop)) -
          (tier.path === 'orbit' ? Math.sin(progress * Math.PI) * 6 : 0),
        elevation: view.elevation + (tier.parallax ? pointer.y * 0.05 : 0),
        azimuth: view.azimuth + swing,
      });
    },
    dispose() {
      streamGeometry.dispose();
      streamMaterial.dispose();
      beamGeometry.dispose();
      beamMaterial.dispose();
      staticGeometry.dispose();
      nodeMaterial.dispose();
    },
  };
};

export default createDataFlow;
