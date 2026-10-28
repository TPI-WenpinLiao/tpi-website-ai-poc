// Visual regression: full-page screenshots of one page per template at the three widths the
// design was approved at, compared with the baselines in __screenshots__/.
// The non-home templates use their /templates/<id> preview (M4-04): sample content, and the only
// page gated-download has until the whitepapers are built. The home page stands for the home
// template in every locale. /design-system is left out: 43,000px tall, a 4.6 MB baseline, and its
// components already appear on these pages.
// Pages load with prefers-reduced-motion: reduce (playwright.config.ts), so the 3D scene shows its
// static version (ADR 0003) and scroll reveals are already in place.
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test, type Page } from '@playwright/test';

const WIDTHS = [375, 768, 1280];
const TEMPLATES = readdirSync(resolve(import.meta.dirname, '../../dist/templates'))
  .filter((f) => f.endsWith('.html'))
  .map((f) => `/templates/${f.replace(/\.html$/, '')}`)
  .sort();

const PAGES = ['/', '/en', '/vi', ...TEMPLATES];

const SCREENSHOTS = resolve(import.meta.dirname, '__screenshots__');
const name = (path: string, width: number) => `${path === '/' ? 'home' : path.slice(1).replaceAll('/', '-')}-${width}.png`;

/**
 * Loads every image, including lazy ones below the fold, and waits for the web fonts. Sections with
 * content-visibility: auto (the article's More, #143) are drawn first: until then they stand in at
 * --offscreen-section-height, and the full-page screenshot would take that height, not the real one.
 */
async function settle(page: Page) {
  await page.addStyleTag({ content: '* { content-visibility: visible !important; }' });
  await page.evaluate(async () => {
    const images = [...document.images];
    for (const img of images) img.loading = 'eager';
    await Promise.all(images.map((img) => (img.complete ? null : img.decode().catch(() => null))));
    await document.fonts.ready;
  });
}

// --update-snapshots never deletes: a removed or renamed page would leave its baselines behind
test('every baseline belongs to a page and width that is tested', () => {
  const expected = new Set(PAGES.flatMap((path) => WIDTHS.map((width) => name(path, width))));
  expect(readdirSync(SCREENSHOTS).filter((f) => !expected.has(f))).toEqual([]);
});

test.describe('screenshots', () => {
  // The baselines come from CI (Playwright's image, .github/workflows/visual-baseline.yml). Elsewhere,
  // the cloud session included, lines close to the container width wrap differently and whole pages
  // shift (#24), so the comparison only runs in CI
  test.skip(!process.env.CI, 'visual baselines are taken and compared in CI only: see the quality-gate result (docs/workflow.md「視覺回歸」)');

  for (const path of PAGES) {
    for (const width of WIDTHS) {
      test(`${path} at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        const response = await page.goto(path, { waitUntil: 'load' });
        expect(response?.status(), `${path} was not built`).toBe(200);
        await settle(page);
        await expect(page).toHaveScreenshot(name(path, width), { fullPage: true, mask: [page.locator('canvas')] });
      });
    }
  }
});
