import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, ExternalLink } from 'lucide-react';
import PageHero from '@/components/ui/PageHero';
import { buildMetadata } from '@/lib/seo';
import { announcements, newsItems } from '@/data/site';
import { getPage } from '@/lib/content';
import { publishedDocuments } from '@/lib/cms/public';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildMetadata({
  title: 'News & Events',
  description: 'Announcements, conferences, hackathons and newsletters from QIS College of Engineering & Technology, Ongole.',
  path: '/news',
});

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default async function NewsPage() {
  const posts = await publishedDocuments('blog');
  const letters = getPage('academics/newsletters');
  const letterItems = letters?.blocks.find((b) => b.type === 'list' && b.type === 'list') ;
  const links = letterItems && letterItems.type === 'list' ? letterItems.items.flatMap((i) => i.links || []).slice(0, 8) : [];

  return (
    <>
      <PageHero title="News & events" subtitle="What the campus is hosting, publishing and celebrating." crumbs={[{ name: 'News', href: '/news' }]} image="/images/images/sih_2025_s.jpg" />
      <section className="container-x grid gap-10 py-12 lg:grid-cols-[1.4fr_0.8fr]">
        <ul className="space-y-5">
          {posts.map((p) => (
            <li key={p.id}>
              <a href={'/' + p.slug} className="group grid gap-4 rounded-2xl border border-navy-100 bg-white p-3 shadow-card transition hover:border-saffron-300 sm:grid-cols-[180px_1fr]">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-navy-50 sm:aspect-auto sm:h-full">
                  {p.coverImage ? <Image src={p.coverImage} alt={p.coverAlt || ''} fill sizes="180px" className="object-cover" unoptimized /> : null}
                </div>
                <div className="py-1 pr-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-saffron-600">{p.featured ? 'Featured' : 'Blog'}</p>
                  <h2 className="mt-1 font-display text-lg font-extrabold text-navy-900 group-hover:text-saffron-600">{p.title}</h2>
                  <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted"><CalendarDays className="h-3.5 w-3.5" /> {fmt(p.seo.datePublished || p.updatedAt)}</p>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">{p.seo.llmSummary || p.seo.metaDescription || p.summary}</p>
                </div>
              </a>
            </li>
          ))}
          {newsItems.map((n) => (
            <li key={n.title}>
              <a href={n.href} target={n.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="group grid gap-4 rounded-2xl border border-navy-100 bg-white p-3 shadow-card transition hover:border-saffron-300 sm:grid-cols-[180px_1fr]">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl sm:aspect-auto sm:h-full">
                  <Image src={n.image} alt="" fill sizes="180px" className="object-cover" />
                </div>
                <div className="py-1 pr-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-saffron-600">{n.tag}</p>
                  <h2 className="mt-1 font-display text-lg font-extrabold text-navy-900 group-hover:text-saffron-600">{n.title}</h2>
                  <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted"><CalendarDays className="h-3.5 w-3.5" /> {fmt(n.date)}</p>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">{n.text}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-navy-900 p-5 text-white">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-300">Notice board</p>
            <ul className="mt-3 divide-y divide-white/10">
              {announcements.map((a) => (
                <li key={a.text} className="py-3 text-sm">
                  <a href={a.href} className="hover:text-saffron-300" target={a.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{a.text}</a>
                </li>
              ))}
            </ul>
          </div>
          {links.length ? (
            <div className="rounded-2xl border border-navy-100 bg-white p-5">
              <p className="font-display font-extrabold text-navy-900">AIKYAM newsletter</p>
              <ul className="mt-3 space-y-2 text-sm">
                {links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1 text-navy-800 hover:text-saffron-600">
                      {l.label} <ExternalLink className="mt-1 h-3 w-3 shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>
              <Link href="/academics/newsletters" className="mt-3 inline-block text-sm font-semibold text-navy-800 underline decoration-saffron-400 underline-offset-4">All issues</Link>
            </div>
          ) : null}
        </aside>
      </section>
    </>
  );
}
