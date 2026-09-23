import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { publishedDocuments } from '@/lib/cms/public';

/** Shown only after staff publish a blog post, so the homepage stays unchanged until then. */
export default async function LatestPosts() {
  const posts = (await publishedDocuments('blog').catch(() => [])).slice(0, 3);
  if (!posts.length) return null;
  return (
    <section className="border-y border-navy-100 bg-cream">
      <div className="container-x py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">From the college</p>
            <h2 className="mt-2 text-2xl font-extrabold">Latest posts</h2>
          </div>
          <Link href="/blog" className="text-sm font-bold text-navy-800 underline decoration-saffron-400 underline-offset-4">All posts <ArrowRight className="inline h-4 w-4" /></Link>
        </div>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {posts.map((p) => (
            <li key={p.id}>
              <Link href={'/' + p.slug} className="card block h-full p-5 hover:border-saffron-300">
                <p className="text-[11px] font-bold uppercase tracking-wider text-saffron-600">{p.seo.datePublished || 'Blog'}</p>
                <h3 className="mt-1 font-display text-lg font-extrabold text-navy-900">{p.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink-soft">{p.seo.llmSummary || p.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
