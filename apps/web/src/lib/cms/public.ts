import 'server-only';
import type { Block, ContentPage, PageIndexEntry } from '@/lib/content';
import { getPage, getPageIndex } from '@/lib/content';
import { blocksToPlain } from './aeo';
import { findRedirect, getBySlug, listAlbums, listDocuments } from './store';
import type { CmsDocument, CmsKind } from './types';
import { emptySeo } from './types';

export function cmsToContentPage(doc: CmsDocument): ContentPage & { coverImage?: string } {
  return {
    slug: doc.slug,
    section: doc.section,
    sectionTitle: doc.sectionTitle,
    title: doc.seo.metaTitle || doc.title,
    pageTitle: doc.pageTitle || doc.title,
    legacy: doc.legacy || '',
    summary: doc.seo.metaDescription || doc.summary || doc.seo.llmSummary || null,
    blocks: doc.blocks as unknown as Block[],
    department: doc.department,
    isDepartmentHome: doc.isDepartmentHome,
    coverImage: doc.coverImage || doc.seo.ogImage || undefined,
    coverAlt: doc.coverAlt || doc.title,
    aeo: {
      primaryQuestion: doc.seo.primaryQuestion,
      llmSummary: doc.seo.llmSummary,
      keyFacts: doc.seo.keyFacts.filter((f) => f.label && f.value),
      faqs: doc.seo.faqs.filter((f) => f.question && f.answer),
      author: doc.seo.author,
      datePublished: doc.seo.datePublished,
      dateModified: doc.seo.dateModified,
      schemaType: doc.seo.schemaType,
      speakable: doc.seo.speakable,
      keywords: doc.seo.keywords,
      ogImage: doc.seo.ogImage || doc.coverImage,
      noIndex: doc.seo.noIndex,
      metaTitle: doc.seo.metaTitle,
      metaDescription: doc.seo.metaDescription,
      mentions: doc.seo.mentions,
    },
  };
}

export async function getPageResolved(slug: string, opts?: { preview?: boolean }): Promise<ContentPage | null> {
  const clean = slug.replace(/^\/+|\/+$/g, '');
  try {
    const cms = await getBySlug(clean);
    if (cms && (cms.status === 'published' || (opts?.preview && cms.status === 'draft'))) {
      return cmsToContentPage(cms);
    }
  } catch {
    /* CMS store unavailable — fall back to committed JSON */
  }
  return getPage(clean);
}

export async function redirectFor(slug: string) {
  try {
    return await findRedirect(slug);
  } catch {
    return null;
  }
}

export async function publishedDocuments(kind?: CmsKind): Promise<CmsDocument[]> {
  try {
    const all = await listDocuments();
    return all.filter((d) => d.status === 'published' && (!kind || d.kind === kind));
  } catch {
    return [];
  }
}

export async function getPageIndexResolved(): Promise<PageIndexEntry[]> {
  const base = getPageIndex().map((p) => ({ ...p }));
  const map = new Map(base.map((p) => [p.slug, p]));
  const cms = await publishedDocuments();
  for (const d of cms) {
    if (d.kind !== 'page' && d.kind !== 'blog') continue;
    map.set(d.slug, {
      slug: d.slug,
      section: d.section,
      title: d.title,
      summary: d.seo.metaDescription || d.summary || d.seo.llmSummary || null,
    });
  }
  return [...map.values()];
}

export async function getSearchIndex() {
  const pages = await getPageIndexResolved();
  let extras: CmsDocument[] = [];
  try {
    extras = await listDocuments();
  } catch {
    extras = [];
  }
  const bySlug = new Map(extras.filter((d) => d.status === 'published').map((d) => [d.slug, d]));
  return pages.map((p) => {
    const d = bySlug.get(p.slug);
    const faq = d ? d.seo.faqs.map((f) => `${f.question} ${f.answer}`).join(' ') : '';
    const answer = d?.seo.llmSummary || '';
    return {
      title: p.title,
      href: '/' + p.slug,
      section: p.section,
      summary: [p.summary || '', answer, faq].filter(Boolean).join(' ').slice(0, 500),
    };
  });
}

export async function sectionExtras(section: string, existing: { href: string }[]) {
  const have = new Set(existing.map((l) => l.href));
  const docs = (await publishedDocuments('page')).filter((d) => d.section === section && d.showInNav);
  return docs
    .filter((d) => !have.has('/' + d.slug))
    .map((d) => ({ label: d.pageTitle || d.title, href: '/' + d.slug }));
}

export async function galleryAlbums() {
  try {
    return (await listAlbums()).filter((a) => a.images.length);
  } catch {
    return [];
  }
}

export function draftFromStatic(page: ContentPage, user = 'staff'): CmsDocument {
  const today = new Date().toISOString().slice(0, 10);
  const summary = page.summary || blocksToPlain(page.blocks as unknown as CmsDocument['blocks'], 320);
  return {
    id: '',
    kind: 'page',
    slug: page.slug,
    status: 'published',
    title: page.title,
    pageTitle: page.pageTitle,
    section: page.section,
    sectionTitle: page.sectionTitle,
    summary: summary.slice(0, 500),
    blocks: page.blocks as unknown as CmsDocument['blocks'],
    seo: {
      ...emptySeo(page.isDepartmentHome ? 'page' : 'page', today),
      schemaType: page.isDepartmentHome ? 'Course' : 'WebPage',
      metaTitle: page.title.slice(0, 80),
      metaDescription: summary.slice(0, 165),
      llmSummary: '',
      primaryQuestion: '',
      keywords: [page.title, 'QISCET', 'Ongole', page.sectionTitle].filter(Boolean).slice(0, 8),
      mentions: ['QISCET', 'Ongole', page.sectionTitle].filter(Boolean),
    },
    coverImage: '',
    coverAlt: '',
    featured: false,
    showInNav: false,
    source: 'override',
    legacy: page.legacy,
    department: page.department,
    isDepartmentHome: page.isDepartmentHome,
    previousSlugs: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: user,
    updatedBy: user,
  };
}

export function blankDocument(kind: CmsKind): CmsDocument {
  const today = new Date().toISOString().slice(0, 10);
  const now = new Date().toISOString();
  return {
    id: '',
    kind,
    slug: kind === 'blog' ? 'blog/' : '',
    status: 'draft',
    title: '',
    section: kind === 'blog' ? 'blog' : 'about',
    sectionTitle: kind === 'blog' ? 'Blog' : 'About Us',
    summary: '',
    blocks: [{ type: 'paragraph', text: '' }],
    seo: emptySeo(kind, today),
    coverImage: '',
    coverAlt: '',
    featured: false,
    showInNav: kind === 'page',
    source: 'cms',
    previousSlugs: [],
    createdAt: now,
    updatedAt: now,
    createdBy: '',
    updatedBy: '',
  };
}
