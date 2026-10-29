// Tests for scripts/lhci-pass.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { decide, passKey, readPassed, recordPass } from './lhci-pass.mjs';

/** A repo with .lhci-dist/ and one input file. @param {(root: string) => void} fn */
function withRepo(fn) {
  const root = mkdtempSync(join(tmpdir(), 'lhci-pass-'));
  try {
    mkdirSync(join(root, '.lhci-dist/en'), { recursive: true });
    writeFileSync(join(root, '.lhci-dist/index.html'), '<h1>Home</h1>');
    writeFileSync(join(root, '.lhci-dist/en/index.html'), '<h1>Home</h1>');
    writeFileSync(join(root, 'lighthouserc.cjs'), 'module.exports = {};');
    fn(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

const key = (root, env = {}) => passKey({ root, inputs: ['lighthouserc.cjs'], env });

test('passKey is the same for the same files, wherever they are', () => {
  withRepo((root) => {
    const copy = `${root}-copy`;
    cpSync(root, copy, { recursive: true });
    try {
      assert.match(key(root), /^[0-9a-f]{64}$/);
      assert.equal(key(root), key(root));
      assert.equal(key(copy), key(root));
    } finally {
      rmSync(copy, { recursive: true, force: true });
    }
  });
});

test('passKey changes when one byte of a page changes', () => {
  withRepo((root) => {
    const before = key(root);
    writeFileSync(join(root, '.lhci-dist/en/index.html'), '<h1>Homf</h1>');
    assert.notEqual(key(root), before);
  });
});

test('passKey changes when a page is added, removed or moved', () => {
  withRepo((root) => {
    const before = key(root);
    writeFileSync(join(root, '.lhci-dist/404.html'), '');
    const added = key(root);
    assert.notEqual(added, before);
    rmSync(join(root, '.lhci-dist/404.html'));
    assert.equal(key(root), before);
    // Same contents under another path
    rmSync(join(root, '.lhci-dist/en'), { recursive: true });
    mkdirSync(join(root, '.lhci-dist/vi'));
    writeFileSync(join(root, '.lhci-dist/vi/index.html'), '<h1>Home</h1>');
    assert.notEqual(key(root), before);
  });
});

test('passKey changes when an input changes, and fails when one is missing', () => {
  withRepo((root) => {
    const before = key(root);
    writeFileSync(join(root, 'lighthouserc.cjs'), 'module.exports = { ci: {} };');
    assert.notEqual(key(root), before);
    assert.throws(() => passKey({ root, inputs: ['missing.cjs'] }), /ENOENT/);
  });
});

test('passKey changes with LHCI_* variables and ignores other variables', () => {
  withRepo((root) => {
    const flags = { LHCI_SETTINGS__CHROME_FLAGS: '--no-sandbox --headless=new' };
    assert.notEqual(key(root, flags), key(root));
    assert.notEqual(key(root, flags), key(root, { LHCI_SETTINGS__CHROME_FLAGS: '--headless=new' }));
    assert.equal(key(root, { ...flags, HOME: '/a' }), key(root, { HOME: '/b', ...flags }));
  });
});

test('passKey fails when .lhci-dist/ does not exist', () => {
  withRepo((root) => {
    rmSync(join(root, '.lhci-dist'), { recursive: true });
    assert.throws(() => key(root), /ENOENT/);
  });
});

test('recordPass writes the key that readPassed reads back', () => {
  withRepo((root) => {
    const file = join(root, '.lighthouseci/passed-dist.sha256');
    assert.equal(readPassed(file), undefined);
    recordPass('abc', file);
    assert.equal(readPassed(file), 'abc');
  });
});

test('decide skips only when the key already passed', () => {
  assert.equal(decide({}, 'abc', 'abc'), 'skip');
  assert.equal(decide({}, 'abc', 'abd'), 'run');
  assert.equal(decide({}, 'abc', undefined), 'run');
  assert.equal(decide({ LIGHTHOUSE_FORCE: '1' }, 'abc', 'abc'), 'run');
  assert.equal(decide({ LHCI_ALL: '1' }, undefined, 'abc'), 'run-only');
});
