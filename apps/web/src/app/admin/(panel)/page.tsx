import Link from 'next/link';
import { listAlbums, listDocuments, storageMode } from '@/lib/cms/store';
import { getPageIndex } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const mode = storageMode();
  const docs = await listDocuments().catch(() => []);
  const albums = await listAlbums().catch(() => []);
  const pages = docs.filter((d) => d.kind === 'page');
  const blogs = docs.filter((d) => d.kind === 'blog');
  const photos = albums.reduce((n, a) => n + a.images.length, 0);
  const recent = [...docs].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-600">Dashboard</p>
        <h1 className="font-display text-3xl font-extrabold text-navy-900">Content desk</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-soft">
          Official pages stay in the site until you edit them. New pages and blog posts are written in an AEO / GEO format: one question, a citeable answer, key facts, FAQs and image alt text. That is what Google and AI assistants quote.
        </p>
      </div>

      <div className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${mode.writable ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-amber-200 bg-amber-50 text-amber-950'}`}>
        <p className="font-bold">{mode.writable ? `Storage: ${mode.driver}` : 'Edits cannot be saved on this server yet'}</p>
        <p className="mt-1">{mode.detail}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Official pages', value: getPageIndex().length, href: '/admin/pages' },
          { label: 'CMS pages', value: pages.length, href: '/admin/pages' },
          { label: 'Blog posts', value: blogs.length, href: '/admin/blog' },
          { label: 'Gallery photos', value: photos, href: '/admin/gallery' },
        ].map((c) => (
          <Link key={c.label} href={c.href} className="card p-4 hover:border-saffron-300">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">{c.label}</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-navy-900">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/admin/edit?kind=page" className="btn-primary">New page</Link>
        <Link href="/admin/edit?kind=blog" className="btn-secondary">New blog post</Link>
        <Link href="/admin/gallery" className="btn-outline">Upload photos</Link>
        <a href="/cms-api/export" className="btn-outline">Download backup</a>
      </div>

      <section className="card p-5">
        <h2 className="font-display text-lg font-extrabold text-navy-900">Recent edits</h2>
        {recent.length ? (
          <ul className="mt-3 divide-y divide-navy-100">
            {recent.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-semibold text-navy-900">{d.title}</p>
                  <p className="text-xs text-ink-muted">/{d.slug} · {d.status} · {d.updatedBy}</p>
                </div>
                <Link href={`/admin/edit?id=${d.id}`} className="text-sm font-bold text-navy-800 underline decoration-saffron-400">Open</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-ink-muted">No CMS edits yet. Open an official page to rewrite it, or start a blog post from the example draft.</p>
        )}
      </section>
    </div>
  );
}
