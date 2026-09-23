import { randomBytes } from 'node:crypto';
import { CmsError } from './errors';
import { BLOCK_TYPES, SCHEMA_TYPES, type CmsBlock, type CmsDocument, type CmsKind, type CmsStatus, type SchemaType } from './types';
import { emptySeo } from './types';

const RESERVED = new Set([
  'admin', 'api', 'cms-api', 'media', 'apply', 'enquiry', 'contact', 'grievance', 'gallery', 'news',
  'search', 'privacy-policy', 'feedback', 'blog', 'uploads', 'llms.txt', 'sitemap.xml', 'robots.txt',
  'admissions/b-category-application',
]);

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;
const ALLOWED = new Set<string>(BLOCK_TYPES);

export function newId(prefix = 'cms') {
  return `${prefix}_${randomBytes(5).toString('hex')}`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/['’]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

function str(v: unknown, max: number) {
  return String(v ?? '').replace(/\u0000/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function rawText(v: unknown, max: number) {
  return String(v ?? '').replace(/\u0000/g, '').trim().slice(0, max);
}

export function cleanHref(href: string) {
  const h = href.trim();
  if (!h || h.length > 800) return '';
  if (h.startsWith('/') && !h.startsWith('//') && !h.includes('..')) return h;
  if (/^https?:\/\//i.test(h)) return h;
  if (/^(mailto:|tel:)/i.test(h)) return h;
  return '';
}

function youtubeEmbed(url: string) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : '';
}

function cleanBlock(input: unknown): CmsBlock | null {
  if (!input || typeof input !== 'object') return null;
  let parsed: CmsBlock;
  try {
    const json = JSON.stringify(input);
    if (json.length > 80_000) return null;
    parsed = JSON.parse(json) as CmsBlock;
  } catch {
    return null;
  }
  if (!ALLOWED.has(String(parsed.type))) return null;
  if (typeof parsed.text === 'string') parsed.text = rawText(parsed.text, 8000);
  if (typeof parsed.alt === 'string') parsed.alt = str(parsed.alt, 240);
  if (typeof parsed.label === 'string') parsed.label = str(parsed.label, 240);
  if (typeof parsed.href === 'string') parsed.href = cleanHref(parsed.href);
  if (typeof parsed.src === 'string') {
    if (parsed.type === 'video') {
      const embed = youtubeEmbed(parsed.src) || (parsed.src.startsWith('https://www.youtube.com/embed/') ? parsed.src : '');
      parsed.src = embed;
    } else if (parsed.type === 'map') {
      parsed.src = /^https:\/\/(www\.)?google\.[a-z.]+\/maps/i.test(parsed.src) ? parsed.src.slice(0, 1200) : '';
    } else if (parsed.type === 'embed') {
      parsed.src = /^https:\/\//i.test(parsed.src) ? parsed.src.slice(0, 800) : '';
    } else {
      parsed.src = cleanHref(parsed.src);
    }
  }
  if (Array.isArray(parsed.items)) {
    parsed.items = parsed.items.slice(0, 200).map((item) => ({
      ...item,
      text: rawText(item?.text, 2000),
      links: Array.isArray(item?.links)
        ? item.links.slice(0, 8).map((l) => ({ label: str(l?.label, 180), href: cleanHref(String(l?.href || '')) })).filter((l) => l.href && l.label)
        : undefined,
    })).filter((item) => item.text);
  }
  if (Array.isArray(parsed.rows)) {
    parsed.rows = parsed.rows.slice(0, 80).map((row) =>
      (Array.isArray(row) ? row : []).slice(0, 12).map((cell) => ({
        ...cell,
        text: rawText(cell?.text, 2000),
        links: Array.isArray(cell?.links)
          ? cell.links.slice(0, 6).map((l) => ({ label: str(l?.label, 180), href: cleanHref(String(l?.href || '')) })).filter((l) => l.href)
          : undefined,
      })),
    );
  }
  if (Array.isArray(parsed.images)) {
    parsed.images = parsed.images.slice(0, 60).map((img) => ({
      src: cleanHref(String(img?.src || '')),
      alt: str(img?.alt, 240),
      caption: str(img?.caption, 240),
    })).filter((img) => img.src);
  }
  if (parsed.type === 'heading') {
    const level = Number(parsed.level || 2);
    parsed.level = level === 3 || level === 4 ? level : 2;
    if (!parsed.text) return null;
  }
  if ((parsed.type === 'paragraph' || parsed.type === 'callout') && !parsed.text) return null;
  if (parsed.type === 'list' && !(parsed.items || []).length) return null;
  if (parsed.type === 'table' && !(parsed.rows || []).length) return null;
  if ((parsed.type === 'image' || parsed.type === 'video' || parsed.type === 'map' || parsed.type === 'embed') && !parsed.src) return null;
  if ((parsed.type === 'document' || parsed.type === 'link') && (!parsed.href || !parsed.label)) return null;
  if (parsed.type === 'gallery' && !(parsed.images || []).length) return null;
  return parsed;
}

export function assertSlug(slug: string, kind: CmsKind) {
  if (!SLUG_RE.test(slug) || slug.length > 140) {
    throw new CmsError('Use a short lowercase slug, like admissions/fee-structure or blog/naac-visit-2026.');
  }
  if (RESERVED.has(slug) || RESERVED.has(slug.split('/')[0])) {
    throw new CmsError(`“${slug.split('/')[0]}” is reserved. Pick another address.`);
  }
  if (kind === 'blog' && !slug.startsWith('blog/')) throw new CmsError('Blog posts must live under /blog/…');
  if (kind === 'page' && (slug === 'blog' || slug.startsWith('blog/'))) throw new CmsError('Pages cannot use the /blog address. Create a blog post instead.');
  if (slug.split('/').some((p) => p === 'admin' || p === 'api' || p === 'cms-api')) throw new CmsError('That address is reserved.');
}

export function normalizeDocument(raw: unknown, existing: CmsDocument | null, user: string, sections: Record<string, string>): CmsDocument {
  if (!raw || typeof raw !== 'object') throw new CmsError('Empty document.');
  const body = raw as Record<string, unknown>;
  const kind: CmsKind = body.kind === 'blog' || existing?.kind === 'blog' ? 'blog' : 'page';
  const title = str(body.title, 180);
  if (title.length < 3) throw new CmsError('Add a title (at least 3 characters).');
  const section = kind === 'blog' ? 'blog' : str(body.section, 40) || 'about';
  if (kind === 'page' && !sections[section]) throw new CmsError('Choose a section from the list.');
  let slug = str(body.slug, 140).replace(/^\/+|\/+$/g, '').toLowerCase();
  if (!slug || slug === 'blog') {
    const leaf = slugify(title);
    slug = kind === 'blog' ? `blog/${leaf}` : `${section}/${leaf}`;
  }
  if (kind === 'blog' && !slug.startsWith('blog/')) slug = `blog/${slugify(slug)}`;
  assertSlug(slug, kind);

  const status: CmsStatus = body.status === 'published' ? 'published' : 'draft';
  const today = new Date().toISOString().slice(0, 10);
  const now = new Date().toISOString();
  const seoIn = (body.seo && typeof body.seo === 'object' ? body.seo : {}) as Record<string, unknown>;
  const base = existing?.seo || emptySeo(kind, today);
  const keywords = Array.isArray(seoIn.keywords)
    ? seoIn.keywords.map((k) => str(k, 40)).filter(Boolean).slice(0, 16)
    : str(seoIn.keywords, 400).split(',').map((k) => k.trim()).filter(Boolean).slice(0, 16);
  const schema = SCHEMA_TYPES.includes(seoIn.schemaType as SchemaType) ? (seoIn.schemaType as SchemaType) : base.schemaType;
  const keyFacts = Array.isArray(seoIn.keyFacts)
    ? seoIn.keyFacts.slice(0, 16).map((f) => ({ label: str((f as Keyish).label, 80), value: str((f as Keyish).value, 240) })).filter((f) => f.label || f.value)
    : [];
  const faqs = Array.isArray(seoIn.faqs)
    ? seoIn.faqs.slice(0, 20).map((f) => ({ question: str((f as Keyish).question, 220), answer: rawText((f as Keyish).answer, 1200) })).filter((f) => f.question || f.answer)
    : [];
  const mentions = Array.isArray(seoIn.mentions)
    ? seoIn.mentions.map((m) => str(m, 60)).filter(Boolean).slice(0, 12)
    : str(seoIn.mentions, 400).split(',').map((m) => m.trim()).filter(Boolean).slice(0, 12);

  const blocks = Array.isArray(body.blocks) ? body.blocks.map(cleanBlock).filter((b): b is CmsBlock => Boolean(b)).slice(0, 200) : [];
  const previous = new Set(existing?.previousSlugs || []);
  if (existing && existing.slug !== slug) previous.add(existing.slug);

  const doc: CmsDocument = {
    id: existing?.id || (str(body.id, 40).match(/^cms_[a-z0-9_]+$/) ? str(body.id, 40) : newId()),
    kind,
    slug,
    status,
    title,
    pageTitle: str(body.pageTitle, 180) || undefined,
    section,
    sectionTitle: kind === 'blog' ? 'Blog' : sections[section],
    summary: rawText(body.summary, 500),
    blocks,
    seo: {
      metaTitle: str(seoIn.metaTitle, 80) || title,
      metaDescription: str(seoIn.metaDescription, 200),
      keywords,
      canonicalPath: `/${slug}`,
      ogImage: cleanHref(str(seoIn.ogImage, 400)),
      noIndex: Boolean(seoIn.noIndex),
      schemaType: schema,
      speakable: seoIn.speakable !== false,
      llmSummary: rawText(seoIn.llmSummary, 1200),
      primaryQuestion: str(seoIn.primaryQuestion, 220),
      keyFacts,
      faqs,
      author: str(seoIn.author, 120) || 'QIS College of Engineering & Technology',
      datePublished: /^\d{4}-\d{2}-\d{2}$/.test(str(seoIn.datePublished, 10)) ? str(seoIn.datePublished, 10) : existing?.seo.datePublished || (status === 'published' ? today : ''),
      dateModified: today,
      mentions,
    },
    coverImage: cleanHref(str(body.coverImage, 400)),
    coverAlt: str(body.coverAlt, 240),
    featured: Boolean(body.featured),
    showInNav: Boolean(body.showInNav),
    source: existing?.source || (body.source === 'override' ? 'override' : 'cms'),
    legacy: str(body.legacy, 400) || existing?.legacy || undefined,
    department: str(body.department, 40) || existing?.department || undefined,
    isDepartmentHome: Boolean(body.isDepartmentHome ?? existing?.isDepartmentHome),
    previousSlugs: [...previous].slice(-8),
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    createdBy: existing?.createdBy || user,
    updatedBy: user,
  };
  if (status === 'published' && !doc.seo.datePublished) doc.seo.datePublished = today;
  if (doc.coverImage && !doc.coverAlt) throw new CmsError('Cover images need alt text — describe what the photo shows.');
  return doc;
}

type Keyish = { label?: unknown; value?: unknown; question?: unknown; answer?: unknown };

export function albumSlug(title: string) {
  return slugify(title) || 'album';
}
