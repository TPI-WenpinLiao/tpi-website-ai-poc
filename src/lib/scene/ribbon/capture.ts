// Renders the static pictures of the ribbon world (#167): the home page's mobile and reduced-motion
// pictures, the inner pages' heroes, the product thumbnails. scripts/design/ribbon-capture.mjs
// bundles this file, opens it in headless Chromium and calls window.__ribbon.shot() once per picture;
// the pictures and where the labelled blocks land on them come back to the script.
import { Vector3, WebGLRenderer, NoToneMapping, PCFShadowMap, SRGBColorSpace } from 'three';
import {
  applyView,
  buildWorld,
  casesView,
  CITY_EDGE,
  FORK,
  heroStart,
  LIFT,
  newCamera,
  plan,
  PRODUCTS,
  project,
  tailWorld,
  type MapPalette,
  type ProductName,
  type View,
} from './world';
import { paletteFrom } from './world';

export interface Job {
  w: number;
  h: number;
  /** A named view, or one written out */
  view:
    | { kind: 'hero' | 'plan' }
    | { kind: 'cases'; p: number }
    | { kind: 'product'; name: ProductName }
    | { kind: 'enclosure' }
    | { kind: 'custom'; view: View };
  /** Overrides on the named view (halfW, sx, sy, …) */
  override?: Partial<View>;
  /** Builds the tail for this fork box; without it, the wide box centred on the page */
  tail?: { box: keyof typeof FORK; cx: number; fe?: number };
  /** How lit each AI block is */
  levels?: [number, number, number];
}

function viewFor(world: ReturnType<typeof buildWorld>, job: Job, aspect: number): View {
  const v = job.view;
  const base = (): View => {
    switch (v.kind) {
      case 'hero':
        return heroStart();
      case 'plan':
        return plan(aspect);
      case 'cases':
        return casesView(world, v.p);
      case 'product':
        return { target: world.product(v.name).toArray() as [number, number, number], pitch: 38, yaw: -18, halfW: 2.6, sx: 0, sy: -0.1 };
      case 'enclosure':
        return { target: world.enclosure.toArray() as [number, number, number], pitch: 40, yaw: -20, halfW: 3.2, sx: 0, sy: -0.1 };
      case 'custom':
        return v.view;
    }
  };
  return { ...base(), ...job.override };
}

export function install(tokens: Record<string, string>) {
  const palette: MapPalette = paletteFrom((t) => tokens[t] ?? '');
  const renderer = new WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NoToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.setPixelRatio(1);
  document.body.append(renderer.domElement);
  const world = buildWorld(palette);
  const cam = newCamera();

  return {
    PRODUCTS,
    shot(job: Job) {
      renderer.setSize(job.w, job.h, false);
      const aspect = job.w / job.h;
      const t = job.tail ? tailWorld(world, FORK[job.tail.box], job.tail.cx, job.tail.fe) : tailWorld(world, FORK.wide, 0);
      world.ribbon.build(t.main, t.branch);
      world.ribbon.draw(1);
      world.lightAi(job.levels ?? [0, 0, 0]);
      applyView(cam, world, viewFor(world, job, aspect), aspect);
      renderer.render(world.scene, cam);
      const where: Record<string, { x: number; y: number }> = {};
      for (const [k, p] of Object.entries(world.anchors)) {
        if (Array.isArray(p)) p.forEach((q, i) => (where[`${k}${i}`] = project(cam, q)));
        else where[k] = project(cam, p);
      }
      where.exit = project(cam, new Vector3(world.exit.x, LIFT, CITY_EDGE));
      return { url: renderer.domElement.toDataURL('image/png'), where };
    },
  };
}
