// Entry helpers in src/lib/content/entries.ts used by the dynamic routes.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { duplicates, entryLocale, entrySlug, isPublished, pagePath, paginate, translationPaths } from '../../src/lib/content/entries.ts';

const entry = (id, translationKey, draft = false) => ({ id, data: { translationKey, draft } });

test('entry ids split into locale and slug', () => {
  assert.equal(entryLocale('en/digirunner'), 'en');
  assert.equal(entrySlug('zh-TW/digirunner'), 'digirunner');
  assert.throws(() => entryLocale('ja/x'), /does not start with a locale/);
});

test('drafts are not published', () => {
  assert.equal(isPublished(entry('zh-TW/a', 'a', true)), false);
  assert.equal(isPublished(entry('zh-TW/a', 'a')), true);
});

test('translations are the other published entries with the same translationKey', () => {
  const all = [entry('zh-TW/a', 'k'), entry('en/a', 'k'), entry('vi/a', 'k', true), entry('en/b', 'other')];
  assert.deepEqual(
    translationPaths(all[0], all, (e) => `/${e.id}`),
    ['/en/a'],
  );
});

test('listing pages: 12 per page, an empty listing still has page 1', () => {
  assert.deepEqual(paginate([]), [[]]);
  assert.deepEqual(paginate([1, 2, 3], 2), [[1, 2], [3]]);
  assert.equal(paginate(Array.from({ length: 13 })).length, 2);
});

test('page 1 is the listing path, later pages are under /page/n', () => {
  assert.equal(pagePath('/blog', 1), '/blog');
  assert.equal(pagePath('/blog/ai', 2), '/blog/ai/page/2');
  assert.equal(pagePath('/en/blog', 3), '/en/blog/page/3');
});

test('duplicates lists each repeated value once', () => {
  assert.deepEqual(duplicates(['blog/ai', 'blog/x', 'blog/ai', 'blog/ai']), ['blog/ai']);
  assert.deepEqual(duplicates(['a', 'b']), []);
});
