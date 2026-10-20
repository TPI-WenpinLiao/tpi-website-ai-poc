// Route normalization shared by the audit (M1-02) and sitemap (M2-01) scripts.

export const pathOf = (url) => new URL(url).pathname;

// Locale-independent route key, e.g. /en/products/x and tpisoftware.vn/products/x -> /products/x
export const routeKey = (url) => pathOf(url).replace(/^\/(en|ja|vn)(?=\/|$)/, '') || '/';

// .vn keeps the legacy product routes that .com redirects to /products/*
export const ROUTE_ALIASES = {
  '/digilogs-logs-management': '/products/digilogs',
  '/digirunner-api-management': '/products/digirunner',
};
