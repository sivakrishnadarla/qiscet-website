/** CMS documents. Structured for answer engines (AEO) and generative engines (GEO). */

export type CmsRole = 'admin' | 'staff';
export type CmsStatus = 'draft' | 'published';
export type CmsKind = 'page' | 'blog';
export type SchemaType =
  | 'WebPage'
  | 'AboutPage'
  | 'Article'
  | 'BlogPosting'
  | 'NewsArticle'
  | 'FAQPage'
  | 'Course'
  | 'Event';

export type KeyFact = { label: string; value: string };
export type FaqItem = { question: string; answer: string };
export type CmsLink = { label: string; href: string };

/** Loose block so institutional pages keep links, images and colspan when edited. */
export type CmsBlock = {
  type: string;
  level?: number;
  text?: string;
  ordered?: boolean;
  items?: { text: string; links?: CmsLink[]; images?: string[] }[];
  rows?: { text: string; links?: CmsLink[]; images?: string[]; colspan?: number }[][];
  src?: string;
  alt?: string;
  href?: string;
  label?: string;
  images?: { src: string; alt: string; caption?: string }[];
  kind?: string;
  [key: string]: unknown;
};

export type CmsSeo = {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalPath: string;
  ogImage: string;
  noIndex: boolean;
  schemaType: SchemaType;
  speakable: boolean;
  /** 40–80 word citeable answer. Shown first on the page and in llms.txt. */
  llmSummary: string;
  /** The question this page exists to answer. */
  primaryQuestion: string;
  keyFacts: KeyFact[];
  faqs: FaqItem[];
  author: string;
  datePublished: string;
  dateModified: string;
  /** Named entities an answer engine should associate with this page. */
  mentions: string[];
};

export type CmsDocument = {
  id: string;
  kind: CmsKind;
  slug: string;
  status: CmsStatus;
  title: string;
  pageTitle?: string;
  section: string;
  sectionTitle: string;
  summary: string;
  blocks: CmsBlock[];
  seo: CmsSeo;
  coverImage: string;
  coverAlt: string;
  featured: boolean;
  showInNav: boolean;
  source: 'cms' | 'override';
  legacy?: string;
  department?: string;
  isDepartmentHome?: boolean;
  previousSlugs: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

export type AlbumImage = { id: string; src: string; alt: string; caption: string };

export type CmsAlbum = {
  id: string;
  title: string;
  slug: string;
  description: string;
  images: AlbumImage[];
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
};

export type MediaRecord = {
  id: string;
  filename: string;
  mime: string;
  alt: string;
  /** Public URL. Always /media/:id so new uploads work without a rebuild. */
  src: string;
  /** On-disk path under public/, file mode only. */
  file?: string;
  bytes: number;
  createdAt: string;
  createdBy: string;
};

export const SCHEMA_TYPES: SchemaType[] = [
  'WebPage',
  'AboutPage',
  'Article',
  'BlogPosting',
  'NewsArticle',
  'FAQPage',
  'Course',
  'Event',
];

export const BLOCK_TYPES = [
  'heading',
  'paragraph',
  'list',
  'table',
  'image',
  'gallery',
  'video',
  'map',
  'embed',
  'document',
  'link',
  'callout',
  'legacy-form',
] as const;

export function emptySeo(kind: CmsKind, today: string): CmsSeo {
  return {
    metaTitle: '',
    metaDescription: '',
    keywords: ['QISCET', 'Ongole'],
    canonicalPath: '',
    ogImage: '',
    noIndex: false,
    schemaType: kind === 'blog' ? 'BlogPosting' : 'WebPage',
    speakable: true,
    llmSummary: '',
    primaryQuestion: '',
    keyFacts: [
      { label: '', value: '' },
      { label: '', value: '' },
    ],
    faqs: [
      { question: '', answer: '' },
      { question: '', answer: '' },
    ],
    author: 'QIS College of Engineering & Technology',
    datePublished: today,
    dateModified: today,
    mentions: ['QISCET', 'Ongole', 'Prakasam District'],
  };
}
