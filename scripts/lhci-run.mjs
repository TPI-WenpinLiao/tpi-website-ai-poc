// Runs `lhci` with a time limit per Lighthouse run (#136). LHCI spawns Lighthouse without a
// timeout, and Lighthouse has waits without one (BFCacheFailures' navigations), so a stuck run
// used to hold the CI job until its 30-minute limit with nothing in the log but `context canceled`.
// This passes LHCI's output through, and when one run takes longer than the limit it prints the
// URL, what Chrome was doing, kills LHCI with its Lighthouse and Chrome processes, and exits 1.
// Every run start is written to PROGRESS, so .github/scripts/lighthouse-summary.mjs can name the
// stuck page even when the job is cancelled first. Limit and reasons: ADR 0004.
// Run: node scripts/lhci-run.mjs <lhci args…>   (LHCI_RUN_TIMEOUT_SECONDS overrides the limit)

import { execFileSync, spawn } from 'node:child_process';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { pathToFileURL } from 'node:url';

export const PROGRESS = '.lhci-progress.json';
// A run normally takes 11–13 s. Lighthouse's own limits (30 s for the FCP, 45 s for the load,
// 30 s per protocol command) add up to about 2 minutes. LHCI retries a failed Lighthouse within
// the same `Run #k...` (runUntilSuccess, up to 3 tries): one failed try still fits, two do not.
const DEFAULT_TIMEOUT_SECONDS = 180;
// Each diagnostic request gets this long: a stuck page may not answer
const PROBE_MS = 5000;

// LHCI's collect output (src/collect/collect.js): `Running Lighthouse N time(s) on <url>`, then
// per run `Run #k...` and, on the same line once the run ends, `done.` or `failed!`
const OUTPUT = /Running Lighthouse (\d+) time\(s\) on (\S+)\n|Run #(\d+)\.\.\.|(done\.|failed!)\n/g;

/**
 * Appends a chunk of LHCI output and returns the run starts and ends it completes. A run starts
 * at `Run #k...`, before its line ends.
 * @param {{ text: string, pos: number, url?: string, runs?: number }} state
 * @param {string} chunk
 * @returns {Array<{ type: 'start', url: string, run: number, runs: number } | { type: 'end', ok: boolean }>}
 */
export function parse(state, chunk) {
  state.text += chunk;
  const events = [];
  OUTPUT.lastIndex = state.pos;
  for (let m; (m = OUTPUT.exec(state.text)); state.pos = OUTPUT.lastIndex) {
    if (m[2]) {
      state.runs = Number(m[1]);
      state.url = m[2];
    } else if (m[3] && state.url) {
      events.push({ type: 'start', url: state.url, run: Number(m[3]), runs: state.runs ?? 0 });
    } else if (m[4]) {
      events.push({ type: 'end', ok: m[4] === 'done.' });
    }
  }
  return events;
}

/** The PIDs of every process below `root`, from `ps`. Chrome is spawned detached, in its own group. */
function descendants(root) {
  const children = new Map();
  for (const line of execFileSync('ps', ['-eo', 'pid=,ppid='], { encoding: 'utf8' }).trim().split('\n')) {
    const [pid, ppid] = line.trim().split(/\s+/).map(Number);
    children.set(ppid, [...(children.get(ppid) ?? []), pid]);
  }
  const out = [];
  const walk = (pid) => (children.get(pid) ?? []).forEach((c) => (out.push(c), walk(c)));
  walk(root);
  return out;
}

/** The --user-data-dir of each Chrome browser process among `pids` */
function chromeProfiles(pids) {
  if (!pids.length) return [];
  const ps = execFileSync('ps', ['-o', 'args=', '-p', pids.join(',')], { encoding: 'utf8' });
  return ps
    .split('\n')
    .filter((args) => !args.includes('--type='))
    .flatMap((args) => /--user-data-dir=(\S+)/.exec(args)?.[1] ?? []);
}

// The timer is unref'd so a probe that answered does not keep the process alive for `ms`
const withTimeout = (promise, ms) =>
  Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error(`no answer in ${ms} ms`)), ms).unref())]);

/** Evaluates `expression` in a DevTools target over its WebSocket. */
async function evaluate(wsUrl, expression) {
  const ws = new WebSocket(wsUrl);
  try {
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = () => reject(new Error('WebSocket error'));
    });
    const reply = new Promise((resolve) => {
      ws.onmessage = (e) => resolve(JSON.parse(String(e.data)));
    });
    ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression, returnByValue: true } }));
    const { result, error } = /** @type {any} */ (await reply);
    if (error) throw new Error(error.message);
    return result.result.value;
  } finally {
    ws.close();
  }
}

// What the page under test was doing: its URL and the 3D scene's state (Scene3D, ADR 0003)
const PAGE_STATE = `JSON.stringify({
  url: location.href,
  readyState: document.readyState,
  scene: document.querySelector('[data-scene]')?.dataset.scene ?? null,
  sceneTier: document.querySelector('[data-scene-tier]')?.dataset.sceneTier ?? null,
})`;

/**
 * What the processes under `root` are doing: each Chrome process's type and CPU use, then the
 * browser's DevTools targets and, for each page, whether it still answers.
 * @param {number} root
 */
export async function diagnose(root) {
  const pids = descendants(root);
  if (!pids.length) return ['no child processes'];
  const ps = execFileSync('ps', ['-o', 'pid=,ppid=,pcpu=,etimes=,args=', '-p', pids.join(',')], { encoding: 'utf8' });
  const lines = ['processes (pid ppid %cpu seconds command):'];
  for (const row of ps.trim().split('\n')) {
    const [pid, ppid, cpu, secs, ...args] = row.trim().split(/\s+/);
    const command = args.join(' ');
    const type = /--type=([\w-]+)/.exec(command)?.[1];
    const name = /chrom|headless_shell/.test(basename(args[0] ?? '')) ? `chrome ${type ?? 'browser'}` : command.slice(0, 120);
    lines.push(`  ${pid} ${ppid} ${cpu} ${secs} ${name}`);
  }
  // Lighthouse starts Chrome with --remote-debugging-port=0; Chrome writes the port it picked here
  const profile = chromeProfiles(pids)[0];
  const port = profile && existsSync(join(profile, 'DevToolsActivePort')) ? readFileSync(join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0] : undefined;
  if (!port) return [...lines, 'no Chrome with a DevTools port'];
  try {
    const res = await withTimeout(fetch(`http://127.0.0.1:${port}/json/list`), PROBE_MS);
    const targets = /** @type {any[]} */ (await res.json());
    lines.push(`DevTools targets on port ${port}:`);
    for (const t of targets) {
      let state = '';
      if (t.type === 'page' && t.webSocketDebuggerUrl) {
        state = await withTimeout(evaluate(t.webSocketDebuggerUrl, PAGE_STATE), PROBE_MS).then(
          (v) => ` → ${v}`,
          (e) => ` → does not answer (${e.message})`,
        );
      }
      lines.push(`  ${t.type} ${t.url}${state}`);
    }
  } catch (e) {
    lines.push(`DevTools on port ${port} does not answer (${/** @type {Error} */ (e).message})`);
  }
  return lines;
}

// LHCI applies LHCI_COLLECT__* over the rc file with a shallow merge, so LHCI_COLLECT__SETTINGS__X
// replaces lighthouserc.cjs's whole collect.settings, skipAudits included; LHCI_SETTINGS__X merges.
// Sessions started before #136 still have the old name from scripts/session-start.sh.
const SHADOWING = /^LHCI_COLLECT__SETTINGS__/;

/** `env` with LHCI_COLLECT__SETTINGS__* renamed to LHCI_SETTINGS__*. @param {NodeJS.ProcessEnv} env */
export function lhciEnv(env) {
  const out = { ...env };
  for (const name of Object.keys(env).filter((n) => SHADOWING.test(n))) {
    const renamed = name.replace(SHADOWING, 'LHCI_SETTINGS__');
    console.error(`${name} would replace lighthouserc.cjs's collect.settings; using ${renamed} instead`);
    out[renamed] ??= env[name];
    delete out[name];
  }
  return out;
}

/**
 * Runs `command` (LHCI) and fails once a Lighthouse run takes longer than `timeoutMs`.
 * Resolves to the exit code: the command's own, or 1 after a timeout.
 * @param {{ command: string, args: string[], timeoutMs: number, progress?: string, github?: boolean }} options
 */
export function run({ command, args, timeoutMs, progress = PROGRESS, github = !!process.env.GITHUB_ACTIONS }) {
  /** @type {Record<string, unknown>} */
  let current = { status: 'starting' };
  const save = (fields) => {
    current = { ...current, ...fields };
    writeFileSync(progress, `${JSON.stringify(current, null, 2)}\n`);
  };
  save({});

  const child = spawn(command, args, { stdio: ['inherit', 'pipe', 'inherit'], env: lhciEnv(process.env) });
  const kill = () => {
    const pids = descendants(child.pid ?? 0);
    // chrome-launcher removes the temporary profile when Chrome exits normally; a kill leaves it
    const profiles = chromeProfiles(pids).filter((dir) => dir.startsWith(join(tmpdir(), 'lighthouse.')));
    // LHCI first: autorun goes on to assert once its collect child dies
    for (const pid of [child.pid, ...pids]) {
      try {
        if (pid) process.kill(pid, 'SIGKILL');
      } catch {
        // Already gone
      }
    }
    for (const dir of profiles) rmSync(dir, { recursive: true, force: true, maxRetries: 3 });
  };
  // A cancelled CI step or Ctrl-C: stop Chrome too, keep the progress file for the summary
  for (const signal of /** @type {const} */ (['SIGINT', 'SIGTERM'])) {
    process.once(signal, () => {
      save({ status: 'cancelled' });
      kill();
      process.exit(1);
    });
  }

  return new Promise((resolve) => {
    /** @type {NodeJS.Timeout | undefined} */
    let timer;
    let timedOut = false;
    const state = { text: '', pos: 0 };

    const onTimeout = async () => {
      timedOut = true;
      const what = `${current.url} run ${current.run} of ${current.runs}`;
      const message = `Lighthouse run took longer than ${timeoutMs / 1000} s: ${what}`;
      process.stdout.write('\n');
      console.error(github ? `::error::${message}` : message);
      const diagnostics = await diagnose(child.pid ?? 0).catch((e) => [`diagnostics failed: ${e.message}`]);
      console.error(diagnostics.join('\n'));
      save({ status: 'timeout', timeoutSeconds: timeoutMs / 1000, diagnostics });
      kill();
    };

    child.stdout?.on('data', (chunk) => {
      const text = String(chunk);
      process.stdout.write(text);
      for (const event of parse(state, text)) {
        clearTimeout(timer);
        if (event.type === 'start') {
          save({ status: 'running', url: event.url, run: event.run, runs: event.runs, startedAt: new Date().toISOString() });
          timer = setTimeout(onTimeout, timeoutMs);
        } else {
          save({ status: 'between runs' });
        }
      }
    });

    child.on('error', (e) => {
      save({ status: 'failed', error: e.message });
      console.error(`could not start ${command}: ${e.message}`);
      resolve(1);
    });

    child.on('exit', (code) => {
      clearTimeout(timer);
      if (!timedOut) save({ status: code === 0 ? 'done' : 'failed', exitCode: code });
      resolve(timedOut ? 1 : (code ?? 1));
    });
  });
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const seconds = Number(process.env.LHCI_RUN_TIMEOUT_SECONDS ?? DEFAULT_TIMEOUT_SECONDS);
  if (!(seconds > 0)) throw new Error(`LHCI_RUN_TIMEOUT_SECONDS must be a positive number, got "${process.env.LHCI_RUN_TIMEOUT_SECONDS}"`);
  const lhci = join(import.meta.dirname, '../node_modules/.bin/lhci');
  process.exitCode = await run({ command: lhci, args: process.argv.slice(2), timeoutMs: seconds * 1000 });
}
