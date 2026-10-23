// Tests for scripts/content/migrate/images.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { baseName, dataUrlBytes, fileNames, imageExt, MAX_WIDTH, optimizeImage } from './images.mjs';

test('imageExt reads the format from the bytes', () => {
  assert.equal(imageExt(Buffer.from([0xff, 0xd8, 0xff, 0xe0])), 'jpg');
  assert.equal(imageExt(Buffer.from('89504e470d0a1a0a', 'hex')), 'png');
  assert.equal(imageExt(Buffer.from('RIFF\0\0\0\0WEBPVP8 ', 'latin1')), 'webp');
  assert.equal(imageExt(Buffer.from('<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg"></svg>')), 'svg');
  assert.equal(imageExt(Buffer.from('<html>')), null);
});

test('baseName is lowercase kebab-case ASCII', () => {
  assert.equal(baseName('https://tpi.dev/IMG/1F1AAAD1-2937_612a.PNG'), '1f1aaad1-2937-612a');
  assert.equal(baseName('https://www.tpisoftware.com/file/upload/%E5%9C%96%E7%89%87.jpg'), 'image');
  assert.equal(baseName('data:image/png;base64,AAAA'), 'image');
});

test('fileNames: cover first, repeated names numbered, repeated URLs share a file', () => {
  const names = fileNames([
    { url: 'https://a/x/hero.png', ext: 'png' },
    { url: 'https://a/y/photo.jpg', ext: 'jpg' },
    { url: 'https://a/z/photo.jpg', ext: 'jpg' },
    { url: 'https://a/y/photo.jpg', ext: 'jpg' },
    { url: 'https://a/%E5%9C%96.jpg', ext: 'jpg' },
  ]);
  assert.deepEqual([...names.values()], ['cover.png', 'photo.jpg', 'photo-2.jpg', 'image.jpg']);
});

test('dataUrlBytes decodes base64 and plain data URLs', () => {
  assert.equal(dataUrlBytes('data:image/png;base64,aGk=').toString(), 'hi');
  assert.equal(dataUrlBytes('data:image/svg+xml,%3Csvg%3E').toString(), '<svg>');
});

test('optimizeImage downscales to MAX_WIDTH as WebP, is repeatable, and leaves SVG alone', async () => {
  const big = await sharp({ create: { width: 2400, height: 1200, channels: 3, background: '#336699' } }).png().toBuffer();
  const out = await optimizeImage(big, 'png');
  assert.equal(out.ext, 'webp');
  assert.deepEqual(await sharp(out.bytes).metadata().then((m) => [m.format, m.width, m.height]), ['webp', MAX_WIDTH, MAX_WIDTH / 2]);
  assert.ok((await optimizeImage(big, 'png')).bytes.equals(out.bytes));
  const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>');
  assert.deepEqual(await optimizeImage(svg, 'svg'), { bytes: svg, ext: 'svg' });
});
