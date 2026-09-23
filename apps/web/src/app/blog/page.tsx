import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import JsonLd from '@/components/seo/JsonLd';
import { publishedDocuments } from '@/lib/cms/public';
import { buildMetadata } from '@/lib/seo';
import { SITE_URL } from '@/data/site';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildMetadata({
  title: 'Blog',
  description: 'News, explainers and announcements from QIS College of Engineering & Technology, Ongole — written so the facts can be cited.',
  path: '/blog',
});

function fmt(d: string) {
  const date = new Date(d.length === 10 ? `${d}T00:00:00` : d);
  if (Number.isNaN(date.getTime())) return d;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function BlogIndex() {
  const posts = (await publishedDocuments('blog')).sort((a, b) => (b.seo.datePublished || b.updatedAt).localeCompare(a.seo.datePublished || a.updatedAt));
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'QISCET blog',
    url: `${SITE_URL}/blog`,
    blogPost: posts.slice(0, 20).map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${SITE_URL}/${p.slug}`,
      datePublished: p.seo.datePublished,
      description: p.seo.metaDescription || p.seo.llmSummary,
    })),
  };
  return (
    <>
      <JsonLd data={itemList} />
      <PageHero title="Blog" subtitle="Announcements and explainers from the college, written as direct answers." crumbs={[{ name: 'Blog', href: '/blog' }]} image="/images/images/sih_2025_s.jpg" />
      <section className="container-x py-12">
        {posts.length ? (
          <ul className="grid gap-5 md:grid-cols-2">
            {posts.map((p) => (
              <li key={p.id}>
                <Link href={'/' + p.slug} className="card block h-full overflow-hidden hover:border-saffron-300">
                  {p.coverImage ? (
                    <div className="relative aspect-[16/8]">
                      <Image src={p.coverImage} alt={p.coverAlt || ''} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" unoptimized />
                    </div>
                  ) : null}
                  <div className="p-5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-saffron-600">{p.seo.schemaType === 'NewsArticle' ? 'News' : 'Blog'}</p>
                    <h2 className="mt-1 font-display text-xl font-extrabold text-navy-900">{p.title}</h2>
                    {p.seo.datePublished ? <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted"><CalendarDays className="h-3.5 w-3.5" /> {fmt(p.seo.datePublished)}</p> : null}
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink-soft">{p.seo.llmSummary || p.seo.metaDescription || p.summary}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-dashed border-navy-200 bg-navy-50 p-6 text-sm text-ink-soft">Posts published by the college office will appear here. Campus notices are also on the news page.</p>
        )}
      </section>
    </>
  );
}
