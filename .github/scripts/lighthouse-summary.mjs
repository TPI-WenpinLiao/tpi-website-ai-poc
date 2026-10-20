// Renders the representative Lighthouse CI runs as a Markdown table for the job summary.
import { existsSync, readFileSync } from 'node:fs';

const MANIFEST = '.lighthouseci/manifest.json';
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];
const THRESHOLDS = { performance: 0.95, accessibility: 0.95, 'best-practices': 0.95, seo: 1 };

if (!existsSync(MANIFEST)) {
  console.log('## Lighthouse\n\nLighthouse 未執行（前面的步驟失敗）。');
  process.exit(0);
}

const runs = JSON.parse(readFileSync(MANIFEST, 'utf8')).filter((r) => r.isRepresentativeRun);
const format = (key, score) => {
  const value = Math.round(score * 100);
  return score >= THRESHOLDS[key] ? `${value}` : `**${value}** ❌`;
};

const lines = [
  '## Lighthouse',
  '',
  `門檻：performance / accessibility / best-practices ≥ 95，seo = 100`,
  '',
  `| URL | ${CATEGORIES.join(' | ')} |`,
  `| --- | ${CATEGORIES.map(() => '---').join(' | ')} |`,
  ...runs.map((r) => {
    const path = new URL(r.url).pathname;
    return `| \`${path}\` | ${CATEGORIES.map((c) => format(c, r.summary[c])).join(' | ')} |`;
  }),
];
console.log(lines.join('\n'));
