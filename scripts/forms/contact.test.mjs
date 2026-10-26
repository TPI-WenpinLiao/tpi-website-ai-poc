import { test } from 'node:test';
import assert from 'node:assert/strict';
import { problems } from './contact.mjs';

const OK = {
  loadRequests: [],
  empty: { rows: ['name', 'consent'], server: ['name', 'consent'], focused: true, unmarked: [] },
  sent: { path: '/thanks', next: '/thanks', submissions: 1 },
  refused: { path: '/contact-us', start: '/contact-us', message: '安全驗證未通過', expected: '安全驗證未通過', submissions: 0, resets: 1, buttonEnabled: true },
  sizes: { wide: 'flexible', narrow: 'compact' },
};

test('a form that behaves has no problems', () => {
  assert.deepEqual(problems(OK), []);
});

test('each broken behavior is reported', () => {
  assert.deepEqual(
    problems({
      loadRequests: ['https://challenges.cloudflare.com/turnstile/v0/api.js'],
      empty: { rows: ['name'], server: ['name', 'consent'], focused: false, unmarked: ['name'] },
      sent: { path: '/contact-us', next: '/thanks', submissions: 0 },
      refused: { path: '/thanks', start: '/contact-us', message: '', expected: '安全驗證未通過', submissions: 1, resets: 0, buttonEnabled: false },
      sizes: { wide: 'compact', narrow: '' },
    }),
    [
      'requested on load: https://challenges.cloudflare.com/turnstile/v0/api.js',
      'errors differ: page name; server name, consent',
      'focus does not move to the error summary',
      'name shows no error of its own',
      'after sending the page is /contact-us, not /thanks',
      'a valid submit reached the adapter 0 times',
      'a refused token left the page for /thanks',
      'a refused token shows "", not "安全驗證未通過"',
      'a refused token still reached the adapter',
      'the widget was not reset after a refused token',
      'the submit button stays disabled after a refused token',
      'the widget at 1280px is compact, not flexible',
      'the widget at 375px is missing, not compact',
    ],
  );
});

test('an empty form without a summary is a problem', () => {
  assert.deepEqual(problems({ ...OK, empty: { ...OK.empty, rows: [], server: [] } }), ['the empty form shows no error summary']);
});
