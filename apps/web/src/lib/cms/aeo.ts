import type { CmsBlock, CmsDocument, SchemaType } from './types';

export function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export type AeoCheck = { id: string; label: string; hint: string; ok: boolean };

/** The publishing format staff are scored against. Visible in the editor. */
export function aeoScore(doc: Pick<CmsDocument, 'title' | 'seo' | 'blocks' | 'coverImage' | 'coverAlt'>): {
  score: number;
  total: number;
  checks: AeoCheck[];
} {
  const seo = doc.seo;
  const words = wordCount(seo.llmSummary || '');
  const facts = (seo.keyFacts || []).filter((f) => f.label.trim() && f.value.trim());
  const faqs = (seo.faqs || []).filter((f) => f.question.trim() && f.answer.trim());
  const titleLen = (seo.metaTitle || doc.title || '').trim().length;
  const descLen = (seo.metaDescription || '').trim().length;
  const hasH2 = (doc.blocks || []).some((b) => b.type === 'heading' && Number(b.level || 2) <= 2 && String(b.text || '').trim().length > 2);
  const imageOk = Boolean(
    (doc.coverImage && doc.coverAlt && doc.coverAlt.trim().length > 3) ||
      (doc.blocks || []).some((b) => {
        if (b.type === 'image') return Boolean(b.src && b.alt && String(b.alt).trim().length > 3);
        if (b.type === 'gallery') return (b.images || []).some((img) => img.src && img.alt && img.alt.trim().length > 3);
        return false;
      }),
  );

  const checks: AeoCheck[] = [
    {
      id: 'question',
      label: 'Primary question',
      hint: 'Write the exact question a student or parent would ask. One page, one question.',
      ok: (seo.primaryQuestion || '').trim().length >= 12 && (seo.primaryQuestion || '').includes('?'),
    },
    {
      id: 'answer',
      label: 'Direct answer, 40–90 words',
      hint: 'Facts first. Name QISCET and Ongole. This is what ChatGPT, Gemini and Google may quote.',
      ok: words >= 40 && words <= 90,
    },
    {
      id: 'title',
      label: 'Meta title, 45–65 characters',
      hint: 'Include the topic and QISCET or Ongole. No keyword stuffing.',
      ok: titleLen >= 45 && titleLen <= 65,
    },
    {
      id: 'desc',
      label: 'Meta description, 140–165 characters',
      hint: 'Same facts as the direct answer, written as a snippet.',
      ok: descLen >= 140 && descLen <= 165,
    },
    {
      id: 'h2',
      label: 'At least one H2',
      hint: 'Headings should be specific (“Hostel timings”, not “Details”).',
      ok: hasH2,
    },
    {
      id: 'facts',
      label: 'Two or more key facts',
      hint: 'Label and value, e.g. Counselling code / QISE. These become structured data.',
      ok: facts.length >= 2,
    },
    {
      id: 'faq',
      label: 'Two or more FAQs',
      hint: 'Each answer must stand alone if an AI quotes only that answer.',
      ok: faqs.length >= 2 && faqs.every((f) => wordCount(f.answer) >= 12),
    },
    {
      id: 'image',
      label: 'Image with a real alt text',
      hint: 'Describe the photo. Never use “image1” or leave alt blank.',
      ok: imageOk,
    },
    {
      id: 'author',
      label: 'Author and dates',
      hint: 'Answer engines trust dated, attributed pages. Update the date when facts change.',
      ok: Boolean((seo.author || '').trim() && (seo.datePublished || '').trim()),
    },
    {
      id: 'entities',
      label: 'Named entities',
      hint: 'QISCET, Ongole, the programme or office this page is about.',
      ok: (seo.mentions || []).map((m) => m.trim()).filter(Boolean).length >= 2,
    },
  ];
  return { score: checks.filter((c) => c.ok).length, total: checks.length, checks };
}

export function publicAeoJsonLd(input: {
  slug: string;
  title: string;
  description: string;
  coverImage?: string;
  kind?: string;
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
    metaTitle?: string;
    mentions?: string[];
  };
}, siteUrl: string) {
  const aeo = input.aeo || {};
  const fake = {
    slug: input.slug,
    title: input.title,
    kind: input.kind === 'blog' ? 'blog' : 'page',
    summary: input.description,
    coverImage: input.coverImage || '',
    updatedAt: aeo.dateModified || '',
    seo: {
      metaTitle: aeo.metaTitle || input.title,
      metaDescription: input.description,
      keywords: aeo.keywords || [],
      ogImage: aeo.ogImage || '',
      schemaType: (aeo.schemaType || (input.kind === 'blog' ? 'BlogPosting' : 'WebPage')) as SchemaType,
      speakable: aeo.speakable !== false,
      llmSummary: aeo.llmSummary || '',
      primaryQuestion: aeo.primaryQuestion || '',
      keyFacts: aeo.keyFacts || [],
      faqs: aeo.faqs || [],
      author: aeo.author || '',
      datePublished: aeo.datePublished || '',
      dateModified: aeo.dateModified || '',
      mentions: aeo.mentions || [],
      canonicalPath: '/' + input.slug,
      noIndex: false,
    },
  } as CmsDocument;
  return documentJsonLd(fake, siteUrl);
}

export function documentJsonLd(doc: CmsDocument, siteUrl: string) {
  const path = '/' + doc.slug.replace(/^\/+/, '');
  const url = `${siteUrl}${path}`;
  const description = doc.seo.metaDescription || doc.summary || doc.seo.llmSummary;
  const image = doc.seo.ogImage || doc.coverImage;
  const type: SchemaType = doc.seo.schemaType || (doc.kind === 'blog' ? 'BlogPosting' : 'WebPage');
  const page: Record<string, unknown> = {
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name: doc.seo.metaTitle || doc.title,
    headline: doc.title,
    description,
    inLanguage: 'en-IN',
    isPartOf: { '@id': `${siteUrl}/#website` },
    about: { '@id': `${siteUrl}/#organization` },
    publisher: { '@id': `${siteUrl}/#organization` },
    author: { '@type': 'Organization', name: doc.seo.author || 'QIS College of Engineering & Technology', url: siteUrl },
    mainEntityOfPage: url,
    dateModified: doc.seo.dateModified || doc.updatedAt,
  };
  if (doc.seo.datePublished) page.datePublished = doc.seo.datePublished;
  if (image) page.image = image.startsWith('http') ? image : `${siteUrl}${image}`;
  if (doc.seo.keywords.length) page.keywords = doc.seo.keywords.join(', ');
  if (doc.seo.speakable && (doc.seo.llmSummary || doc.seo.primaryQuestion)) {
    page.speakable = { '@type': 'SpeakableSpecification', cssSelector: ['.aeo-answer', 'h1'] };
  }
  const mentions = doc.seo.mentions.map((m) => m.trim()).filter(Boolean);
  if (mentions.length) page.mentions = mentions.map((name) => ({ '@type': 'Thing', name }));
  const facts = doc.seo.keyFacts.filter((f) => f.label.trim() && f.value.trim());
  if (facts.length) {
    page.additionalProperty = facts.map((f) => ({ '@type': 'PropertyValue', name: f.label, value: f.value }));
  }
  const graph: Record<string, unknown>[] = [page];
  const faqs = doc.seo.faqs.filter((f) => f.question.trim() && f.answer.trim());
  if (faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      url,
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    });
  }
  if (doc.seo.primaryQuestion && doc.seo.llmSummary) {
    graph.push({
      '@type': 'QAPage',
      '@id': `${url}#qa`,
      mainEntity: {
        '@type': 'Question',
        name: doc.seo.primaryQuestion,
        text: doc.seo.primaryQuestion,
        acceptedAnswer: {
          '@type': 'Answer',
          text: doc.seo.llmSummary,
          url,
        },
      },
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function albumJsonLd(title: string, description: string, images: { src: string; alt: string }[], siteUrl: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: title,
    description,
    url: `${siteUrl}${path}`,
    image: images.slice(0, 24).map((img) => ({
      '@type': 'ImageObject',
      contentUrl: img.src.startsWith('http') ? img.src : `${siteUrl}${img.src}`,
      caption: img.alt,
      description: img.alt,
    })),
  };
}

export function blocksToPlain(blocks: CmsBlock[], max = 800) {
  const parts: string[] = [];
  for (const b of blocks) {
    if (b.type === 'heading' || b.type === 'paragraph' || b.type === 'callout') parts.push(String(b.text || ''));
    else if (b.type === 'list') parts.push((b.items || []).map((i) => i.text).join(' '));
    if (parts.join(' ').length > max) break;
  }
  return parts.join(' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

