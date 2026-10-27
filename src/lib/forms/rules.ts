// Field rules of the site's forms (M6-01, #33). The page's script and the Pages Function both run
// validate() on the same table, so the browser and the server judge input the same way; the
// server's answer is the one that counts. Free of Astro runtime imports so the Function and
// node --test can load it.

export type FieldRule =
  | { kind: 'text' | 'email' | 'tel' | 'textarea'; required: boolean; maxLength: number }
  // A checkbox group: between min and max options, each value a slug
  | { kind: 'choices'; min: number; max: number }
  // The privacy consent checkbox: must be checked
  | { kind: 'consent' };

export const FORMS = {
  contact: {
    name: { kind: 'text', required: true, maxLength: 50 },
    phone: { kind: 'tel', required: true, maxLength: 30 },
    email: { kind: 'email', required: true, maxLength: 254 },
    company: { kind: 'text', required: true, maxLength: 100 },
    offerings: { kind: 'choices', min: 1, max: 40 },
    subject: { kind: 'text', required: true, maxLength: 100 },
    message: { kind: 'textarea', required: false, maxLength: 2000 },
    consent: { kind: 'consent' },
  },
} as const satisfies Record<string, Record<string, FieldRule>>;

export type FormId = keyof typeof FORMS;

export const isFormId = (value: string): value is FormId => Object.hasOwn(FORMS, value);

export type ErrorCode = 'required' | 'tooLong' | 'email' | 'phone' | 'choose' | 'consent';

export interface FieldError {
  field: string;
  code: ErrorCode;
}

// Submitted values grouped by field name; a checkbox group's `offerings[]` is stored as `offerings`
export type Values = Record<string, string[]>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Digits, spaces and + - ( ), with at least one digit
const PHONE = /^(?=.*\d)[\d+\-() ]+$/;
const SLUG = /^[a-z0-9-]{1,64}$/;

/** FormData (or any [name, value] entries) to Values; files are dropped, `[]` names grouped. */
export function formValues(entries: Iterable<[string, FormDataEntryValue]>): Values {
  const values: Values = {};
  for (const [name, value] of entries) {
    if (typeof value !== 'string') continue;
    (values[name.replace(/\[\]$/, '')] ??= []).push(value);
  }
  return values;
}

function check(rule: FieldRule, given: readonly string[]): ErrorCode | undefined {
  switch (rule.kind) {
    case 'choices':
      return given.length < rule.min || given.length > rule.max || !given.every((v) => SLUG.test(v)) ? 'choose' : undefined;
    case 'consent':
      return given.length === 1 && given[0] === 'on' ? undefined : 'consent';
    case 'text':
    case 'email':
    case 'tel':
    case 'textarea': {
      const value = (given.length === 1 ? given[0] : given.join(' ')).trim();
      if (!value) return rule.required ? 'required' : undefined;
      if (value.length > rule.maxLength) return 'tooLong';
      if (rule.kind === 'email' && !EMAIL.test(value)) return 'email';
      if (rule.kind === 'tel' && !PHONE.test(value)) return 'phone';
      return undefined;
    }
    default: {
      const _exhaustive: never = rule;
      return _exhaustive;
    }
  }
}

/** Every field of the form that fails its rule, in the table's order (the page's order). */
export function validate(form: FormId, values: Values): FieldError[] {
  const rules: Record<string, FieldRule> = FORMS[form];
  return Object.entries(rules).flatMap(([field, rule]) => {
    const code = check(rule, values[field] ?? []);
    return code ? [{ field, code }] : [];
  });
}

/** The form's fields only, trimmed, for the adapter: hidden inputs and the Turnstile token stay out. */
export function fieldValues(form: FormId, values: Values): Values {
  return Object.fromEntries(Object.keys(FORMS[form]).map((field) => [field, (values[field] ?? []).map((v) => v.trim())]));
}
