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

const name = (path: string, width: number) => `${path === '/' ? 'home' : path.slice(1).replaceAll('/', '-')}-${width}.png`;

/** Loads every image, including lazy ones below the fold, and waits for the web fonts. */
async function settle(page: Page) {
  await page.evaluate(async () => {
    const images = [...document.images];
    for (const img of images) img.loading = 'eager';
    await Promise.all(images.map((img) => (img.complete ? null : img.decode().catch(() => null))));
    await document.fonts.ready;
  });
}

// The baselines hold Linux font rendering; elsewhere every page would differ
test.skip(process.platform !== 'linux', 'visual baselines are taken on Linux: run in a cloud session or CI (docs/workflow.md「視覺回歸」)');

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
