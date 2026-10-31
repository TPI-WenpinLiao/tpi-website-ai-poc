// Tests for scripts/content/placeholder-covers.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { fallbackCover, findPlaceholders, fixPlaceholder, isPlaceholderSource, PLACEHOLDERS } from './placeholder-covers.mjs';

test('fallbackCover is one of the design covers and the same for the same slug', () => {
  assert.equal(fallbackCover('what-is-an-api-explained'), fallbackCover('what-is-an-api-explained'));
  assert.match(fallbackCover('csr-la-gi'), /^cover-(data|integration|platform|security)\.webp$/);
  for (const p of PLACEHOLDERS) assert.match(`${p.pixels} ${p.stored}`, /^[0-9a-f]{64} [0-9a-f]{64}$/);
});

test('isPlaceholderSource compares decoded pixels, not file bytes', async () => {
  const image = sharp({ create: { width: 2, height: 2, channels: 3, background: '#336699' } });
  const png = await image.clone().png().toBuffer();
  const pngWithMeta = await image.clone().png().withMetadata({ density: 300 }).toBuffer();
  assert.notDeepEqual(png, pngWithMeta);
  const hashes = new Set([createHash('sha256').update(await sharp(png).raw().toBuffer()).digest('hex')]);
  assert.equal(await isPlaceholderSource(pngWithMeta, hashes), true);
  assert.equal(await isPlaceholderSource(png), false);
});

test('findPlaceholders and fixPlaceholder: the cover moves to a design cover, the file goes', async (t) => {
  const cwd = process.cwd();
  process.chdir(await mkdtemp(join(tmpdir(), 'placeholder-')));
  t.after(() => process.chdir(cwd));
  const bytes = Buffer.from('placeholder');
  const stored = new Set([createHash('sha256').update(bytes).digest('hex')]);
  await mkdir('src/assets/blog/vi/a', { recursive: true });
  await mkdir('src/content/blog/vi', { recursive: true });
  await writeFile('src/assets/blog/vi/a/cover.webp', bytes);
  await writeFile('src/assets/blog/vi/a/other.webp', 'x');
  await writeFile('src/content/blog/vi/a.md', '---\n# https://example.com/a.png\ncoverImage: ../../../assets/blog/vi/a/cover.webp\n---\n');

  const found = await findPlaceholders(['src/assets/blog'], stored);
  assert.deepEqual(found, ['src/assets/blog/vi/a/cover.webp']);
  await fixPlaceholder(found[0]);
  assert.equal(
    await readFile('src/content/blog/vi/a.md', 'utf8'),
    `---\n# https://example.com/a.png\ncoverImage: ../../../assets/design/${fallbackCover('a')}\n---\n`,
  );
  assert.equal(existsSync('src/assets/blog/vi/a/cover.webp'), false);
  assert.equal(existsSync('src/assets/blog/vi/a/other.webp'), true);
  assert.deepEqual(await findPlaceholders(['src/assets/blog'], stored), []);

  await mkdir('src/assets/case-study/x', { recursive: true });
  await assert.rejects(fixPlaceholder('src/assets/case-study/x/logo.png'), /only blog and news covers can be fixed/);
});
