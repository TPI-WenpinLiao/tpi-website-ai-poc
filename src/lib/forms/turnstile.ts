// Server-side check of a Cloudflare Turnstile token (M6-01, #33): Siteverify answers whether the token
// the widget put in the form is valid for our secret. A token can be checked once only, so the page
// resets the widget after every failed submit.
// Cloudflare's published test keys, for builds and checks without real keys (they are not secrets):
// a site key whose widget always passes, and secrets that always pass or always fail.
export const TEST_SITE_KEY = '1x00000000000000000000AA';
export const TEST_SECRET_PASS = '1x0000000000000000000000000000000AA';
export const TEST_SECRET_FAIL = '2x0000000000000000000000000000000AA';

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export interface Challenge {
  secret: string;
  token: string;
  // The visitor's IP (CF-Connecting-IP), optional
  ip?: string | null;
}

export type Verify = (challenge: Challenge) => Promise<boolean>;

/** Whether Siteverify accepts the token; any error, timeout or unexpected answer counts as no. */
export function siteverify(fetchImpl: typeof fetch = fetch): Verify {
  return async ({ secret, token, ip }) => {
    const body = new FormData();
    body.append('secret', secret);
    body.append('response', token);
    if (ip) body.append('remoteip', ip);
    try {
      const res = await fetchImpl(SITEVERIFY, { method: 'POST', body, signal: AbortSignal.timeout(10_000) });
      if (!res.ok) return false;
      const answer: unknown = await res.json();
      return typeof answer === 'object' && answer !== null && 'success' in answer && answer.success === true;
    } catch {
      return false;
    }
  };
}
