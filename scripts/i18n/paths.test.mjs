// Path helpers in src/lib/i18n/paths.ts against the URL table in ADR 0002. Node strips the types.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { localeFromPath, localizePath, normalizePath, stripLocale } from '../../src/lib/i18n/paths.ts';

test('normalizePath drops .html, a trailing /index and the trailing slash', () => {
  assert.equal(normalizePath('/index.html'), '/');
  assert.equal(normalizePath('/about.html'), '/about');
  assert.equal(normalizePath('/en.html'), '/en');
  assert.equal(normalizePath('/en/index.html'), '/en');
  assert.equal(normalizePath('/products/index'), '/products');
  assert.equal(normalizePath('/about/'), '/about');
  assert.equal(normalizePath('/'), '/');
  assert.equal(normalizePath(''), '/');
});

test('localeFromPath reads the prefix; anything else is zh-TW', () => {
  assert.equal(localeFromPath('/'), 'zh-TW');
  assert.equal(localeFromPath('/products/digirunner'), 'zh-TW');
  assert.equal(localeFromPath('/en'), 'en');
  assert.equal(localeFromPath('/en.html'), 'en');
  assert.equal(localeFromPath('/vi/products/digirunner'), 'vi');
  // A prefix only counts as a whole segment, and zh-TW never has one
  assert.equal(localeFromPath('/english'), 'zh-TW');
  assert.equal(localeFromPath('/zh-TW/about'), 'zh-TW');
});

test('stripLocale returns the path shared by every locale version', () => {
  assert.equal(stripLocale('/en/products/digirunner'), '/products/digirunner');
  assert.equal(stripLocale('/vi.html'), '/');
  assert.equal(stripLocale('/products/digirunner'), '/products/digirunner');
});

test('localizePath follows the ADR 0002 locale table', () => {
  for (const [path, zh, en, vi] of [
    ['/', '/', '/en', '/vi'],
    ['/products/digirunner', '/products/digirunner', '/en/products/digirunner', '/vi/products/digirunner'],
    ['/blog/page/2', '/blog/page/2', '/en/blog/page/2', '/vi/blog/page/2'],
  ]) {
    assert.equal(localizePath(path, 'zh-TW'), zh);
    assert.equal(localizePath(path, 'en'), en);
    assert.equal(localizePath(path, 'vi'), vi);
  }
  // Input may already carry another locale's prefix
  assert.equal(localizePath('/en/about', 'vi'), '/vi/about');
  assert.equal(localizePath('/vi/about', 'zh-TW'), '/about');
});
