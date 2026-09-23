import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import ContentPageView from '@/components/content/ContentPageView';
import { COOKIE, readSession } from '@/lib/cms/auth';
import { getPageResolved } from '@/lib/cms/public';
import { buildMetadata } from '@/lib/seo';
import { site } from '@/data/site';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

type Props = { params: { slug: string }; searchParams: { preview?: string } };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const preview = searchParams.preview === '1' && Boolean(readSession(cookies().get(COOKIE)?.value));
  const page = await getPageResolved(`blog/${params.slug}`, { preview });
  if (!page) return { title: 'Not found' };
  return buildMetadata({
    title: page.aeo?.metaTitle || page.title,
    description: page.aeo?.metaDescription || page.summary || `${page.title} — ${site.shortName}, Ongole.`,
    path: '/blog/' + params.slug,
    image: page.coverImage || page.aeo?.ogImage,
    keywords: page.aeo?.keywords,
    noIndex: Boolean(page.aeo?.noIndex) || preview,
    type: 'article',
  });
}

export default async function BlogPost({ params, searchParams }: Props) {
  const preview = searchParams.preview === '1' && Boolean(readSession(cookies().get(COOKIE)?.value));
  const page = await getPageResolved(`blog/${params.slug}`, { preview });
  if (!page) notFound();
  return <ContentPageView page={page} preview={preview} />;
}
