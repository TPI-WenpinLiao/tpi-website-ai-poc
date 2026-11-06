// Page-wide HTML that the components can't give on their own (#202): <wbr> between the words of
// the long runs of zh-TW headings, so they break between words (src/lib/content/phrases.ts).
// Runs on every rendered page, in `astro dev` and when the static build prerenders, so dev and dist/
// read the same.
import { defineMiddleware } from 'astro:middleware';
import { phrasedHtml } from './lib/content/phrases';
import { isLocale } from './lib/i18n/locales';

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  if (!response.headers.get('content-type')?.includes('text/html')) return response;
  const html = await response.text();
  const lang = /<html[^>]*\slang="([^"]+)"/.exec(html)?.[1];
  const body = lang && isLocale(lang) ? phrasedHtml(html, lang) : html;
  return new Response(body, { status: response.status, statusText: response.statusText, headers: response.headers });
});
