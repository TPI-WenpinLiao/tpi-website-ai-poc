// CSS layering rules in scripts/design/css-structure.mjs.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MIN_SHARED, parseRules, structureProblems, withoutGlobal } from './css-structure.mjs';

const astro = (css, attrs = '') => `---\n---\n<div class="x"></div>\n<style${attrs}>\n${css}\n</style>\n`;
const SHEETS = ['src/styles/base.css', 'src/styles/media.css', 'src/styles/tokens.css'];
const check = (files, sheets = SHEETS) => structureProblems(files.map(([file, source]) => ({ file, source })), sheets);

test('rules are read with their selector, own declarations, line and preceding comment', () => {
  const rules = parseRules('/* a */\n.a { color: red; }\n@media (x) {\n  /* b */\n  .b { margin: 0; padding: 0 }\n}\n');
  assert.deepEqual(
    rules.map((r) => [r.selector, r.declarations, r.line, r.comment]),
    [
      ['.a', ['color: red'], 2, '/* a */'],
      ['.b', ['margin: 0', 'padding: 0'], 5, '/* b */'],
    ],
  );
});

test(':global(...) is taken out with nested parentheses', () => {
  assert.equal(withoutGlobal(':global(html:has(.a .b)) .c'), ' .c');
});

test('the allowed stylesheets and scoped styles pass', () => {
  assert.deepEqual(check([['src/components/ui/A.astro', astro('.a :global(li) { margin: 0; }')]]), []);
});

test('another stylesheet under src and a <style is:global> block fail', () => {
  assert.deepEqual(check([['src/components/ui/A.astro', astro('body { margin: 0; }', ' is:global')]], [...SHEETS, 'src/styles/extra.css']), [
    'src/styles/extra.css: stylesheets under src are only src/styles/base.css, src/styles/media.css, src/styles/tokens.css',
    'src/components/ui/A.astro:4: <style is:global>; global CSS goes in src/styles/base.css',
  ]);
});

test('an entirely :global selector fails unless a global-ok comment says why', () => {
  const bad = check([['src/components/ui/A.astro', astro(':global(html) { overflow: hidden; }')]]);
  assert.equal(bad.length, 1);
  assert.match(bad[0], /entirely :global/);
  assert.deepEqual(check([['src/components/ui/A.astro', astro('/* global-ok: scroll lock */\n:global(html) { overflow: hidden; }')]]), []);
});

test('an entirely :global selector followed by a pseudo-class still fails', () => {
  for (const sel of [':global(.x):hover', ':global(body):has(dialog[open])', ':global(html)::before']) {
    const problems = check([['src/components/ui/A.astro', astro(`${sel} { color: red; }`)]]);
    assert.equal(problems.length, 1, sel);
  }
  assert.deepEqual(check([['src/components/ui/A.astro', astro('.a:global(.x):hover { color: red; }')]]), []);
});

test("a class of another component inside :global fails", () => {
  const problems = check([
    ['src/components/ui/Card.astro', astro('.card { color: red; }')],
    ['src/components/ui/Grid.astro', astro('.grid :global(.card) { height: 0; }')],
  ]);
  assert.deepEqual(problems, ['src/components/ui/Grid.astro:5: ".grid :global(.card)" styles .card, a class of src/components/ui/Card.astro; use that component\'s props instead']);
});

test(`the same block of ${MIN_SHARED}+ declarations in two files fails unless marked shared-ok`, () => {
  const block = 'a: 1; b: 2; c: 3; d: 4;';
  const dup = check([
    ['src/components/ui/A.astro', astro(`.a { ${block} }`)],
    ['src/components/ui/B.astro', astro(`.b { d: 4; c: 3; b: 2; a: 1; }`)],
  ]);
  assert.equal(dup.length, 1);
  assert.match(dup[0], /same declaration block in src\/components\/ui\/A.astro:5, src\/components\/ui\/B.astro:5/);
  assert.deepEqual(
    check([
      ['src/components/ui/A.astro', astro(`.a { ${block} }`)],
      ['src/components/ui/B.astro', astro(`/* shared-ok: why */\n.b { ${block} }`)],
    ]),
    [],
  );
  // Fewer declarations, or the same file twice, are not reported
  assert.deepEqual(check([['src/components/ui/A.astro', astro('.a { a: 1; b: 2; }\n.b { a: 1; b: 2; }')]]), []);
});
