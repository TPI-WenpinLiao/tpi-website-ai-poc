// Groups every design token in src/styles/tokens.css for the /design-system showcase. The page
// renders each group with the specimen named by `kind`; showcase.mjs fails when a token falls into
// no group (so "every token is shown" stays true) or a pattern matches nothing (so this list can't
// rot). A pattern ending in "-" is a prefix; any other pattern matches that name and names that
// extend it with "-" (--color-text matches --color-text-muted). The first matching group wins.
// --wf-* tokens are wireframe-only (M3-01) and not shown.

/**
 * @typedef {'color' | 'gradient' | 'shadow' | 'font-family' | 'font-weight' | 'font-size' | 'line-height'
 *   | 'letter-spacing' | 'length' | 'radius' | 'duration' | 'ease' | 'angle' | 'value'} Kind
 * @typedef {{ id: string, title: string, layer: 'primitive' | 'semantic' | 'scale', kind: Kind,
 *   patterns: string[], kinds?: Record<string, Kind>, note?: string }} Group
 */

/** @type {Group[]} */
export const GROUPS = [
  { id: 'ink', title: 'Ink（中性色）', layer: 'primitive', kind: 'color', patterns: ['--ink-'] },
  { id: 'purple', title: 'Purple（品牌紫）', layer: 'primitive', kind: 'color', patterns: ['--purple-'] },
  { id: 'magenta', title: 'Magenta（品紅）', layer: 'primitive', kind: 'color', patterns: ['--magenta-'] },
  { id: 'orange', title: 'Orange（訊號橘）', layer: 'primitive', kind: 'color', patterns: ['--orange-'] },
  { id: 'status', title: 'Red／Green（狀態）', layer: 'primitive', kind: 'color', patterns: ['--red-', '--green-'] },

  { id: 'text', title: '文字', layer: 'semantic', kind: 'color', patterns: ['--color-text'] },
  { id: 'bg', title: '底色', layer: 'semantic', kind: 'color', patterns: ['--color-bg'] },
  { id: 'line', title: '線條', layer: 'semantic', kind: 'color', patterns: ['--color-border', '--color-grid-line'] },
  {
    id: 'interactive',
    title: '互動',
    layer: 'semantic',
    kind: 'color',
    patterns: ['--color-action', '--color-link', '--color-disabled-', '--color-focus'],
  },
  {
    id: 'decoration',
    title: '裝飾',
    layer: 'semantic',
    kind: 'color',
    patterns: ['--color-accent', '--color-brand'],
    note: '只用在線條、外框、光點，不當文字色，也不是控制項唯一的辨識方式。',
  },
  { id: 'feedback', title: '狀態', layer: 'semantic', kind: 'color', patterns: ['--color-error', '--color-success'] },
  {
    id: 'glass',
    title: 'Glass',
    layer: 'semantic',
    kind: 'color',
    patterns: ['--glass-bg', '--glass-border', '--scene-worst', '--glass-blur'],
    kinds: { '--glass-blur': 'length' },
    note: '--scene-worst 是該 surface 對 glass 最不利的背景，只給對比檢查用。',
  },
  { id: 'light', title: '光', layer: 'semantic', kind: 'shadow', patterns: ['--gradient-energy', '--glow-'], kinds: { '--gradient-energy': 'gradient' } },
  { id: 'depth', title: '景深', layer: 'semantic', kind: 'shadow', patterns: ['--shadow-'], note: '亮色 surface 用陰影，深色 surface 改成邊緣光。' },

  { id: 'font-family', title: '字型', layer: 'scale', kind: 'font-family', patterns: ['--font-sans', '--font-mono'] },
  { id: 'font-size', title: '字級', layer: 'scale', kind: 'font-size', patterns: ['--font-size-'] },
  { id: 'font-weight', title: '字重', layer: 'scale', kind: 'font-weight', patterns: ['--font-weight-'] },
  { id: 'line-height', title: '行高', layer: 'scale', kind: 'line-height', patterns: ['--line-height-'] },
  { id: 'letter-spacing', title: '字距', layer: 'scale', kind: 'letter-spacing', patterns: ['--letter-spacing-'] },
  { id: 'space', title: '間距', layer: 'scale', kind: 'length', patterns: ['--space-'] },
  { id: 'radius', title: '圓角', layer: 'scale', kind: 'radius', patterns: ['--radius-'] },
  {
    id: 'stroke',
    title: '線寬與 focus',
    layer: 'scale',
    kind: 'length',
    patterns: ['--border-width', '--focus-ring-', '--underline-offset'],
  },
  {
    id: 'motion',
    title: '動態',
    layer: 'scale',
    kind: 'duration',
    patterns: ['--duration-', '--ease-', '--reveal-distance'],
    kinds: { '--ease-standard': 'ease', '--ease-out-expo': 'ease', '--reveal-distance': 'length' },
    note: '偏好減少動態時 --duration-* 歸零。滑鼠移到範例上播放。',
  },
  {
    id: 'scene',
    title: '3D 場景',
    layer: 'scale',
    kind: 'angle',
    patterns: ['--scene-angle-', '--tilt', '--quarter-turn', '--perspective', '--lift', '--scene-size', '--layer-gap', '--node-size', '--grid-size', '--marker-size'],
    kinds: {
      '--perspective': 'value',
      '--lift': 'value',
      '--scene-size': 'length',
      '--layer-gap': 'length',
      '--node-size': 'length',
      '--grid-size': 'length',
      '--marker-size': 'length',
    },
    note: '--scene-angle-* 與 --perspective 是 three.js 相機（M3-07）要對齊的共用視角。偏好減少動態時 --tilt、--lift 歸零。',
  },
  {
    id: 'layout',
    title: '版面',
    layer: 'scale',
    kind: 'length',
    patterns: ['--content-max-width', '--reading-max-width', '--touch-target', '--progress-height', '--hero-', '--backdrop-soft-opacity', '--z-'],
    kinds: {
      '--content-max-width': 'value',
      '--reading-max-width': 'value',
      '--hero-min-height': 'value',
      '--hero-image-share': 'value',
      '--hero-copy-share': 'value',
      '--hero-narrow-offset': 'value',
      '--backdrop-soft-opacity': 'value',
      '--z-raised': 'value',
      '--z-overlay': 'value',
    },
  },
];

/** @param {string} pattern @param {string} name */
const matches = (pattern, name) => (pattern.endsWith('-') ? name.startsWith(pattern) : name === pattern || name.startsWith(`${pattern}-`));

/**
 * Sorts token names into groups, in declaration order within each group.
 * @param {string[]} names token names from tokens.css
 * @param {Group[]} [groups]
 * @returns {{ groups: (Group & { tokens: { name: string, kind: Kind }[] })[], ungrouped: string[], unused: string[] }}
 *   `ungrouped`: shown tokens no group matches; `unused`: patterns that match no token
 */
export function groupTokens(names, groups = GROUPS) {
  const shown = names.filter((n) => !n.startsWith('--wf-'));
  const result = groups.map((g) => ({ ...g, tokens: /** @type {{ name: string, kind: Kind }[]} */ ([]) }));
  const used = new Set();
  const ungrouped = [];
  for (const name of shown) {
    const i = groups.findIndex((g) => g.patterns.some((p) => matches(p, name)));
    if (i === -1) {
      ungrouped.push(name);
      continue;
    }
    const g = groups[i];
    for (const p of g.patterns) if (matches(p, name)) used.add(`${g.id}:${p}`);
    result[i].tokens.push({ name, kind: g.kinds?.[name] ?? g.kind });
  }
  const unused = groups.flatMap((g) => g.patterns.filter((p) => !used.has(`${g.id}:${p}`)).map((p) => `${g.id}: ${p}`));
  return { groups: result, ungrouped, unused };
}
