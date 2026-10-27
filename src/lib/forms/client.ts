// The script of a sending FormPanel (M6-01, #33): validation messages, the Turnstile widget and the
// submit. It runs validate() from rules.ts, the same function the Pages Function runs, so a visitor
// only sees errors the server would also give; whatever the server answers still wins.
//
// - Turnstile's script loads on the first focus inside the form, so the page itself requests nothing
//   from another site. The widget goes in the reserved challenge space: flexible when the space is at
//   least 300px wide (its minimum), else compact
// - Errors fill the fields' pre-rendered error paragraphs and a copy of the summary <template>; focus
//   moves to the status area so the summary is read out first
// - After any failed submit the widget is reset: a token can be checked once only
import { TOKEN_FIELD, type Reply } from './handler.ts';
import { FORMS, formValues, isFormId, validate, type ErrorCode, type FieldError, type FieldRule, type FormId } from './rules.ts';

export type Messages = Record<ErrorCode | 'challenge' | 'failed' | 'pending', string>;

interface TurnstileOptions {
  sitekey: string;
  size: 'flexible' | 'compact';
  theme: 'light' | 'dark';
  action: string;
  callback?: (token: string) => void;
}

interface Turnstile {
  render(container: HTMLElement, options: TurnstileOptions): string | undefined;
  reset(widgetId?: string): void;
}

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
// Turnstile's flexible size can't be narrower than this
const FLEXIBLE_MIN_WIDTH = 300;
function parseMessages(json: string | undefined): Messages {
  const data: unknown = JSON.parse(json ?? '{}');
  const entries = new Map(typeof data === 'object' && data !== null ? Object.entries(data) : []);
  const read = (key: keyof Messages): string => {
    const value: unknown = entries.get(key);
    if (typeof value !== 'string') throw new Error(`form data-messages has no ${key}`);
    return value;
  };
  return {
    required: read('required'),
    tooLong: read('tooLong'),
    email: read('email'),
    phone: read('phone'),
    choose: read('choose'),
    consent: read('consent'),
    challenge: read('challenge'),
    failed: read('failed'),
    pending: read('pending'),
  };
}

function isFieldError(value: unknown): value is FieldError {
  return typeof value === 'object' && value !== null && 'field' in value && typeof value.field === 'string' && 'code' in value && typeof value.code === 'string';
}

/** The Function's JSON answer; anything unexpected counts as failed. */
export function parseReply(data: unknown): Reply {
  if (typeof data !== 'object' || data === null || !('kind' in data)) return { kind: 'failed' };
  switch (data.kind) {
    case 'ok':
      return 'next' in data && typeof data.next === 'string' ? { kind: 'ok', next: data.next } : { kind: 'failed' };
    case 'invalid':
      return 'errors' in data && Array.isArray(data.errors) && data.errors.every(isFieldError) ? { kind: 'invalid', errors: data.errors } : { kind: 'failed' };
    case 'challenge':
      return { kind: 'challenge' };
    default:
      return { kind: 'failed' };
  }
}

/** The message for one error, with the field's label and limit filled in. */
export function errorText(messages: Messages, error: FieldError, label: string, rule: FieldRule | undefined): string {
  const max = rule && 'maxLength' in rule ? String(rule.maxLength) : '';
  return messages[error.code].replaceAll('{label}', label).replaceAll('{max}', max);
}

let turnstileLoad: Promise<Turnstile> | undefined;

function loadTurnstile(): Promise<Turnstile> {
  turnstileLoad ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = TURNSTILE_SCRIPT;
    script.async = true;
    script.addEventListener('load', () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('Turnstile did not load'))));
    script.addEventListener('error', () => reject(new Error('Turnstile did not load')));
    document.head.append(script);
  });
  return turnstileLoad;
}

const pad = (n: number) => String(n).padStart(2, '0');

export function enhance(form: HTMLFormElement): void {
  const id = form.dataset.form ?? '';
  if (!isFormId(id)) throw new Error(`form data-form="${id}" is not in src/lib/forms/rules.ts`);
  const formId: FormId = id;
  const rules: Record<string, FieldRule> = FORMS[formId];
  const messages = parseMessages(form.dataset.messages);
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const summary = form.querySelector<HTMLTemplateElement>('template[data-form-summary]');
  const notice = form.querySelector<HTMLTemplateElement>('template[data-form-message]');
  const challenge = form.querySelector<HTMLElement>('[data-form-challenge]');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!status || !summary || !notice || !challenge || !submit) throw new Error(`form ${formId} is missing part of FormPanel`);
  const submitLabel = submit.textContent ?? '';

  // The script shows its own messages; the native ones would come first and in another style
  form.noValidate = true;

  let widget: { turnstile: Turnstile; id: string | undefined } | undefined;
  const startChallenge = () => {
    loadTurnstile()
      .then((turnstile) => {
        const theme = challenge.closest('[data-surface="dark"]') ? 'dark' : 'light';
        const size = challenge.clientWidth >= FLEXIBLE_MIN_WIDTH ? 'flexible' : 'compact';
        widget = { turnstile, id: turnstile.render(challenge, { sitekey: form.dataset.sitekey ?? '', size, theme, action: formId }) };
      })
      // Without the widget the submit is refused with the spam check message; nothing else to do
      .catch(() => {});
  };
  form.addEventListener('focusin', startChallenge, { once: true });

  const fieldOf = (name: string) => {
    const target = form.querySelector<HTMLElement>(`#${CSS.escape(name)}`);
    return { target, wrapper: target?.closest<HTMLElement>('[data-form-field]') ?? null };
  };

  const clear = () => {
    status.replaceChildren();
    for (const wrapper of form.querySelectorAll<HTMLElement>('[data-form-field].has-error')) wrapper.classList.remove('has-error');
    for (const error of form.querySelectorAll<HTMLElement>('[data-form-error]')) {
      error.hidden = true;
      error.textContent = '';
    }
    for (const control of form.querySelectorAll('[aria-invalid]')) control.removeAttribute('aria-invalid');
    for (const described of form.querySelectorAll<HTMLElement>('[aria-describedby]')) {
      const ids = (described.getAttribute('aria-describedby') ?? '').split(' ').filter((ref) => !ref.endsWith('-error'));
      if (ids.length) described.setAttribute('aria-describedby', ids.join(' '));
      else described.removeAttribute('aria-describedby');
    }
  };

  const showMessage = (text: string) => {
    clear();
    const copy = notice.content.cloneNode(true);
    if (!(copy instanceof DocumentFragment)) return;
    const slot = copy.querySelector('.text');
    if (slot) slot.textContent = text;
    status.replaceChildren(copy);
    status.focus();
  };

  const showErrors = (errors: readonly FieldError[]) => {
    clear();
    const copy = summary.content.cloneNode(true);
    if (!(copy instanceof DocumentFragment)) return;
    const index = copy.querySelector('.index');
    if (index) index.textContent = pad(errors.length);
    const list = copy.querySelector('ol');
    const row = list?.querySelector('li');
    if (!list || !row) return;
    row.remove();
    errors.forEach((error, i) => {
      const { target, wrapper } = fieldOf(error.field);
      const text = errorText(messages, error, wrapper?.dataset.label ?? error.field, rules[error.field]);
      const item = row.cloneNode(true);
      if (!(item instanceof HTMLElement)) return;
      const link = item.querySelector('a');
      link?.setAttribute('href', `#${error.field}`);
      const n = item.querySelector('.n');
      if (n) n.textContent = pad(i + 1);
      const label = item.querySelector('.text');
      if (label) label.textContent = text;
      list.append(item);

      const paragraph = wrapper?.querySelector<HTMLElement>(':scope > [data-form-error]');
      if (!wrapper || !target || !paragraph) return;
      wrapper.classList.add('has-error');
      paragraph.textContent = text;
      paragraph.hidden = false;
      const described = [target.getAttribute('aria-describedby'), paragraph.id].filter(Boolean).join(' ');
      target.setAttribute('aria-describedby', described);
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) target.setAttribute('aria-invalid', 'true');
    });
    status.replaceChildren(copy);
    status.focus();
  };

  const setBusy = (busy: boolean) => {
    form.setAttribute('aria-busy', String(busy));
    submit.disabled = busy;
    submit.textContent = busy ? messages.pending : submitLabel;
  };

  let sending = false;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;
    const data = new FormData(form);
    const values = formValues(data);
    const errors = validate(formId, values);
    if (errors.length) return showErrors(errors);
    if (!values[TOKEN_FIELD]?.[0]) return showMessage(messages.challenge);

    sending = true;
    setBusy(true);
    let reply: Reply;
    try {
      const res = await fetch(form.action, { method: 'POST', body: data, headers: { accept: 'application/json' } });
      reply = parseReply(await res.json());
    } catch {
      reply = { kind: 'failed' };
    }
    if (reply.kind === 'ok') {
      // Leave the button in its sending state while the next page loads
      window.location.assign(reply.next);
      return;
    }
    sending = false;
    setBusy(false);
    widget?.turnstile.reset(widget.id);
    switch (reply.kind) {
      case 'invalid':
        return reply.errors.length ? showErrors(reply.errors) : showMessage(messages.failed);
      case 'challenge':
        return showMessage(messages.challenge);
      case 'failed':
        return showMessage(messages.failed);
      default: {
        const _exhaustive: never = reply;
        return _exhaustive;
      }
    }
  });
}
