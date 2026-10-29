// Loads Google Tag Manager after consent (M6-04, #36, ADR 0007). Nothing here runs before the
// visitor grants an optional category: until then the page sends no request to Google. The consent
// default (every optional type denied) and the visitor's update go into the dataLayer before gtm.js,
// so the container's tags see them from the start.

const GTM = 'https://www.googletagmanager.com/gtm.js';

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

// gtag() as Google's snippet defines it: GTM only reads consent commands pushed as an arguments
// object, not as an array
function gtag(..._args: unknown[]) {
  (window.dataLayer ??= []).push(arguments);
}

let loaded = false;

export const gtmLoaded = () => loaded;

/** Pushes the consent default and update, then adds gtm.js for container `id`. Once per page. */
export function loadGtm(id: string, defaults: Record<string, string>, granted: Record<string, string>) {
  if (loaded) return;
  loaded = true;
  gtag('consent', 'default', defaults);
  gtag('consent', 'update', granted);
  (window.dataLayer ??= []).push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const script = document.createElement('script');
  script.async = true;
  script.src = `${GTM}?id=${encodeURIComponent(id)}`;
  document.head.append(script);
}

/** A later change that only adds categories: GTM is running, so tell it. */
export const updateConsent = (granted: Record<string, string>) => gtag('consent', 'update', granted);
