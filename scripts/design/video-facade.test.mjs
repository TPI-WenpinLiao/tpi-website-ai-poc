// Tests for scripts/design/video-facade.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { offSite, problems } from './video-facade.mjs';

const ORIGIN = 'http://localhost:4321';

test('off-site requests are those to another origin, not data: or blob: URLs', () => {
  assert.deepEqual(
    offSite(
      [
        `${ORIGIN}/design-system`,
        `${ORIGIN}/_astro/cover.webp`,
        'data:image/svg+xml,<svg/>',
        'blob:http://localhost:4321/1',
        'https://www.youtube-nocookie.com/embed/abc',
        'http://localhost:9999/other-port',
      ],
      ORIGIN,
    ),
    ['https://www.youtube-nocookie.com/embed/abc', 'http://localhost:9999/other-port'],
  );
});

test('a facade that loads nothing and hands focus to a titled player passes', () => {
  assert.deepEqual(problems({ loadRequests: [], reached: true, player: { tag: 'iframe', title: 'Demo', focused: true } }), []);
});

test('reports load requests, an unreachable button, a missing player, title or focus', () => {
  assert.deepEqual(problems({ loadRequests: ['https://www.youtube.com/iframe_api'], reached: false, player: null }), [
    'requested on load: https://www.youtube.com/iframe_api',
    'no facade button within 400 Tab presses',
  ]);
  assert.deepEqual(problems({ loadRequests: [], reached: true, player: null }), ['Enter on the button did not add an iframe or video']);
  assert.deepEqual(problems({ loadRequests: [], reached: true, player: { tag: 'video', title: ' ', focused: false } }), [
    'the video has no title',
    'the video does not have focus',
  ]);
});
