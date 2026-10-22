// URL paths of the pages built from static files under src/pages. Pages built from content through
// a dynamic route aren't listed here; they pass their other locale versions to LocaleSwitcher
// (`translations`). Keys only: the glob's lazy imports never run.
import { routeFromPageFile } from './alternates';

export const staticRoutes: ReadonlySet<string> = new Set(
  Object.keys(import.meta.glob('/src/pages/**/*.{astro,md,mdx}')).flatMap((file) => routeFromPageFile(file) ?? []),
);
