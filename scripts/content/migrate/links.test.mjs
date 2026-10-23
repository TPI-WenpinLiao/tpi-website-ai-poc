// Tests for scripts/content/migrate/links.mjs. Run: npm run test:scripts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { linkResolver, siteKey } from './links.mjs';

const resolve = linkResolver(
  [
    { from: 'https://www.tpisoftware.com/vn/about-us', to: '/vi/about' },
    { from: 'https://www.tpisoftware.com/orient-ai', to: '/orient-ai' },
    { from: 'https://www.tpisoftware.com/blog/ai/customer-complaint-ai-tool-selection-guide', to: '/blog/customer-complaint-ai-tool-selection-guide' },
    { from: 'https://www.tpisoftware.com/pdf/%E8%B3%87%E8%A8%8A%E5%AE%89%E5%85%A8%E6%94%BF%E7%AD%96.pdf', to: '/security-policy' },
  ],
  [{ url: 'https://www.tpisoftware.com/blog/smartm/apim/oidc-api' }],
  [
    { url: 'https://www.tpisoftware.com/vn/about-us', final_url: 'https://www.tpisoftware.vn/about-us' },
    { url: 'https://www.tpisoftware.com/orient-ai/', final_url: 'https://www.tpisoftware.com/orient-ai' },
  ],
);
const BASE = 'https://www.tpisoftware.com/media-center/585';

test('siteKey normalizes host, scheme, trailing slash; other hosts are null', () => {
  assert.equal(siteKey(new URL('http://tpisoftware.com/orient-ai/?a=1#x')), 'https://www.tpisoftware.com/orient-ai');
  assert.equal(siteKey(new URL('https://example.com/')), null);
});

test('current-site links map through redirects.csv, keeping the hash', () => {
  assert.deepEqual(resolve('https://www.tpisoftware.com/orient-ai/#spec', BASE), { href: '/orient-ai#spec' });
  assert.deepEqual(resolve('/blog/ai/customer-complaint-ai-tool-selection-guide', BASE), { href: '/blog/customer-complaint-ai-tool-selection-guide' });
  assert.deepEqual(resolve('https://www.tpisoftware.com/pdf/資訊安全政策.pdf', BASE), { href: '/security-policy' });
  assert.deepEqual(resolve('https://www.tpisoftware.com/', BASE), { href: '/' });
  assert.deepEqual(resolve('https://www.tpisoftware.vn', BASE), { href: '/vi' });
});

test('unmapped and broken links are kept and reported; other links pass through', () => {
  assert.deepEqual(resolve('https://www.tpisoftware.com/nope', BASE), { href: 'https://www.tpisoftware.com/nope', note: 'current-site link not in redirects.csv: https://www.tpisoftware.com/nope' });
  assert.match(resolve('https://www.tpisoftware.com/blog/smartm/apim/oidc-api', BASE).note, /^broken link/);
  assert.deepEqual(resolve('https://aws.amazon.com/marketplace', BASE), { href: 'https://aws.amazon.com/marketplace' });
  assert.deepEqual(resolve('mailto:service@tpisoftware.com', BASE), { href: 'mailto:service@tpisoftware.com' });
});

test('a link to where an inventory URL lands maps like the inventory URL', () => {
  assert.deepEqual(resolve('https://www.tpisoftware.vn/about-us', BASE), { href: '/vi/about' });
});
