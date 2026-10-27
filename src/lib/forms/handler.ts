// What a form's Pages Function does with a POST (M6-01, #33), as a plain function of the request so
// node --test runs it without Cloudflare. In order: the secret must be set (else every submit is
// refused), the fields must pass validate(), Turnstile must accept the token, then the adapter sends.
//
// The page's script posts with `Accept: application/json` and gets a Reply. Without the script the
// browser posts the form itself; that can't carry a Turnstile token, so it only ever fails, and gets
// a 303 back to the page it came from (or to `next` in the unlikely case it passes).
import type { SubmitAdapter } from './adapter.ts';
import { fieldValues, formValues, validate, type FieldError, type FormId, type Values } from './rules.ts';
import type { Verify } from './turnstile.ts';

// The name Turnstile gives the hidden input it adds to the form
export const TOKEN_FIELD = 'cf-turnstile-response';
// Hidden input with the page to go to after a successful submit (/thanks in the page's locale)
export const NEXT_FIELD = 'next';

export type Reply =
  | { kind: 'ok'; next: string }
  | { kind: 'invalid'; errors: FieldError[] }
  | { kind: 'challenge' }
  | { kind: 'failed' };

const STATUS: Record<Reply['kind'], number> = { ok: 200, invalid: 400, challenge: 403, failed: 500 };

export interface Options {
  form: FormId;
  // TURNSTILE_SECRET_KEY from the Function's environment
  secret: string | undefined;
  verify: Verify;
  adapter: SubmitAdapter;
  now?: () => Date;
}

/** A site path to redirect to: starts with one slash, no scheme or host. Anything else is `/`. */
export function sitePath(value: string | undefined): string {
  return value && /^\/(?![/\\])/.test(value) && !/[\s\\]/.test(value) ? value : '/';
}

async function decide(request: Request, values: Values, options: Options): Promise<Reply> {
  const { form, secret, verify, adapter, now = () => new Date() } = options;
  if (!secret) return { kind: 'failed' };
  const errors = validate(form, values);
  if (errors.length) return { kind: 'invalid', errors };
  const token = values[TOKEN_FIELD]?.[0] ?? '';
  if (!token || !(await verify({ secret, token, ip: request.headers.get('cf-connecting-ip') }))) return { kind: 'challenge' };
  try {
    await adapter.send({ form, fields: fieldValues(form, values), receivedAt: now().toISOString() });
  } catch {
    return { kind: 'failed' };
  }
  return { kind: 'ok', next: sitePath(values[NEXT_FIELD]?.[0]) };
}

/** The path of the page the form was posted from, when it is on this site; else `/`. */
function samePage(request: Request): string {
  try {
    const back = new URL(request.headers.get('referer') ?? '');
    return back.origin === new URL(request.url).origin ? back.pathname : '/';
  } catch {
    return '/';
  }
}

export async function handleSubmission(request: Request, options: Options): Promise<Response> {
  let values: Values | undefined;
  try {
    values = formValues(await request.formData());
  } catch {
    values = undefined;
  }
  const reply: Reply = values ? await decide(request, values, options) : { kind: 'invalid', errors: [] };
  if ((request.headers.get('accept') ?? '').includes('application/json')) {
    return Response.json(reply, { status: STATUS[reply.kind], headers: { 'cache-control': 'no-store' } });
  }
  const location = reply.kind === 'ok' ? reply.next : samePage(request);
  return new Response(null, { status: 303, headers: { location, 'cache-control': 'no-store' } });
}
