// Tests for scripts/design/import-brand.mjs. Run: npm run test:scripts
// Fixtures follow pdftocairo's SVG output (one element per line, rectangles as "M … Z M x y").

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cropToArtwork, rectangle, setViewBox, stripBackground, stripEmptyGlyphs, viewBox } from './import-brand.mjs';

const svg = (body) =>
  `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="50" viewBox="0 0 100 50">
${body}</svg>
`;
const MARK = '<path fill-rule="nonzero" fill="rgb(100%, 100%, 100%)" fill-opacity="1" d="M 20 10 L 60 10 L 60 30 L 20 30 Z M 20 10 "/>\n';

test('viewBox reads the four numbers', () => {
  assert.deepEqual(viewBox(svg('')), [0, 0, 100, 50]);
  assert.throws(() => viewBox('<svg width="1"></svg>'), /no viewBox/);
});

test('rectangle recognizes axis-aligned rectangles only', () => {
  assert.deepEqual(rectangle('M 0 50 L 100 50 L 100 0 L 0 0 Z M 0 50 '), { x: 0, y: 0, width: 100, height: 50 });
  assert.deepEqual(rectangle('M 0.5 1 L 9.5 1 L 9.5 3 L 0.5 3 Z'), { x: 0.5, y: 1, width: 9, height: 2 });
  assert.equal(rectangle('M 0 0 L 10 0 L 5 8 L 0 0 Z'), null);
  assert.equal(rectangle('M 0 0 C 1 1 2 2 3 3 Z'), null);
});

test('stripBackground removes the artboard rectangle and its clip, keeps the artwork', () => {
  const input = svg(`<defs>
<clipPath id="clip-0">
<path clip-rule="nonzero" d="M 0 0 L 100 0 L 100 50 L 0 50 Z M 0 0 "/>
</clipPath>
</defs>
<g clip-path="url(#clip-0)">
<path fill-rule="nonzero" fill="rgb(13.7%, 9.4%, 8.2%)" fill-opacity="1" d="M 0 50 L 100 50 L 100 0 L 0 0 Z M 0 50 "/>
</g>
${MARK}`);
  const { svg: out, removed } = stripBackground(input);
  assert.equal(removed, 1);
  assert.equal(out, svg(MARK));
});

test('stripBackground keeps rectangles smaller than the artboard', () => {
  const { svg: out, removed } = stripBackground(svg(MARK));
  assert.equal(removed, 0);
  assert.equal(out, svg(MARK));
});

test('stripEmptyGlyphs removes empty glyphs and their uses', () => {
  const input = svg(`<defs>
<g>
<g id="glyph-0-0">
</g>
</g>
</defs>
<g fill="rgb(0%, 0%, 0%)" fill-opacity="1">
<use xlink:href="#glyph-0-0" x="1" y="2"/>
</g>
${MARK}`);
  assert.equal(stripEmptyGlyphs(input), svg(MARK));
});

test('setViewBox rewrites the root size and viewBox', () => {
  const out = setViewBox(svg(MARK), [20, 10.00001, 40, 20]);
  assert.match(out, /<svg [^>]*width="40" height="20" viewBox="20 10 40 20">/);
});

test('cropToArtwork crops to the drawn shape', async () => {
  assert.match(await cropToArtwork(svg(MARK)), /viewBox="20 10 40 20"/);
});
