import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import ContentPageView from '@/components/content/ContentPageView';
import HubPage, { hubMeta } from '@/components/sections/HubPage';
import { COOKIE, readSession } from '@/lib/cms/auth';
import { getPageResolved, redirectFor } from '@/lib/cms/public';
import { describe } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { site } from '@/data/site';
import { hubCopy } from '@/data/hubs';

/** Routes owned by dedicated page.tsx files — never rendered here. */
const RESERVED = new Set([
  'apply', 'enquiry', 'contact', 'feedback', 'grievance', 'gallery', 'news', 'search', 'privacy-policy',
  'admissions/b-category-application', 'admin', 'blog',
]);

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

type Props = { params: { slug: string[] }; searchParams: { preview?: string } };

function isPreview(flag?: string) {
  return flag === '1' && Boolean(readSession(cookies().get(COOKIE)?.value));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const slug = params.slug.join('/');
  const preview = isPreview(searchParams.preview);
  const page = await getPageResolved(slug, { preview });
  if (page) {
    const aeo = page.aeo;
    return buildMetadata({
      title: aeo?.metaTitle || page.title,
      description: aeo?.metaDescription || describe(page, `${page.title} — ${site.name}, Ongole, Andhra Pradesh.`),
      path: '/' + slug,
      image: aeo?.ogImage || page.coverImage,
      keywords: aeo?.keywords || [page.title, site.shortName, 'Ongole', page.sectionTitle],
      noIndex: Boolean(aeo?.noIndex) || preview,
      type: aeo?.schemaType === 'Article' || aeo?.schemaType === 'BlogPosting' || aeo?.schemaType === 'NewsArticle' ? 'article' : 'website',
    });
  }
  if (params.slug.length === 1 && hubCopy[params.slug[0]]) {
    const h = hubMeta(params.slug[0]);
    return buildMetadata({ title: h.title, description: h.subtitle, path: '/' + params.slug[0] });
  }
  return { title: 'Not found' };
}

export default async function CatchAllPage({ params, searchParams }: Props) {
  const slug = params.slug.join('/');
  if (RESERVED.has(slug)) notFound();
  const preview = isPreview(searchParams.preview);
  const page = await getPageResolved(slug, { preview });
  if (page) return <ContentPageView page={page} preview={preview} />;
  const dest = await redirectFor(slug);
  if (dest && dest !== slug) redirect('/' + dest);
  if (params.slug.length === 1 && hubCopy[params.slug[0]]) return <HubPage section={params.slug[0]} />;
  notFound();
}
