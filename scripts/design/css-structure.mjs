// CSS layering rules (design-system skill「CSS 分層」), checked here so they don't depend on a
// reviewer remembering them:
// 1. global CSS lives only in src/styles: the stylesheets under src are tokens.css, media.css and
//    base.css, and no .astro file has a <style is:global> block
// 2. a selector in a component's scoped <style> keeps at least one scoped part: a selector made only
//    of :global(...) styles things outside the component (needs a `global-ok:` comment saying why)
// 3. :global(...) never names a class another .astro file defines: that reaches into another
//    module's internals instead of using its props
// 4. the same declaration block (MIN_SHARED declarations or more) is not written in two files:
//    that is a shared component or a base.css utility waiting to be extracted
// Run: node scripts/design/css-structure.mjs

import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '../..');
const DIRS = ['src/components', 'src/layouts', 'src/pages'];
export const STYLESHEETS = ['src/styles/base.css', 'src/styles/media.css', 'src/styles/tokens.css'];
export const MIN_SHARED = 4;

/** Comments blanked out, line breaks kept. @param {string} css */
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));

/**
 * Style rules of a stylesheet, at-rule blocks (@media, @supports) flattened.
 * @param {string} css
 * @returns {{ selector: string, declarations: string[], line: number, comment: string }[]}
 */
export function parseRules(css) {
  const rules = [];
  const plain = stripComments(css);
  let start = 0;
  const stack = [];
  for (let i = 0; i < plain.length; i++) {
    const ch = plain[i];
    if (ch === '{') {
      const prelude = plain.slice(start, i).trim();
      const line = plain.slice(0, start + (plain.slice(start, i).length - plain.slice(start, i).trimStart().length)).split('\n').length;
      // The comment right before the rule, from the original text
      const before = css.slice(0, start + plain.slice(start, i).search(/\S/)).trimEnd();
      const comment = before.endsWith('*/') ? before.slice(before.lastIndexOf('/*')) : '';
      stack.push({ prelude, line, comment, bodyStart: i + 1 });
      start = i + 1;
    } else if (ch === '}') {
      const open = stack.pop();
      if (open && !open.prelude.startsWith('@')) {
        const body = plain.slice(open.bodyStart, i);
        // Only the rule's own declarations, not those of a nested block
        const declarations = body
          .replace(/\{[^{}]*\}/g, '')
          .split(';')
          .map((d) => d.trim().replace(/\s+/g, ' '))
          .filter((d) => d.includes(':'));
        rules.push({ selector: open.prelude, declarations, line: open.line, comment: open.comment });
      }
      start = i + 1;
    } else if (ch === ';' && stack.length === 0) {
      start = i + 1;
    }
  }
  return rules;
}

/** The selector with every :global(...) taken out, balanced parentheses included. @param {string} s */
export function withoutGlobal(s) {
  let out = '';
  for (let i = 0; i < s.length; ) {
    if (s.startsWith(':global(', i)) {
      let depth = 0;
      let j = i + ':global'.length;
      for (; j < s.length; j++) {
        if (s[j] === '(') depth++;
        else if (s[j] === ')' && --depth === 0) break;
      }
      i = j + 1;
    } else out += s[i++];
  }
  return out;
}

/** The selector without pseudo-classes and pseudo-elements, which scope nothing: `:global(body):has(x)` is still all global. @param {string} s */
export function withoutPseudo(s) {
  let out = s;
  for (let prev = ''; prev !== out; ) {
    prev = out;
    out = out.replace(/::?[\w-]+(\([^()]*\))?/g, '');
  }
  return out;
}

/** Contents of each :global(...) in a selector. @param {string} s */
function globalParts(s) {
  const parts = [];
  for (let i = s.indexOf(':global('); i >= 0; i = s.indexOf(':global(', i + 1)) {
    let depth = 0;
    let j = i + ':global'.length;
    for (; j < s.length; j++) {
      if (s[j] === '(') depth++;
      else if (s[j] === ')' && --depth === 0) break;
    }
    parts.push(s.slice(i + ':global('.length, j));
  }
  return parts;
}

const classesIn = (selector) => new Set([...selector.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]));

/**
 * The <style> blocks of an .astro source as stylesheets, with their line offset.
 * @param {string} source
 */
export function styleBlocks(source) {
  return [...source.matchAll(/<style([^>]*)>([\s\S]*?)<\/style>/g)].map((m) => ({
    global: /\bis:global\b/.test(m[1]),
    css: m[2],
    offset: source.slice(0, m.index + m[0].indexOf('>') + 1).split('\n').length - 1,
  }));
}

/**
 * Problems across the given files.
 * @param {{ file: string, source: string }[]} files .astro files and stylesheets, repo-relative paths
 * @param {string[]} stylesheets every .css path under src
 * @returns {string[]}
 */
export function structureProblems(files, stylesheets) {
  const problems = [];
  for (const sheet of stylesheets) if (!STYLESHEETS.includes(sheet)) problems.push(`${sheet}: stylesheets under src are only ${STYLESHEETS.join(', ')}`);

  // Rules per file; the classes each .astro file defines (outside :global)
  const parsed = files.map(({ file, source }) => {
    const blocks = file.endsWith('.css') ? [{ global: true, css: source, offset: 0 }] : styleBlocks(source);
    const rules = blocks.flatMap((b) => parseRules(b.css).map((r) => ({ ...r, line: r.line + b.offset, scoped: !file.endsWith('.css') })));
    for (const b of blocks) if (b.global && !file.endsWith('.css')) problems.push(`${file}:${b.offset + 1}: <style is:global>; global CSS goes in src/styles/base.css`);
    const own = new Set(rules.filter((r) => r.scoped).flatMap((r) => [...classesIn(withoutGlobal(r.selector))]));
    return { file, rules, own };
  });

  for (const { file, rules } of parsed) {
    for (const r of rules.filter((x) => x.scoped)) {
      for (const sel of r.selector.split(',').map((s) => s.trim())) {
        if (!sel.includes(':global(')) continue;
        // 2. fully global selector
        if (!/[\w.#[*]/.test(withoutPseudo(withoutGlobal(sel))) && !r.comment.includes('global-ok:')) {
          problems.push(`${file}:${r.line}: "${sel}" is entirely :global; scope it under the component, or say why with a global-ok: comment`);
        }
        // 3. another module's class inside :global
        for (const cls of globalParts(sel).flatMap((g) => [...classesIn(g)])) {
          const owner = parsed.find((p) => p.file !== file && p.own.has(cls) && !parsed.find((q) => q.file === file)?.own.has(cls));
          if (owner) problems.push(`${file}:${r.line}: "${sel}" styles .${cls}, a class of ${owner.file}; use that component's props instead`);
        }
      }
    }
  }

  // 4. the same declaration block in more than one file
  const seen = new Map();
  for (const { file, rules } of parsed) {
    for (const r of rules) {
      if (r.declarations.length < MIN_SHARED || r.comment.includes('shared-ok:')) continue;
      const key = [...r.declarations].sort().join(';');
      const list = seen.get(key) ?? [];
      list.push(`${file}:${r.line}`);
      seen.set(key, list);
    }
  }
  for (const where of seen.values()) {
    const filesWith = new Set(where.map((w) => w.split(':')[0]));
    if (filesWith.size > 1) problems.push(`same declaration block in ${where.join(', ')}; extract a component or a base.css utility`);
  }
  return problems;
}

function main() {
  const walk = (dir) => readdirSync(join(ROOT, dir), { recursive: true }).map((f) => `${dir}/${String(f).split('\\').join('/')}`);
  const astro = DIRS.flatMap(walk).filter((f) => f.endsWith('.astro'));
  const sheets = walk('src').filter((f) => f.endsWith('.css'));
  const files = [...astro, 'src/styles/base.css'].map((file) => ({ file, source: readFileSync(join(ROOT, file), 'utf8') }));
  const problems = structureProblems(files, sheets);
  for (const p of problems) console.log(p);
  console.log(`${files.length} files checked, ${problems.length} CSS structure problems`);
  if (problems.length) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
