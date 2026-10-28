// The visitor's cookie choice (M6-04, #36, ADR 0007): read from and written to localStorage, and
// turned into the parameters of Google's consent commands. No DOM here, so node tests can import it
// (scripts/consent/state.test.mjs); the banner's script passes window.localStorage, or undefined
// when the browser refuses it (private windows, blocked site data), in which case every visit asks.

export const STORAGE_KEY = 'tpi-consent';

// Google consent types a category can turn on (Consent Mode v2)
export type ConsentType =
  | 'ad_storage'
  | 'ad_user_data'
  | 'ad_personalization'
  | 'analytics_storage'
  | 'functionality_storage'
  | 'personalization_storage'
  | 'security_storage';

export interface Category {
  id: string;
  // Strictly necessary: always granted, never asked
  required?: boolean;
  consentTypes: readonly ConsentType[];
}

// What is stored: the data file's version when the visitor chose, and the optional categories they
// granted. A different version means the categories or the copy changed, so the visitor is asked again.
export interface Choice {
  version: number;
  granted: string[];
  at: string;
}

type Readable = Pick<Storage, 'getItem'>;
type Writable = Pick<Storage, 'setItem'>;

const optionalIds = (categories: readonly Category[]) => new Set(categories.filter((c) => !c.required).map((c) => c.id));

/** The stored choice, or null when there is none, it is from another version or it can't be read. */
export function readChoice(storage: Readable | undefined, version: number, categories: readonly Category[]): Choice | null {
  let raw: string | null;
  try {
    raw = storage?.getItem(STORAGE_KEY) ?? null;
  } catch {
    return null;
  }
  if (!raw) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof data !== 'object' || data === null) return null;
  const { version: v, granted, at } = data as Record<string, unknown>;
  if (v !== version || !Array.isArray(granted) || typeof at !== 'string') return null;
  const known = optionalIds(categories);
  return { version, granted: granted.filter((id): id is string => typeof id === 'string' && known.has(id)), at };
}

/** A choice granting `granted` (unknown and required ids are dropped). */
export function makeChoice(version: number, categories: readonly Category[], granted: Iterable<string>, at = new Date()): Choice {
  const known = optionalIds(categories);
  return { version, granted: [...new Set(granted)].filter((id) => known.has(id)), at: at.toISOString() };
}

/** Stores the choice; false when the browser refuses (the choice then lasts for this page only). */
export function writeChoice(storage: Writable | undefined, choice: Choice): boolean {
  try {
    if (!storage) return false;
    storage.setItem(STORAGE_KEY, JSON.stringify(choice));
    return true;
  } catch {
    return false;
  }
}

/**
 * Parameters of gtag('consent', …): every consent type of every category, granted when its category
 * is required or granted, else denied. With `granted` empty this is the default before any choice.
 */
export function consentParams(categories: readonly Category[], granted: readonly string[]): Record<ConsentType, 'granted' | 'denied'> {
  const params: Partial<Record<ConsentType, 'granted' | 'denied'>> = {};
  for (const c of categories) for (const t of c.consentTypes) params[t] ??= 'denied';
  for (const c of categories) {
    if (c.required || granted.includes(c.id)) for (const t of c.consentTypes) params[t] = 'granted';
  }
  return params as Record<ConsentType, 'granted' | 'denied'>;
}

/** GTM loads only once the visitor has granted at least one optional category. */
export const wantsGtm = (categories: readonly Category[], choice: Choice | null) =>
  choice !== null && categories.some((c) => !c.required && choice.granted.includes(c.id));

/** True when `next` takes back a category `previous` granted: tags already running can't be stopped. */
export const revokes = (previous: Choice | null, next: Choice) => previous !== null && previous.granted.some((id) => !next.granted.includes(id));
