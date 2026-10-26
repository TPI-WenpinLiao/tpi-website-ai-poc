// Lighthouse's is-crawlable audit reads robots.txt, so a Disallow-all file would
// fail the SEO = 1 assertion. Audit a copy of dist without it; deployed output is untouched.
// Also fails when lighthouserc.cjs lists a page that was not built, or misses a template, so the
// page list cannot go stale when a slug changes or a template is added (ADR 0004).
import { cpSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';

const SRC = 'dist';
const OUT = '.lhci-dist';
const TEMPLATES = 'src/layouts/templates';

const { PAGES } = createRequire(import.meta.url)('../lighthouserc.cjs');

// ArticleTemplate.astro -> article, CaseStudyTemplate.astro -> case-study
const templates = readdirSync(TEMPLATES)
  .filter((f) => f.endsWith('Template.astro'))
  .map((f) => f.replace(/Template\.astro$/, '').replace(/(?<!^)[A-Z]/g, (c) => `-${c}`).toLowerCase());

const errors = [
  ...PAGES.filter((p) => !existsSync(`${SRC}${p.path}`)).map((p) => `${p.path} is not in ${SRC}/`),
  ...PAGES.filter((p) => !templates.includes(p.template)).map((p) => `${p.path}: no ${TEMPLATES} file for template "${p.template}"`),
  ...templates.filter((t) => !PAGES.some((p) => p.template === t)).map((t) => `no page for template "${t}"`),
];
if (errors.length) {
  console.error(`lighthouserc.cjs PAGES:\n${errors.map((e) => `  ${e}`).join('\n')}`);
  process.exit(1);
}

rmSync(OUT, { recursive: true, force: true });
cpSync(SRC, OUT, { recursive: true });
rmSync(`${OUT}/robots.txt`, { force: true });
rmSync(`${OUT}/_headers`, { force: true });
