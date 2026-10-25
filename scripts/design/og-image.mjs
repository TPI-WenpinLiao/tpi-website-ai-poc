// Renders the site-wide default Open Graph image, public/og/default.png (1200×630), from
// src/styles/tokens.css, so the image follows the design tokens instead of being drawn by hand.
// Content is only the company logo (src/assets/brand, from import-brand.mjs) and design motifs: no
// text, slogan or figures. Pages without their own ogImage fall back to it
// (docs/ia/content-model.md, BaseLayout.astro).
// Output depends on the local Chromium, so it is not part of `npm run check`. Rerun after changing
// tokens or the logo; the same environment gives the same PNG.
// Run: node scripts/design/og-image.mjs [out=public/og/default.png]

import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = resolve(import.meta.dirname, '../..');
export const WIDTH = 1200;
export const HEIGHT = 630;

/** HTML for the image. Layout values are fixed pixels: the canvas is a fixed-size image. */
export function template(tokensCss, logo) {
  const layers = [0, 1, 2, 3]
    .map((i) => `<div class="layer${i === 3 ? ' top' : ''}" style="--i:${i}"><span class="node"></span></div>`)
    .join('');
  return `<!doctype html>
<html lang="zh-TW" data-surface="dark">
<head>
<meta charset="utf-8">
<style>
${tokensCss}
* { box-sizing: border-box; }
html, body { margin: 0; }
body {
  position: relative;
  width: ${WIDTH}px;
  height: ${HEIGHT}px;
  overflow: hidden;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
}
.grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--color-grid-line) 1px, transparent 1px),
    linear-gradient(to right, var(--color-grid-line) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse at 70% 30%, black 20%, transparent 75%);
}
.glow {
  position: absolute;
  inset: -200px -200px auto auto;
  width: 760px;
  height: 760px;
  background: radial-gradient(circle, rgb(184 36 209 / 0.28), transparent 65%);
}
.copy {
  position: absolute;
  left: 80px;
  bottom: 96px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.logo {
  display: block;
  height: 160px;
}
.line {
  width: 320px;
  height: 4px;
  border-radius: 2px;
  background: var(--gradient-energy);
  box-shadow: var(--glow-brand);
}
.scene {
  position: absolute;
  right: 40px;
  top: 40px;
  width: 480px;
  height: 480px;
  display: grid;
  place-items: center;
  perspective: var(--perspective);
}
.stack {
  position: relative;
  width: 280px;
  height: 280px;
  transform: translateY(80px) rotateX(var(--scene-angle-x)) rotateZ(var(--scene-angle-z));
  transform-style: preserve-3d;
}
.layer {
  position: absolute;
  inset: 0;
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  background-color: var(--glass-bg);
  background-image:
    linear-gradient(var(--color-grid-line) 1px, transparent 1px),
    linear-gradient(to right, var(--color-grid-line) 1px, transparent 1px);
  background-size: 16px 16px;
  box-shadow: var(--shadow-md);
  transform: translateZ(calc(var(--i) * 52px));
}
.top { border-color: var(--color-border-brand); box-shadow: var(--shadow-lg), var(--glow-brand); }
.node {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: var(--glow-accent);
  transform: translate(-50%, -50%);
}
</style>
</head>
<body>
<div class="grid"></div>
<div class="glow"></div>
<div class="scene" aria-hidden="true"><div class="stack">${layers}</div></div>
<div class="copy">
  <img class="logo" src="${logo}" alt="TPIsoftware 昕力資訊">
  <div class="line"></div>
</div>
</body>
</html>`;
}

async function main([out = join(ROOT, 'public/og/default.png')]) {
  const html = template(
    readFileSync(join(ROOT, 'src/styles/tokens.css'), 'utf8'),
    `data:image/svg+xml;base64,${readFileSync(join(ROOT, 'src/assets/brand/logo-horizontal-white.svg')).toString('base64')}`,
  );
  const dir = mkdtempSync(join(tmpdir(), 'og-'));
  const file = join(dir, 'og.html');
  writeFileSync(file, html);
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(file).href, { waitUntil: 'networkidle0' });
    mkdirSync(dirname(out), { recursive: true });
    await page.screenshot({ path: out, type: 'png' });
    console.log(`wrote ${out} (${WIDTH}×${HEIGHT})`);
  } finally {
    await browser.close();
    rmSync(dir, { recursive: true, force: true });
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  });
}
