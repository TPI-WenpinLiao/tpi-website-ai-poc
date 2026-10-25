// Visual regression tests (tests/visual/), run on the built site by `npm run check`.
// Baselines are shared between the cloud session and CI: both run Ubuntu 24.04 with the Chromium
// and fonts of this exact @playwright/test version (cloud: preinstalled in /opt/pw-browsers; CI:
// `npx playwright install --with-deps chromium`). Updating them: docs/workflow.md「視覺回歸」.
import { defineConfig, devices } from '@playwright/test';

const PORT = 4329;

export default defineConfig({
  testDir: 'tests/visual',
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }], ...(process.env.CI ? [['github'] as const] : [])],
  expect: {
    // An absolute limit: a ratio would let a recoloured button through on a 9,000px page. 300, not 0:
    // a 1px line on a half-pixel position (the SceneChapter eyebrow rule) rounds either way between
    // full-page captures, about 60 pixels per line; a recoloured token or border changes thousands
    toHaveScreenshot: { maxDiffPixels: 300, animations: 'disabled', caret: 'hide', scale: 'css' },
  },
  use: {
    ...devices['Desktop Chrome'],
    baseURL: `http://127.0.0.1:${PORT}`,
    reducedMotion: 'reduce',
    locale: 'zh-TW',
    timezoneId: 'Asia/Taipei',
  },
  webServer: {
    command: `node scripts/lib/static-server.mjs ${PORT}`,
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: false,
  },
});
