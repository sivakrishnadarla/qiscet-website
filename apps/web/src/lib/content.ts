import fs from 'node:fs';
import path from 'node:path';
import 'server-only';

export type Link = { label: string; href: string };
export type ListItem = { text: string; links?: Link[]; images?: string[] };
export type Cell = { text: string; links?: Link[]; images?: string[]; colspan?: number };
export type Block =
  | { type: 'heading'; level: number; text: string; links?: Link[] }
  | { type: 'paragraph'; text: string; links?: Link[] }
  | { type: 'list'; ordered: boolean; items: ListItem[] }
  | { type: 'table'; rows: Cell[][] }
  | { type: 'image'; src: string; alt: string; href?: string }
  | { type: 'gallery'; images: { src: string; alt: string }[] }
  | { type: 'video'; src: string }
  | { type: 'map'; src: string }
  | { type: 'embed'; src: string; kind?: string }
  | { type: 'document'; href: string; label: string }
  | { type: 'link'; label: string; href: string }
  | { type: 'callout'; text: string }
  | { type: 'legacy-form' };

export type ContentPage = {
  slug: string;
  section: string;
  sectionTitle: string;
  title: string;
  pageTitle?: string;
  legacy: string;
  summary: string | null;
  blocks: Block[];
  department?: string;
  isDepartmentHome?: boolean;
  coverImage?: string;
  coverAlt?: string;
  /** Present on pages created or edited in the staff CMS. */
  aeo?: {
    primaryQuestion?: string;
    llmSummary?: string;
    keyFacts?: { label: string; value: string }[];
    faqs?: { question: string; answer: string }[];
    author?: string;
    datePublished?: string;
    dateModified?: string;
    schemaType?: string;
    speakable?: boolean;
    keywords?: string[];
    ogImage?: string;
    noIndex?: boolean;
    metaTitle?: string;
    metaDescription?: string;
    mentions?: string[];
  };
};

export type Department = {
  slug: string;
  code: string;
  name: string;
  short: string;
  legacy: string;
  hod: null | {
    name?: string; designation?: string; qualification?: string; email?: string; phone?: string;
    interests?: string; experience?: string; profile?: string; photo?: string | null; resume?: string | null;
  };
  courses: { course: string; intake: string }[];
  intro: string | null;
  news: string;
  subpages: { label: string; slug: string }[];
};

export type PageIndexEntry = { slug: string; section: string; title: string; summary: string | null };

const CONTENT_DIR = path.join(process.cwd(), 'content');

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8')) as T;
}

let _index: PageIndexEntry[] | null = null;
export function getPageIndex(): PageIndexEntry[] {
  if (!_index) _index = readJson<PageIndexEntry[]>('pages-index.json');
  return _index;
}

export function getPage(slug: string): ContentPage | null {
  const file = path.join(CONTENT_DIR, 'pages', slug.replace(/^\/+|\/+$/g, '').replace(/\//g, '__') + '.json');
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8')) as ContentPage;
}

let _depts: Department[] | null = null;
export function getDepartments(): Department[] {
  if (!_depts) _depts = readJson<Department[]>('departments.json');
  return _depts;
}

export function getDepartment(slug: string): Department | undefined {
  return getDepartments().find((d) => d.slug === slug);
}

export function getPagesBySection(section: string): PageIndexEntry[] {
  return getPageIndex().filter((p) => p.section === section);
}

/** Plain-text of a page – used for meta descriptions & llms.txt */
export function blocksToText(blocks: Block[], max = 5000): string {
  const parts: string[] = [];
  for (const b of blocks) {
    if (b.type === 'heading' || b.type === 'paragraph') parts.push(b.text);
    else if (b.type === 'list') parts.push(b.items.map((i) => `• ${i.text}`).join('\n'));
    else if (b.type === 'table') parts.push(b.rows.map((r) => r.map((c) => c.text).join(' | ')).join('\n'));
    if (parts.join('\n').length > max) break;
  }
  return parts.join('\n').slice(0, max);
}

export function describe(page: ContentPage, fallback: string): string {
  const s = page.summary || blocksToText(page.blocks, 300).replace(/\s+/g, ' ').trim();
  const text = s && s.length > 40 ? s : fallback;
  return text.length > 158 ? text.slice(0, 155).replace(/\s+\S*$/, '') + '…' : text;
}
