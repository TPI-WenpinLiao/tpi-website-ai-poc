// Renders the representative Lighthouse CI runs as a Markdown table for the job summary.
import { existsSync, readFileSync } from 'node:fs';
import { changedFiles, DOCS_ONLY } from '../../scripts/ci/lighthouse-scope.mjs';

const MANIFEST = '.lighthouseci/manifest.json';
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];
const THRESHOLDS = { performance: 0.95, accessibility: 0.95, 'best-practices': 0.95, seo: 1 };

// Docs-only PR (#129): quality-gate ran lighthouse-scope.mjs --verify instead of Lighthouse
if (process.env.LIGHTHOUSE_SKIP === 'true') {
  const files = changedFiles();
  const verify = {
    success: '通過：拿掉白名單內的檔案後重新 build，`dist/` 每個檔案都相同',
    failure: '**失敗** ❌：build 讀了白名單內的檔案，要縮小 `DOCS_ONLY`（見 Verify DOCS_ONLY 的 log）',
  }[process.env.VERIFY_OUTCOME ?? ''] ?? '沒有執行（前面的步驟失敗）';
  console.log(
    [
      '## Lighthouse',
      '',
      '只改文件，跳過 Lighthouse。',
      '',
      `- 白名單（\`scripts/ci/lighthouse-scope.mjs\` 的 \`DOCS_ONLY\`）：${DOCS_ONLY.map((p) => `\`${p.pattern}\``).join('、')}`,
      `- \`lighthouse-scope.mjs --verify\`：${verify}`,
      `- 變更的檔案（${files.length}）都在白名單內：`,
      ...files.map((f) => `  - \`${f}\``),
    ].join('\n'),
  );
  process.exit(0);
}

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
