// Form validation and the Pages Function's decisions (M6-01, #33): src/lib/forms/ and
// functions/api/contact.ts, run without Cloudflare. Part of `npm run test:scripts`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FORMS, fieldValues, formValues, validate } from '../../src/lib/forms/rules.ts';
import { handleSubmission, sitePath } from '../../src/lib/forms/handler.ts';
import { logAdapter } from '../../src/lib/forms/adapter.ts';
import { siteverify, TEST_SECRET_FAIL, TEST_SECRET_PASS } from '../../src/lib/forms/turnstile.ts';
import { onRequestPost } from '../../functions/api/contact.ts';

const VALID = [
  ['name', '王小明'],
  ['phone', '+886 2 2658-0508'],
  ['email', 'name@example.com'],
  ['company', '昕力資訊'],
  ['offerings[]', 'digirunner'],
  ['offerings[]', 'digilogs'],
  ['subject', '產品諮詢'],
  ['message', ''],
  ['consent', 'on'],
];

/** @param {[string, string][]} entries */
const values = (entries) => formValues(entries);
/** @param {[string, string][]} entries @param {Record<string, string>} change */
const replace = (entries, change) => entries.map(([k, v]) => [k, k in change ? change[k] : v]);
/** @param {[string, string][]} entries @param {string} name */
const without = (entries, name) => entries.filter(([k]) => k !== name);
const codes = (/** @type {{ field: string, code: string }[]} */ errors) => errors.map((e) => `${e.field}:${e.code}`);

test('a filled-in contact form is valid', () => {
  assert.deepEqual(validate('contact', values(VALID)), []);
});

test('an empty form fails every required field, in page order', () => {
  assert.deepEqual(codes(validate('contact', {})), [
    'name:required',
    'phone:required',
    'email:required',
    'company:required',
    'offerings:choose',
    'subject:required',
    'consent:consent',
  ]);
});

test('whitespace only counts as empty', () => {
  assert.deepEqual(codes(validate('contact', values(replace(VALID, { name: '   ' })))), ['name:required']);
});

test('email, phone and length are checked', () => {
  assert.deepEqual(codes(validate('contact', values(replace(VALID, { email: 'name.example.com' })))), ['email:email']);
  assert.deepEqual(codes(validate('contact', values(replace(VALID, { email: 'name@example' })))), ['email:email']);
  assert.deepEqual(codes(validate('contact', values(replace(VALID, { phone: '02-abc' })))), ['phone:phone']);
  assert.deepEqual(codes(validate('contact', values(replace(VALID, { phone: '+-()' })))), ['phone:phone']);
  // maxlength in the browser can be bypassed; the server still refuses
  assert.deepEqual(codes(validate('contact', values(replace(VALID, { company: 'x'.repeat(101) })))), ['company:tooLong']);
  assert.deepEqual(codes(validate('contact', values(replace(VALID, { message: 'x'.repeat(2001) })))), ['message:tooLong']);
});

test('the checkbox group needs at least one slug value; consent must be checked', () => {
  assert.deepEqual(codes(validate('contact', values(without(VALID, 'offerings[]')))), ['offerings:choose']);
  assert.deepEqual(codes(validate('contact', values(replace(VALID, { 'offerings[]': '<script>' })))), ['offerings:choose']);
  assert.deepEqual(codes(validate('contact', values(without(VALID, 'consent')))), ['consent:consent']);
  assert.deepEqual(codes(validate('contact', values(replace(VALID, { consent: 'yes' })))), ['consent:consent']);
});

test('fieldValues keeps only the form fields, trimmed', () => {
  const fields = fieldValues('contact', values([...replace(VALID, { name: ' 王小明 ' }), ['cf-turnstile-response', 't'], ['next', '/thanks']]));
  assert.deepEqual(Object.keys(fields), Object.keys(FORMS.contact));
  assert.deepEqual(fields.name, ['王小明']);
  assert.deepEqual(fields.offerings, ['digirunner', 'digilogs']);
});

test('sitePath only allows paths on this site', () => {
  assert.equal(sitePath('/thanks'), '/thanks');
  assert.equal(sitePath('/en/thanks'), '/en/thanks');
  for (const bad of ['//evil.example', '/\\evil.example', 'https://evil.example', 'thanks', '', undefined, '/a b']) {
    assert.equal(sitePath(bad), '/', String(bad));
  }
});

/** @param {[string, string][]} entries @param {Record<string, string>} [headers] */
function post(entries, headers = { accept: 'application/json' }) {
  const body = new FormData();
  for (const [k, v] of entries) body.append(k, v);
  return new Request('https://site.example/api/contact', { method: 'POST', body, headers });
}

function recorder() {
  /** @type {unknown[]} */
  const sent = [];
  return { sent, adapter: { send: async (/** @type {unknown} */ s) => void sent.push(s) } };
}

const pass = async () => true;
const fail = async () => false;
const SUBMIT = [...VALID, ['cf-turnstile-response', 'token'], ['next', '/thanks']];
const NOW = () => new Date('2026-10-26T00:00:00Z');

test('a valid submit with a passing token reaches the adapter and answers ok', async () => {
  const { sent, adapter } = recorder();
  const res = await handleSubmission(post(SUBMIT), { form: 'contact', secret: 's', verify: pass, adapter, now: NOW });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { kind: 'ok', next: '/thanks' });
  assert.equal(sent.length, 1);
  assert.deepEqual(sent[0], { form: 'contact', fields: fieldValues('contact', values(VALID)), receivedAt: '2026-10-26T00:00:00.000Z' });
});

test('Turnstile refusing the token rejects the submit and sends nothing', async () => {
  const { sent, adapter } = recorder();
  const res = await handleSubmission(post(SUBMIT), { form: 'contact', secret: 's', verify: fail, adapter });
  assert.equal(res.status, 403);
  assert.deepEqual(await res.json(), { kind: 'challenge' });
  assert.equal(sent.length, 0);
});

test('a missing token is refused without asking Turnstile', async () => {
  const { sent, adapter } = recorder();
  let asked = false;
  const verify = async () => ((asked = true), true);
  const res = await handleSubmission(post(VALID), { form: 'contact', secret: 's', verify, adapter });
  assert.equal(res.status, 403);
  assert.equal(asked, false);
  assert.equal(sent.length, 0);
});

test('invalid fields answer 400 with the same codes as validate(), before Turnstile', async () => {
  const { sent, adapter } = recorder();
  let asked = false;
  const verify = async () => ((asked = true), true);
  const entries = [...replace(SUBMIT, { email: 'nope' }), ['offerings[]', 'BAD SLUG']];
  const res = await handleSubmission(post(entries), { form: 'contact', secret: 's', verify, adapter });
  assert.equal(res.status, 400);
  assert.deepEqual(await res.json(), { kind: 'invalid', errors: validate('contact', values(entries)) });
  assert.equal(asked, false);
  assert.equal(sent.length, 0);
});

test('without a secret every submit fails (fail closed)', async () => {
  const { sent, adapter } = recorder();
  const res = await handleSubmission(post(SUBMIT), { form: 'contact', secret: undefined, verify: pass, adapter });
  assert.equal(res.status, 500);
  assert.deepEqual(await res.json(), { kind: 'failed' });
  assert.equal(sent.length, 0);
});

test('an adapter that throws answers failed', async () => {
  const adapter = { send: async () => Promise.reject(new Error('down')) };
  const res = await handleSubmission(post(SUBMIT), { form: 'contact', secret: 's', verify: pass, adapter });
  assert.equal(res.status, 500);
  assert.deepEqual(await res.json(), { kind: 'failed' });
});

test('a foreign next falls back to /', async () => {
  const { adapter } = recorder();
  const res = await handleSubmission(post(replace(SUBMIT, { next: 'https://evil.example' })), { form: 'contact', secret: 's', verify: pass, adapter });
  assert.deepEqual(await res.json(), { kind: 'ok', next: '/' });
});

test('a plain form post (no script) is redirected: back to the page on failure, to next on success', async () => {
  const { adapter } = recorder();
  const headers = { referer: 'https://site.example/contact-us' };
  const failed = await handleSubmission(post(VALID, headers), { form: 'contact', secret: 's', verify: pass, adapter });
  assert.equal(failed.status, 303);
  assert.equal(failed.headers.get('location'), '/contact-us');
  const foreign = await handleSubmission(post(VALID, { referer: 'https://evil.example/x' }), { form: 'contact', secret: 's', verify: pass, adapter });
  assert.equal(foreign.headers.get('location'), '/');
  const ok = await handleSubmission(post(SUBMIT, headers), { form: 'contact', secret: 's', verify: pass, adapter });
  assert.equal(ok.headers.get('location'), '/thanks');
});

test('siteverify reads only success: true, and treats errors as a refusal', async () => {
  /** @param {unknown} answer @param {number} [status] */
  const reply = (answer, status = 200) => /** @type {typeof fetch} */ (async () => Response.json(answer, { status }));
  const challenge = { secret: TEST_SECRET_PASS, token: 't', ip: '203.0.113.1' };
  assert.equal(await siteverify(reply({ success: true }))(challenge), true);
  assert.equal(await siteverify(reply({ success: false, 'error-codes': ['invalid-input-response'] }))(challenge), false);
  assert.equal(await siteverify(reply({ success: 'true' }))(challenge), false);
  assert.equal(await siteverify(reply({ success: true }, 500))(challenge), false);
  const broken = /** @type {typeof fetch} */ (async () => Promise.reject(new Error('offline')));
  assert.equal(await siteverify(broken)(challenge), false);

  /** @type {FormData | undefined} */
  let sentBody;
  const capture = /** @type {typeof fetch} */ (async (_url, init) => ((sentBody = /** @type {FormData} */ (init?.body)), Response.json({ success: true })));
  await siteverify(capture)({ ...challenge, secret: TEST_SECRET_FAIL });
  assert.equal(sentBody?.get('secret'), TEST_SECRET_FAIL);
  assert.equal(sentBody?.get('response'), 't');
  assert.equal(sentBody?.get('remoteip'), '203.0.113.1');
});

test('the log adapter writes field names, never values', async (t) => {
  const info = t.mock.method(console, 'info', () => {});
  await logAdapter.send({ form: 'contact', fields: fieldValues('contact', values(VALID)), receivedAt: '2026-10-26T00:00:00.000Z' });
  assert.equal(info.mock.callCount(), 1);
  const line = String(info.mock.calls[0].arguments[0]);
  assert.deepEqual(JSON.parse(line), {
    event: 'form-submission',
    form: 'contact',
    filled: ['name', 'phone', 'email', 'company', 'offerings', 'subject', 'consent'],
    receivedAt: '2026-10-26T00:00:00.000Z',
  });
  for (const [, value] of VALID) if (value && value !== 'on') assert.ok(!line.includes(value), `log contains ${value}`);
});

test('the Pages Function refuses everything while TURNSTILE_SECRET_KEY is unset', async () => {
  const res = await onRequestPost({ request: post(SUBMIT), env: {} });
  assert.equal(res.status, 500);
  assert.deepEqual(await res.json(), { kind: 'failed' });
});
