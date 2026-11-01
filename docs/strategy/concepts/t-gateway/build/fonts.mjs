// Subsets the headline face for docs/strategy/concepts/t-gateway (README「字型」).
// Reads every headline-face text (h1, h2, .door-name, .rec-key) from index.html, finds the
// fontsource Noto Sans TC 900 slices whose unicode-range holds those characters, cuts each slice
// down to just those characters with pyftsubset, and merges them into one woff2. The Latin face
// (Inter Tight variable, latin) is cut to printable ASCII + ©.
// Usage: node fonts.mjs <direction dir> <noto package dir> <inter package dir> <venv bin dir>
import { readFileSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
const [dir, noto, inter, bin] = process.argv.slice(2);
const html = readFileSync(join(dir, 'index.html'), 'utf8');
const pick = [...html.matchAll(/<(h1|h2)[^>]*>([\s\S]*?)<\/\1>|class="(?:door-name|rec-key)">([^<]*)</g)]
  .map((m) => (m[2] ?? m[3]).replace(/<[^>]+>/g, '')).join('');
const cjk = [...new Set([...pick].filter((c) => c.codePointAt(0) > 0x2000))].sort();
console.log(`headline characters: ${cjk.length}: ${cjk.join('')}`);
const css = readFileSync(join(noto, '900.css'), 'utf8');
const faces = [...css.matchAll(/@font-face\s*{([\s\S]*?)}/g)].map((m) => {
  const file = m[1].match(/url\(\.\/files\/([^)]+\.woff2)\)/)[1];
  const ranges = m[1].match(/unicode-range:\s*([^;]+);/)[1].split(',').map((r) => {
    const [a, b] = r.trim().replace('U+', '').split('-');
    return [parseInt(a, 16), parseInt(b ?? a, 16)];
  });
  return { file, ranges };
});
const need = new Map();
for (const c of cjk) {
  const cp = c.codePointAt(0);
  const face = faces.find((f) => f.ranges.some(([a, b]) => cp >= a && cp <= b));
  if (!face) throw new Error(`no slice holds ${c}`);
  need.set(face.file, (need.get(face.file) ?? '') + c);
}
const tmp = '/tmp/t-gateway/font-work';
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });
const parts = [];
for (const [file, text] of need) {
  const out = join(tmp, file.replace('.woff2', '.ttf'));
  execFileSync(join(bin, 'pyftsubset'), [join(noto, 'files', file), `--text=${text}`, `--output-file=${out}`, '--layout-features=*', '--no-hinting']);
  parts.push(out);
}
console.log(`slices used: ${need.size}`);
const merged = join(tmp, 'merged.ttf');
execFileSync(join(bin, 'pyftmerge'), [`--output-file=${merged}`, ...parts]);
const outDir = join(dir, 'assets', 'fonts');
mkdirSync(outDir, { recursive: true });
const cjkOut = join(outDir, 'noto-sans-tc-900-headlines.woff2');
execFileSync(join(bin, 'pyftsubset'), [merged, `--text=${cjk.join('')}`, '--flavor=woff2', `--output-file=${cjkOut}`, '--layout-features=*', '--no-hinting']);
const latOut = join(outDir, 'inter-tight-latin.woff2');
execFileSync(join(bin, 'pyftsubset'), [join(inter, 'files', 'inter-tight-latin-wght-normal.woff2'), '--unicodes=U+0020-007E,U+00A9', '--flavor=woff2', `--output-file=${latOut}`, '--layout-features=*']);
for (const f of [cjkOut, latOut]) console.log(`${f}\t${statSync(f).size} bytes`);
