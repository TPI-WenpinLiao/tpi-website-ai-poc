// Polite HTTP client shared by the inventory scripts: throttled, retried, proxy-aware.
import { spawnSync } from 'node:child_process';

// Node's fetch ignores HTTPS_PROXY unless NODE_USE_ENV_PROXY is set at startup (e.g. cloud sessions).
// Importing this module re-executes the entry script with it set.
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
  const child = spawnSync(process.execPath, ['--no-warnings', ...process.argv.slice(1)], {
    stdio: 'inherit',
    env: { ...process.env, NODE_USE_ENV_PROXY: '1' },
  });
  process.exit(child.status ?? 1);
}

const MIN_GAP_MS = 500;
const RETRIES = 4;
const UA = 'tpi-website-ai-poc inventory crawler (+https://github.com/TPI-WenpinLiao/tpi-website-ai-poc)';

let lastRequestAt = 0;
let gate = Promise.resolve();
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function throttle() {
  const prev = gate;
  let release;
  gate = new Promise((r) => (release = r));
  await prev;
  const wait = lastRequestAt + MIN_GAP_MS - Date.now();
  if (wait > 0) await sleep(wait);
  lastRequestAt = Date.now();
  release();
}

// Retries network errors (the site intermittently resets connections) and 502/503/504.
// Other statuses, including 500, are returned as-is so they can be recorded.
export async function request(url, init = {}) {
  let lastError;
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    if (attempt > 0) await sleep(1000 * 2 ** (attempt - 1));
    await throttle();
    try {
      const res = await fetch(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(30_000),
        ...init,
        headers: { 'User-Agent': UA, ...init.headers },
      });
      if ([502, 503, 504].includes(res.status) && attempt < RETRIES) continue;
      return res;
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(`${url}: ${lastError?.cause?.code ?? lastError?.message}`);
}
