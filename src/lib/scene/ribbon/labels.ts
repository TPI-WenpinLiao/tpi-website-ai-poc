// Where the HTML labels go on a static picture of the ribbon world (HomeTemplate's map, MapPicture on
// offering and hub heroes, #187). The positions come from pictures.json, written by
// scripts/design/ribbon-capture.mjs with the pictures, so labels never hold copied coordinates.
import pictures from './pictures.json';

export type Where = Record<string, { x: number; y: number }>;
export type PictureName = keyof typeof pictures;
export interface PlacedLabel {
  name: string;
  label: string;
  // A block near the picture's edge hangs its label from that edge, so it stays on the picture
  edge: 'start' | 'end' | undefined;
  style: string;
}

export const where = (picture: PictureName): Where => pictures[picture].where;

/** The labels whose block lands inside the picture, in the order of `names`. */
export const labelsOn = (at: Where, names: readonly string[], text: (name: string) => string | undefined): PlacedLabel[] =>
  names.flatMap((name) => {
    const p = at[name];
    const label = text(name);
    if (!p || !label || p.x < 0 || p.x > 1 || p.y < 0 || p.y > 1) return [];
    const edge = p.x < 0.12 ? 'start' : p.x > 0.88 ? 'end' : undefined;
    return [{ name, label, edge, style: `--x: ${(p.x * 100).toFixed(1)}%; --y: ${(p.y * 100).toFixed(1)}%` }];
  });
