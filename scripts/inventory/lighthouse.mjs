#!/usr/bin/env node
// Lighthouse lab baseline of representative pages on the current site (issue #4, M1-03).
// Usage: node scripts/inventory/lighthouse.mjs [--runs N] [--only <url substring>]
// Output: docs/research/lighthouse-baseline.json; full reports in .lighthouse-baseline/ (git-ignored)
// Method and findings: docs/research/seo-baseline.md
import { mkdir, writeFile } from 'node:fs/promises';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import * as chromeLauncher from 'chrome-launcher';

const OUT = 'docs/research/lighthouse-baseline.json';
const REPORT_DIR = '.lighthouse-baseline';
const argValue = (name) => {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const RUNS = Number(argValue('--runs') ?? 3);
const ONLY = argValue('--only');

// One page per main template, picked from inventory.csv (header nav first, newest post/news).
const PAGES = [
  { label: '首頁 zh-TW', pageType: 'home', url: 'https://www.tpisoftware.com/' },
  { label: '首頁 en', pageType: 'home', url: 'https://www.tpisoftware.com/en' },
  { label: '首頁 vi', pageType: 'home', url: 'https://www.tpisoftware.vn/' },
  { label: '產品總覽', pageType: 'product-index', url: 'https://www.tpisoftware.com/products' },
  { label: '產品頁', pageType: 'product', url: 'https://www.tpisoftware.com/products/digilism' },
  { label: '解決方案', pageType: 'solution', url: 'https://www.tpisoftware.com/solutions/smartclaim' },
  { label: '服務', pageType: 'service', url: 'https://www.tpisoftware.com/aiso' },
  { label: '客戶案例', pageType: 'case-study', url: 'https://www.tpisoftware.com/success-story' },
  { label: 'Blog 首頁', pageType: 'blog-index', url: 'https://www.tpisoftware.com/blog' },
  { label: 'Blog 文章', pageType: 'blog-post', url: 'https://www.tpisoftware.com/blog/ai/ai-gateway-for-enterprise-ai-security' },
  { label: '媒體中心', pageType: 'news-index', url: 'https://www.tpisoftware.com/media-center' },
  { label: '新聞', pageType: 'news', url: 'https://www.tpisoftware.com/media-center/585' },
  { label: '關於我們', pageType: 'about', url: 'https://www.tpisoftware.com/about-us' },
  { label: '聯絡我們', pageType: 'contact', url: 'https://www.tpisoftware.com/contact-us' },
];
const FORM_FACTORS = { mobile: undefined, desktop: desktopConfig };
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];
const METRICS = {
  lcp: 'largest-contentful-paint',
  cls: 'cumulative-layout-shift',
  tbt: 'total-blocking-time',
  fcp: 'first-contentful-paint',
  si: 'speed-index',
};

const median = (xs) => {
  const s = xs.filter((x) => typeof x === 'number').sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : null;
};
const round = (x, digits) => (x === null ? null : Number(x.toFixed(digits)));

function pick(lhr) {
  return {
    scores: Object.fromEntries(CATEGORIES.map((c) => [c, lhr.categories[c]?.score ?? null])),
    metrics: Object.fromEntries(Object.entries(METRICS).map(([k, id]) => [k, lhr.audits[id]?.numericValue ?? null])),
    rttMs: lhr.audits['network-rtt']?.numericValue ?? null,
    runtimeError: lhr.runtimeError?.code,
  };
}

async function main() {
  const measuredAt = new Date().toISOString();
  await mkdir(REPORT_DIR, { recursive: true });
  // Chrome does not read HTTPS_PROXY; pass it explicitly (cloud sessions).
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless=new', '--no-sandbox', ...(proxy ? [`--proxy-server=${proxy}`] : [])],
  });
  const results = [];
  let lhMeta;
  try {
    for (const page of PAGES.filter((p) => !ONLY || p.url.includes(ONLY))) {
      for (const [formFactor, config] of Object.entries(FORM_FACTORS)) {
        const runs = [];
        for (let i = 0; i < RUNS; i++) {
          const { lhr } = await lighthouse(page.url, { port: chrome.port, output: 'json', onlyCategories: CATEGORIES, logLevel: 'error' }, config);
          lhMeta ??= {
            lighthouse: lhr.lighthouseVersion,
            userAgent: lhr.environment.hostUserAgent,
            benchmarkIndex: lhr.environment.benchmarkIndex,
            throttling: { mobile: 'Lighthouse default (simulated, slow 4G, 4x CPU)', desktop: 'Lighthouse desktop preset (simulated)' },
          };
          runs.push(pick(lhr));
          const { host, pathname } = new URL(page.url);
          const slug = `${host.replace(/^www\./, '').replace(/\./g, '_')}${pathname.replace(/\W+/g, '-')}`;
          await writeFile(`${REPORT_DIR}/${slug}-${formFactor}-${i + 1}.json`, JSON.stringify(lhr));
          console.log(`  ${page.label} ${formFactor} #${i + 1}: perf ${runs.at(-1).scores.performance}`);
        }
        // Median per value (not per run) so one outlier run does not skew every column.
        results.push({
          ...page,
          formFactor,
          median: {
            scores: Object.fromEntries(CATEGORIES.map((c) => [c, median(runs.map((r) => r.scores[c]))])),
            metrics: {
              lcpMs: round(median(runs.map((r) => r.metrics.lcp)), 0),
              cls: round(median(runs.map((r) => r.metrics.cls)), 3),
              tbtMs: round(median(runs.map((r) => r.metrics.tbt)), 0),
              fcpMs: round(median(runs.map((r) => r.metrics.fcp)), 0),
              siMs: round(median(runs.map((r) => r.metrics.si)), 0),
            },
            rttMs: round(median(runs.map((r) => r.rttMs)), 0),
          },
          runs: runs.map((r) => ({ scores: r.scores, runtimeError: r.runtimeError })),
        });
      }
    }
  } finally {
    await chrome.kill();
  }
  const summary = {
    measuredAt,
    node: process.version,
    ...lhMeta,
    runsPerPage: RUNS,
    environment: 'Claude Code cloud container, headless Chromium via the session HTTPS proxy',
    results,
  };
  await writeFile(OUT, `${JSON.stringify(summary, null, 2)}\n`);
  console.log(`Done: ${results.length} page × form factor results.`);
}

await main();
