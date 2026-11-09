// Content collections (M4-01). Fields follow docs/ia/content-model.md; keep the two in sync.
import { existsSync, readFileSync } from 'node:fs';
import { defineCollection, reference, type ImageFunction } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { parse } from 'yaml';
import { frontmatterDateErrors } from '../scripts/content/dates.mjs';
import { LOCALES } from './lib/i18n/locales';
import { nodeIds, nodes } from './lib/ia/nodes';

const INDUSTRIES = ['finance', 'government', 'manufacturing'] as const;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ENTRY_ID = new RegExp(`^(?:${LOCALES.join('|')})/${SLUG.source.slice(1, -1)}$`);

type ImageFn = ImageFunction;

// Entries live at <collection>/<locale>/<slug>.md; the id keeps both so the same slug can exist per locale.
// glob's default id is slugified (lowercased), which would turn zh-TW into zh-tw.
function localizedGlob(collection: string) {
  return glob({
    pattern: '**/*.md',
    base: `./src/content/${collection}`,
    generateId: ({ entry, base }) => {
      const dateErrors = frontmatterDateErrors(readFileSync(new URL(entry, base), 'utf8'));
      if (dateErrors.length) throw new Error(`${collection}/${entry}: ${dateErrors.join('; ')}`);
      const [locale, slug, ...rest] = entry.replace(/\.md$/, '').split('/');
      if (!LOCALES.some((l) => l === locale) || !slug || rest.length || !SLUG.test(slug)) {
        throw new Error(`${collection}/${entry}: expected <${LOCALES.join('|')}>/<lowercase-slug>.md`);
      }
      return `${locale}/${slug}`;
    },
  });
}

const text = z.string().trim().min(1);
// YAML parses an unquoted 2026-10-20 as a Date (checked by frontmatterDateErrors); a quoted one stays a string.
// z.coerce.date() would also turn an empty value or a number into 1970-01-01, so only these two forms are accepted.
const date = z.union([z.date(), z.iso.date().transform((s) => new Date(s))], { error: 'expected a YYYY-MM-DD date' });
const httpUrl = z.url({ protocol: /^https?$/ });

// Shared and migration-tracking fields ("共用欄位", "遷移追蹤欄位")
const common = (image: ImageFn) => ({
  title: text,
  seoTitle: text.optional(),
  description: text,
  translationKey: text,
  ogImage: image().optional(),
  draft: z.boolean().default(false),
  // Fact library ids this entry states (docs/strategy/facts.yaml); scripts/strategy/facts.mjs checks
  // that they exist and that every number and client name in the copy comes from one of them
  facts: z.array(text).optional(),
  sourceUrl: z.union([httpUrl, z.array(httpUrl)]),
  migratedAt: date.optional(),
  sourceUpdatedAt: date.optional(),
});

function requireMigratedAt(data: { sourceUrl: string | string[]; migratedAt?: Date | undefined }, ctx: z.RefinementCtx) {
  const hasSource = typeof data.sourceUrl === 'string' || data.sourceUrl.length > 0;
  if (hasSource && !data.migratedAt) {
    ctx.addIssue({ code: 'custom', path: ['migratedAt'], message: 'migratedAt is required when sourceUrl is not []' });
  }
}

// reference() only logs a dangling id and the build still exits 0, so check the target exists first.
// Checked per entry (not cached) so entries added while `astro dev` runs are seen.
const TAGS_FILE = 'src/content/tags.yaml';
const tagIds = () => new Set(z.array(z.object({ id: z.string() })).parse(parse(readFileSync(TAGS_FILE, 'utf8'))).map((t) => t.id));

function ref<C extends 'offering' | 'case-study' | 'blog' | 'news' | 'tag'>(collection: C) {
  return z
    .string()
    .superRefine((id, ctx) => {
      // The id shape check also keeps `../` out of the path below
      const exists = collection === 'tag' ? tagIds().has(id) : ENTRY_ID.test(id) && existsSync(`src/content/${collection}/${id}.md`);
      if (!exists) ctx.addIssue({ code: 'custom', message: `${collection} entry "${id}" does not exist` });
    })
    .pipe(reference(collection));
}

const nodeOf = (template: string) => z.enum(nodeIds((n) => n.template === template, template));
// A link to any page node by its nodes.csv id; the template resolves the path per locale
const anyNode = z.enum(nodeIds(() => true, 'any'));
const nodeLink = z.strictObject({ label: text, node: anyNode });
// A section's link (#202): a page node, a news article (a case or news the section points to), or an
// off-site page (a trial sign-up); an off-site link is only an <a>, nothing loads from it
const sectionLink = z.union([
  nodeLink,
  z.strictObject({ label: text, news: ref('news') }),
  z.strictObject({ label: text, href: z.string().regex(/^https:\/\/[^\s]+$/) }),
]);
const parentOf = (id: string) => nodes.find((n) => n.id === id)?.parent;

// Offering and hub pages laid out by their brief (#187): one section per brief paragraph, each with
// the layout design-principles.md「內頁的版型」gives it. The template renders sections in order; a page
// without `sections` falls back to the older fields (features, highlights). Every string under a
// section is wording (headings, bodies, labels) or a fact text verbatim (items, rows, results); the
// facts are listed in the entry's `facts` and checked by scripts/strategy/facts.mjs.
// An interface fragment (UiFragment): a panel drawn in HTML and marked 示意, naming only what the
// facts name (features, settings, states), never sample data (counts, times, curves, client lists).
// A settings panel's rows are on, off or down; a flow of steps' rows are on (done), off (skipped) or
// next. The state words are the page's strings.layout, by kind (UiFragment, #209)
const fragmentRow = <const S extends readonly [string, ...string[]]>(states: S) =>
  z.strictObject({ label: text, value: text.optional(), state: z.enum(states).optional() });
const fragmentCommon = { title: text, tabs: z.array(text).optional(), note: text.optional() };
const uiFragment = z.union([
  z.strictObject({ ...fragmentCommon, kind: z.literal('settings').optional(), rows: z.array(fragmentRow(['on', 'off', 'down'])).min(1) }),
  z.strictObject({ ...fragmentCommon, kind: z.literal('steps'), rows: z.array(fragmentRow(['on', 'off', 'next'])).min(1) }),
]);
// A junction diagram (JunctionDiagram): existing systems, the product in the middle, what it opens
// up; a node can be marked down (failover) or standby
const diagram = z.strictObject({
  columns: z
    .array(
      z.strictObject({
        title: text,
        tone: z.enum(['legacy', 'product', 'new']),
        nodes: z.array(z.strictObject({ label: text, state: z.enum(['down', 'standby']).optional() })).min(1),
      }),
    )
    .length(3),
  caption: text,
});
// An item's node is linked from its title, so an item with a node has a title (linkedNodes counts it as linked)
const sectionItem = z
  .strictObject({ title: text.optional(), body: text, node: anyNode.optional() })
  .refine((i) => i.node === undefined || i.title !== undefined, { message: 'an item with a node needs a title to link from' });
const specRow = z.strictObject({ label: text, values: z.array(text).min(1), link: nodeLink.optional() });
const resultItem = z.strictObject({
  title: text,
  // A line under the title (the model behind the work), wording or a fact text
  sub: text.optional(),
  result: text,
  client: text.optional(),
  link: nodeLink.optional(),
  fragment: uiFragment.optional(),
});
const sectionCommon = (image: ImageFn) => ({
  // The in-page anchor (InPageNav lists sections that have one), lowercase-slug
  id: z.string().regex(SLUG).optional(),
  heading: text,
  body: text.optional(),
  // Two links when the section leads on to two places (#202: AISO's software page and the news of its alliance)
  link: z.union([sectionLink, z.array(sectionLink).length(2)]).optional(),
  // One step of fill to mark a change of question group (Surface fill)
  fill: z.enum(['subtle', 'brand']).optional(),
  // A picture of the ribbon world beside the claim (docs/design/image-prompts.md), decorative (alt
  // ""): for the layouts without a figure of their own (spec, timeline, band without a fragment)
  image: image().optional(),
});
const pageSection = (image: ImageFn) => z.discriminatedUnion('layout', [
  // 主張與原文: claim on the start side, fact items on the end side (FactRow)
  z.strictObject({ layout: z.literal('claim'), ...sectionCommon(image), items: z.array(sectionItem).min(1) }),
  // 接點圖: the diagram beside the claim, fact items under it in two columns, spec rows after them
  z.strictObject({ layout: z.literal('junction'), ...sectionCommon(image), diagram, items: z.array(sectionItem).optional(), rows: z.array(specRow).optional() }),
  // 介面片段: the fragment takes the larger side; `flip` puts it on the end side; `index` lists the
  // pages the section leads on to (IndexList)
  z.strictObject({
    layout: z.literal('ui'),
    ...sectionCommon(image),
    fragment: uiFragment,
    items: z.array(sectionItem).optional(),
    flip: z.boolean().optional(),
    // The facts go under the fragment and the claim, two to a row, so long facts beside a short
    // fragment don't leave its side half empty (#200)
    itemsBelow: z.boolean().optional(),
    index: z.array(z.strictObject({ body: text.optional(), node: anyNode })).optional(),
  }),
  // 規格表 and 對應表: a real table, one row a label (a regulation) and its fact texts
  // `compare` turns it into a comparison of two things side by side (#200, two machines): its row heads
  // the columns, and each row's two values go one to a column. `items` are fact texts above the table,
  // `record` a fact text closing the section (#200)
  z
    .strictObject({
      layout: z.literal('spec'),
      ...sectionCommon(image),
      rows: z.array(specRow).min(1),
      items: z.array(sectionItem).optional(),
      record: text.optional(),
      compare: z.strictObject({ label: text, values: z.array(text).length(2) }).optional(),
    })
    .refine((s) => !s.compare || s.rows.every((r) => r.values.length === 2 && !r.link), {
      message: 'a comparison table has two values a row and no links',
    }),
  // 時間列: ordered steps with their year, then (optionally) the 對應表 rows
  z.strictObject({
    layout: z.literal('timeline'),
    ...sectionCommon(image),
    intro: text.optional(),
    steps: z.array(z.strictObject({ year: text, body: text })).min(2),
    rows: z.array(specRow).optional(),
  }),
  // 成果: one work a row, its result and a fragment of it; `record` is a line closing the section
  z.strictObject({ layout: z.literal('results'), ...sectionCommon(image), items: z.array(resultItem).min(1), record: text.optional() }),
  // 色帶: the claim, a few facts and the action on a pale purple band, a fragment beside them
  z.strictObject({ layout: z.literal('band'), ...sectionCommon(image), items: z.array(sectionItem).optional(), fragment: uiFragment.optional() }),
  // 索引列: a section of its own, one page a row (IndexList), named by its node unless `label` says
  // what the page answers (the link's text); `body` is wording (#200). Secondary unless `weight` is
  // primary: a family hub's product index, the page's main way in (design-principles.md「索引列」, #211)
  z.strictObject({
    layout: z.literal('index'),
    ...sectionCommon(image),
    weight: z.enum(['primary', 'secondary']).optional(),
    items: z.array(z.strictObject({ node: anyNode, label: text.optional(), body: text.optional() })).min(1),
  }),
]);
// Cases as rows (CaseList, design-principles.md「案例列」): client, the work, its result when the
// fact library has one, the case study it links to; all fact texts
const caseNotes = z
  .array(
    z.strictObject({
      client: text.optional(),
      work: text.optional(),
      result: text.optional(),
      award: text.optional(),
      caseStudy: ref('case-study').optional(),
      // A case without a case study, told in a news article (#202): linked by the article's title
      news: ref('news').optional(),
      fragment: uiFragment.optional(),
    })
    .refine((c) => !(c.caseStudy && c.news), { message: 'a case links to a case study or a news article, not both' }),
  )
  .optional();
// A hero point is a fact text, with the condition that goes with it (#187)
const heroPoint = z.union([text, z.strictObject({ text, note: text })]);
// Labels on the hero's static picture, by the picture's anchor (src/lib/scene/ribbon/pictures.json)
const heroLabels = z.partialRecord(z.enum(['core', 'legacy', 'product', 'greenswift', 'model', 'service', 'ai0', 'ai1', 'ai2']), text).optional();

const offering = defineCollection({
  loader: localizedGlob('offering'),
  schema: ({ image }) =>
    z
      .strictObject({
        ...common(image),
        node: nodeOf('offering'),
        kind: z.enum(['product', 'solution', 'service']),
        tagline: text.optional(),
        heroImage: image().optional(),
        // One sentence under the tagline: the category and what it is for (#167); wording, no facts
        heroLead: text.optional(),
        // Fact texts shown with the hero (#167); the second action, to another page (a trial)
        heroPoints: z.array(heroPoint).optional(),
        heroLabels,
        // The second action: another page (a trial), or a section of this page by its `id` (#202)
        secondaryCta: z
          .union([z.strictObject({ label: text, node: anyNode }), z.strictObject({ label: text, href: z.string().regex(/^#[a-z0-9]+(?:-[a-z0-9]+)*$/) })])
          .optional(),
        sections: z.array(pageSection(image)).optional(),
        // `points` are fact texts listed under the body, `link` a page the feature leads on to (#167)
        features: z
          .array(z.strictObject({ title: text, body: text, icon: image().optional(), points: z.array(text).optional(), link: nodeLink.optional() }))
          .optional(),
        useCases: z.array(z.strictObject({ title: text, body: text, industry: z.enum(INDUSTRIES).optional() })).optional(),
        // Heading of the use cases block, and the number of features shown before it (#167); by
        // default 「應用情境」 after every feature
        useCasesTitle: text.optional(),
        useCasesAfter: z.number().int().min(0).optional(),
        faq: z.array(z.strictObject({ question: text, answer: text })).optional(),
        cta: z.enum(['contact', 'demo']),
        // The heading of the closing contact band, the page's own next step (#200); by default the site's
        contactTitle: text.optional(),
        relatedCaseStudies: z.array(ref('case-study')).optional(),
        // A line under the case studies' heading (#183): wording that names the case, then a fact
        // text about it; the facts are listed in `facts`
        casesIntro: text.optional(),
        caseNotes,
        relatedPosts: z.array(ref('blog')).optional(),
        downloads: z.array(z.strictObject({ label: text, file: text })).optional(),
      })
      .superRefine(requireMigratedAt)
      .superRefine((data, ctx) => {
        const cta = data.secondaryCta;
        if (cta && 'href' in cta && !data.sections?.some((s) => `#${s.id}` === cta.href)) {
          ctx.addIssue({ code: 'custom', path: ['secondaryCta', 'href'], message: `no section has the id of ${cta.href}` });
        }
      }),
});

const hub = defineCollection({
  loader: localizedGlob('hub'),
  schema: ({ image }) =>
    z
      .strictObject({
        ...common(image),
        node: nodeOf('hub'),
        tagline: text.optional(),
        heroImage: image().optional(),
        industry: z.enum(INDUSTRIES).optional(),
        // `link` a page the highlight leads on to (#178), as offering's features[].link
        highlights: z.array(z.strictObject({ title: text, body: text, link: nodeLink.optional() })).optional(),
        // The hero's sentence, evidence and contact button (#187), as offering's heroLead, heroPoints
        heroLead: text.optional(),
        heroPoints: z.array(heroPoint).optional(),
        heroLabels,
        heroCta: z.literal('contact').optional(),
        // The page's sections when its brief asks for more than highlights (#167, laid out per #187)
        sections: z.array(pageSection(image)).optional(),
        // Heading of the child pages' index rows (#200), by default 「探索」
        partsTitle: text.optional(),
        // Child pages left out of the index rows (#202: a page not known to be on sale); JSON-LD
        // hasPart still lists every child page
        omitParts: z.array(anyNode).optional(),
        // The heading of the closing contact band (#200), as offering's contactTitle
        contactTitle: text.optional(),
        featuredCaseStudies: z.array(ref('case-study')).optional(),
        // A line under the case studies' heading (#167): a fact text, listed in `facts`
        casesIntro: text.optional(),
        caseNotes,
        testimonial: z.strictObject({ quote: text, speaker: text }).optional(),
        featuredPosts: z.array(ref('blog')).optional(),
      })
      .superRefine(requireMigratedAt)
      .superRefine((data, ctx) => {
        // Industry hubs (industry-finance, …) look up offerings and case studies by `industry`
        for (const [i, id] of (data.omitParts ?? []).entries()) {
          if (parentOf(id) !== data.node) ctx.addIssue({ code: 'custom', path: ['omitParts', i], message: `${id} is not a child of ${data.node}` });
        }
        if (parentOf(data.node) !== 'industries') return;
        const expected = data.node.replace(/^industry-/, '');
        if (data.industry !== expected) {
          ctx.addIssue({ code: 'custom', path: ['industry'], message: `industry must be "${expected}" for node ${data.node}` });
        }
      }),
});

const caseStudy = defineCollection({
  loader: localizedGlob('case-study'),
  schema: ({ image }) =>
    z
      .strictObject({
        ...common(image),
        client: z.strictObject({ name: text, disclosed: z.boolean(), logo: image().optional() }),
        clientDescription: text.optional(),
        industry: z.enum([...INDUSTRIES, 'other']),
        // The current site's cases are one-paragraph cards (M5-03, #28): no date, no challenge and
        // solution split, often no named offering; that paragraph is the Markdown body
        offerings: z.array(ref('offering')).optional(),
        challenge: text.optional(),
        solution: text.optional(),
        results: z.array(z.strictObject({ label: text, value: text })).optional(),
        coverImage: image().optional(),
        publishedAt: date.optional(),
        // Position on the current site's list; orders the cases that have no publishedAt
        order: z.number().int().nonnegative().optional(),
      })
      .superRefine(requireMigratedAt)
      .superRefine((data, ctx) => {
        if (!data.client.disclosed && !data.clientDescription) {
          ctx.addIssue({ code: 'custom', path: ['clientDescription'], message: 'clientDescription is required when client.disclosed is false' });
        }
      }),
});

// Blog categories are the listing nodes under `blog` (blog-ai → ai)
const [firstCategory, ...otherCategories] = nodeIds((n) => n.parent === 'blog' && n.template === 'listing', 'blog category');
const toCategory = (id: string) => id.replace(/^blog-/, '');
const BLOG_CATEGORIES: [string, ...string[]] = [toCategory(firstCategory), ...otherCategories.map(toCategory)];

const blog = defineCollection({
  loader: localizedGlob('blog'),
  schema: ({ image }) =>
    z
      .strictObject({
        ...common(image),
        category: z.enum(BLOG_CATEGORIES),
        tags: z.array(ref('tag')).optional(),
        featured: z.boolean().default(false),
        publishedAt: date,
        updatedAt: date.optional(),
        author: text,
        authorType: z.enum(['Person', 'Organization']),
        coverImage: image(),
        relatedOfferings: z.array(ref('offering')).optional(),
      })
      .superRefine(requireMigratedAt),
});

const news = defineCollection({
  loader: localizedGlob('news'),
  schema: ({ image }) =>
    z
      .strictObject({
        ...common(image),
        newsType: z.enum(['press', 'product', 'newsletter']),
        publishedAt: date,
        updatedAt: date.optional(),
        coverImage: image(),
        relatedOfferings: z.array(ref('offering')).optional(),
      })
      .superRefine(requireMigratedAt),
});

const page = defineCollection({
  loader: localizedGlob('page'),
  schema: ({ image }) =>
    z
      .strictObject({
        ...common(image),
        node: z.enum(nodeIds((n) => n.template === 'content' || n.template === 'contact', 'content/contact')),
        heroImage: image().optional(),
        sections: z
          .array(
            z.strictObject({
              heading: text,
              body: text,
              items: z.array(z.strictObject({ title: text, body: text.optional(), image: image().optional() })).optional(),
            }),
          )
          .optional(),
        effectiveDate: date.optional(),
        pdf: text.optional(),
      })
      .superRefine(requireMigratedAt)
      .superRefine((data, ctx) => {
        if (parentOf(data.node) === 'legal' && !data.effectiveDate) {
          ctx.addIssue({ code: 'custom', path: ['effectiveDate'], message: `effectiveDate is required for legal page ${data.node}` });
        }
      }),
});

const person = defineCollection({
  loader: localizedGlob('person'),
  schema: ({ image }) =>
    z
      .strictObject({
        ...common(image),
        jobTitle: text,
        affiliation: text.optional(),
        // Position in the current site's team list, which the offering page follows
        order: z.number().int().nonnegative().optional(),
        photo: image().optional(),
        experience: z.array(text).optional(),
        education: z.array(text).optional(),
        expertise: z.array(text).optional(),
        certifications: z.array(text).optional(),
      })
      .superRefine(requireMigratedAt),
});

const whitepaper = defineCollection({
  loader: localizedGlob('whitepaper'),
  schema: ({ image }) =>
    z
      .strictObject({
        ...common(image),
        node: nodeOf('gated-download'),
        offeringNode: z.enum(nodeIds((n) => n.template === 'offering' || n.template === 'hub', 'offering/hub')),
        coverImage: image(),
        summary: z.array(text).optional(),
        file: text,
        form: z.enum(['whitepaper', 'ai-playbook']),
      })
      .superRefine(requireMigratedAt),
});

// Site-wide company data, one YAML file per locale (organization/zh-TW.yaml)
const organization = defineCollection({
  loader: glob({
    pattern: '*.yaml',
    base: './src/content/organization',
    generateId: ({ entry }) => {
      const locale = entry.replace(/\.yaml$/, '');
      if (!LOCALES.some((l) => l === locale)) throw new Error(`organization/${entry}: expected <${LOCALES.join('|')}>.yaml`);
      return locale;
    },
  }),
  schema: ({ image }) =>
    z
      .strictObject({
        name: text,
        alternateName: z.array(text).optional(),
        logo: image(),
        sameAs: z.array(httpUrl).optional(),
        offices: z
          .array(
            z.strictObject({
              id: z.string().regex(SLUG),
              name: text,
              address: text,
              phone: text.optional(),
              country: z.string().regex(/^[A-Z]{2}$/, 'ISO 3166-1 alpha-2 code'),
              headquarters: z.boolean().optional(),
            }),
          )
          .min(1),
      })
      .superRefine((data, ctx) => {
        // JSON-LD `address` comes from the single headquarters office
        if (data.offices.filter((o) => o.headquarters).length !== 1) {
          ctx.addIssue({ code: 'custom', path: ['offices'], message: 'exactly one office must have headquarters: true' });
        }
        const ids = data.offices.map((o) => o.id);
        if (new Set(ids).size !== ids.length) ctx.addIssue({ code: 'custom', path: ['offices'], message: 'office ids must be unique' });
      }),
});

// Controlled tag list for blog.tags; ids are the tag slugs, display names per locale
const tag = defineCollection({
  loader: file('src/content/tags.yaml'),
  schema: z.strictObject({
    id: z.string().regex(SLUG),
    name: z.strictObject({ 'zh-TW': text.optional(), en: text.optional(), vi: text.optional() }),
  }),
});

export const collections = { offering, hub, 'case-study': caseStudy, blog, news, page, person, whitepaper, organization, tag };
