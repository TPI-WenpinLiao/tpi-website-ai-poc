// Shape of the home page copy (#167): the five sections of ribbon-route
// (docs/strategy/concepts/ribbon-route/README.md「5 段的畫面與捲動」, docs/strategy/briefs/home.md).
// Each locale file exports a `home` of this type. Names, paths and order of linked pages come from
// docs/ia (src/lib/ia/navigation.ts); only the wording is here. Optional fields are the copy zh-TW
// has and en and vi don't yet (#167 follow-up): a section without its copy is left out, a heading
// without its copy falls back to the linked node's name.

/** Where a map label hangs (src/lib/scene/ribbon/world.ts) */
export type MapLabel = 'core' | 'legacy' | 'product' | 'model' | 'service';

export interface Home {
  /** <title> and description of the home page, which carries no site-name suffix */
  meta: { title: string; description: string };
  hero: {
    /** Two lines; `\n` is where the first ends */
    title: string;
    lead: string;
    /** The second action, to the industries section */
    secondary?: string;
    /** Alt text of the map picture; without it the picture is decorative */
    mapAlt?: string;
  };
  /** What each kind of block on the map is; without it the map has no labels */
  mapLabels?: Record<MapLabel, string>;
  industries: {
    title?: string;
    /** Keyed by industry node id: one line (a fact) and the link text */
    entries: Record<string, { text: string; link?: string }>;
  };
  cases: {
    title?: string;
    /** "{n} of {total}" while the live scene shows one result at a time */
    count?: string;
    /** `node` is the page the result links to; `link` its text, else the node's name */
    items: { node: string; name: string; result: string; link?: string }[];
  };
  products: {
    title?: string;
    /** Offering node ids, in order; their names come from docs/ia */
    nodes: string[];
  };
  orientAi: {
    node: string;
    title: string;
    /** A fact, quoted */
    quote?: string;
    link: string;
  };
  /** The contact band at the foot of the other pages (ContactCta) and the contact page's lead */
  contactCta: { title: string; description: string };
  /** The last section: its heading, the records the reader can check (facts), the one action, and
   * the link text to the about page (else the node's name) */
  contact: { title: string; description?: string; records?: { label: string; text: string }[]; action?: string; about?: string };
}
