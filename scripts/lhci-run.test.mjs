// Tests for scripts/lhci-run.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { lhciEnv, parse, run } from './lhci-run.mjs';

const OUTPUT = [
  'Started a web server on port 4000...\n',
  'Running Lighthouse 2 time(s) on http://localhost:4000/a.html\n',
  'Run #1...',
  'done.\n',
  'Run #2...',
  'failed!\n',
  'Running Lighthouse 2 time(s) on http://localhost:4000/b.html\n',
  'Run #1...',
];

test('parse reports a run start at "Run #k..." and its end at "done." or "failed!"', () => {
  const state = { text: '', pos: 0 };
  assert.deepEqual(parse(state, OUTPUT.join('')), [
    { type: 'start', url: 'http://localhost:4000/a.html', run: 1, runs: 2 },
    { type: 'end', ok: true },
    { type: 'start', url: 'http://localhost:4000/a.html', run: 2, runs: 2 },
    { type: 'end', ok: false },
    { type: 'start', url: 'http://localhost:4000/b.html', run: 1, runs: 2 },
  ]);
});

test('parse gives the same events however the output is split into chunks', () => {
  const whole = parse({ text: '', pos: 0 }, OUTPUT.join(''));
  const state = { text: '', pos: 0 };
  const events = [...OUTPUT.join('')].flatMap((c) => parse(state, c));
  assert.deepEqual(events, whole);
});

test('lhciEnv renames LHCI_COLLECT__SETTINGS__* so it no longer replaces the rc settings', () => {
  assert.deepEqual(lhciEnv({ LHCI_COLLECT__SETTINGS__CHROME_FLAGS: '--no-sandbox', PATH: '/bin' }), {
    LHCI_SETTINGS__CHROME_FLAGS: '--no-sandbox',
    PATH: '/bin',
  });
  // The new name wins when both are set
  assert.deepEqual(lhciEnv({ LHCI_COLLECT__SETTINGS__CHROME_FLAGS: 'old', LHCI_SETTINGS__CHROME_FLAGS: 'new' }), {
    LHCI_SETTINGS__CHROME_FLAGS: 'new',
  });
});

/** A fake LHCI: prints `lines` with a pause between them, then stays alive if `hang` */
const fake = (lines, hang) => [
  '-e',
  `const { spawn } = require('node:child_process');
   // A grandchild like Chrome, which must not outlive a timeout
   const grandchild = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], { detached: true, stdio: 'ignore' });
   console.error('grandchild ' + grandchild.pid);
   const lines = ${JSON.stringify(lines)};
   let i = 0;
   const next = () => {
     if (i < lines.length) { process.stdout.write(lines[i++]); setTimeout(next, 20); }
     else if (${hang}) setInterval(() => {}, 1000);
     else { grandchild.kill(); }
   };
   next();`,
];

function withProgress(fn) {
  const dir = mkdtempSync(join(tmpdir(), 'lhci-run-'));
  const progress = join(dir, 'progress.json');
  return fn(progress).finally(() => rmSync(dir, { recursive: true, force: true }));
}

test('a command that finishes keeps its exit code and leaves status done', () =>
  withProgress(async (progress) => {
    const code = await run({ command: process.execPath, args: fake(OUTPUT.slice(0, 4), false), timeoutMs: 5000, progress });
    assert.equal(code, 0);
    assert.equal(JSON.parse(readFileSync(progress, 'utf8')).status, 'done');
  }));

test('a run longer than the limit exits 1, names the URL and kills the process tree', () =>
  withProgress(async (progress) => {
    // github: false, or the CI log gets an ::error:: annotation from this test
    const code = await run({ command: process.execPath, args: fake(OUTPUT, true), timeoutMs: 500, progress, github: false });
    assert.equal(code, 1);
    const saved = JSON.parse(readFileSync(progress, 'utf8'));
    assert.equal(saved.status, 'timeout');
    assert.equal(saved.url, 'http://localhost:4000/b.html');
    assert.equal(saved.run, 1);
    assert.ok(Array.isArray(saved.diagnostics) && saved.diagnostics.length > 0);
    // The detached grandchild is gone too
    const pid = Number(/^\s*(\d+)/.exec(saved.diagnostics.find((l) => /setInterval/.test(l)) ?? '')?.[1]);
    assert.ok(pid > 0, `grandchild listed in ${saved.diagnostics.join('\n')}`);
    const alive = () => /^\s*[^Z\s]/.test(String(spawnSync('ps', ['-o', 'stat=', '-p', String(pid)]).stdout));
    for (let i = 0; i < 20 && alive(); i += 1) await new Promise((r) => setTimeout(r, 100));
    assert.equal(alive(), false);
  }));
