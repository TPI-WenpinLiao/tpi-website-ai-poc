// Content collections (M4-01). Fields follow docs/ia/content-model.md; keep the two in sync.
import { existsSync, readFileSync } from 'node:fs';
import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { parse } from 'yaml';
import { nodeIds, nodes } from './lib/ia/nodes';

const LOCALES = ['zh-TW', 'en', 'vi'] as const;
const INDUSTRIES = ['finance', 'government', 'manufacturing'] as const;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type ImageFn = () => z.ZodType;

// Entries live at <collection>/<locale>/<slug>.md; the id keeps both so the same slug can exist per locale.
// glob's default id is slugified (lowercased), which would turn zh-TW into zh-tw.
function localizedGlob(collection: string) {
  return glob({
    pattern: '**/*.md',
    base: `./src/content/${collection}`,
    generateId: ({ entry }) => {
      const [locale, slug, ...rest] = entry.replace(/\.md$/, '').split('/');
      if (!LOCALES.some((l) => l === locale) || !slug || rest.length || !SLUG.test(slug)) {
        throw new Error(`${collection}/${entry}: expected <${LOCALES.join('|')}>/<lowercase-slug>.md`);
      }
      return `${locale}/${slug}`;
    },
  });
}

const text = z.string().trim().min(1);
const date = z.coerce.date();
const httpUrl = z.url({ protocol: /^https?$/ });

// Shared and migration-tracking fields ("共用欄位", "遷移追蹤欄位")
const common = (image: ImageFn) => ({
  title: text,
  seoTitle: text.optional(),
  description: text,
  translationKey: text,
  ogImage: image().optional(),
  draft: z.boolean().default(false),
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

function ref<C extends 'offering' | 'case-study' | 'blog' | 'tag'>(collection: C) {
  return z
    .string()
    .superRefine((id, ctx) => {
      const exists = collection === 'tag' ? tagIds().has(id) : existsSync(`src/content/${collection}/${id}.md`);
      if (!exists) ctx.addIssue({ code: 'custom', message: `${collection} entry "${id}" does not exist` });
    })
    .pipe(reference(collection));
}

const nodeOf = (template: string) => z.enum(nodeIds((n) => n.template === template, template));
const parentOf = (id: string) => nodes.find((n) => n.id === id)?.parent;

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
        features: z.array(z.strictObject({ title: text, body: text, icon: image().optional() })).optional(),
        useCases: z.array(z.strictObject({ title: text, body: text, industry: z.enum(INDUSTRIES).optional() })).optional(),
        faq: z.array(z.strictObject({ question: text, answer: text })).optional(),
        cta: z.enum(['contact', 'demo']),
        relatedCaseStudies: z.array(ref('case-study')).optional(),
        relatedPosts: z.array(ref('blog')).optional(),
        downloads: z.array(z.strictObject({ label: text, file: text })).optional(),
      })
      .superRefine(requireMigratedAt),
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
        highlights: z.array(z.strictObject({ title: text, body: text })).optional(),
        featuredCaseStudies: z.array(ref('case-study')).optional(),
        featuredPosts: z.array(ref('blog')).optional(),
      })
      .superRefine(requireMigratedAt)
      .superRefine((data, ctx) => {
        // Industry hubs (industry-finance, …) look up offerings and case studies by `industry`
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
        offerings: z.array(ref('offering')).min(1),
        challenge: text,
        solution: text,
        results: z.array(z.strictObject({ label: text, value: text })).optional(),
        coverImage: image().optional(),
        publishedAt: date,
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
