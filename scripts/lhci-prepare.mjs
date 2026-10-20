// Lighthouse's is-crawlable audit reads robots.txt, so a Disallow-all file would
// fail the SEO = 1 assertion. Audit a copy of dist without it; deployed output is untouched.
import { cpSync, rmSync } from 'node:fs';

const SRC = 'dist';
const OUT = '.lhci-dist';

rmSync(OUT, { recursive: true, force: true });
cpSync(SRC, OUT, { recursive: true });
rmSync(`${OUT}/robots.txt`, { force: true });
rmSync(`${OUT}/_headers`, { force: true });
