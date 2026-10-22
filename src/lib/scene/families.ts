// Product families in the order modular-stack.ts builds its modules: the home page shows one
// chapter per family in this order, and Scene3D's `family` is an index into it (product pages).
// No three.js here, so pages can import it at build time.
export const SCENE_FAMILIES = ['family-ai', 'family-dx', 'family-security', 'family-esg'] as const;

/** Scene3D `family` index of a nodes.csv family id; throws for anything else */
export function sceneFamily(id: string): 0 | 1 | 2 | 3 {
  const i = SCENE_FAMILIES.indexOf(id as (typeof SCENE_FAMILIES)[number]);
  if (i < 0) throw new Error(`${id} is not a product family of the 3D scene`);
  return i as 0 | 1 | 2 | 3;
}
