// Site-wide default social image (content-model.md `ogImage`), rendered by
// scripts/design/og-image.mjs. BaseLayout falls back to it; JSON-LD `image` does too.
export interface OgImage {
  // Site-relative path or absolute URL
  src: string;
  width: number;
  height: number;
  alt: string;
}

// alt is the zh-TW site name; Seo.astro uses the page locale's (siteName())
export const DEFAULT_OG_IMAGE: OgImage = { src: '/og/default.png', width: 1200, height: 630, alt: 'TPIsoftware 昕力資訊' };
