import PagesTable, { type PageRow } from '@/components/admin/PagesTable';
import { listDocuments } from '@/lib/cms/store';

export const dynamic = 'force-dynamic';

export default async function BlogAdmin() {
  const docs = (await listDocuments().catch(() => [])).filter((d) => d.kind === 'blog');
  const rows: PageRow[] = docs.map((d) => ({
    title: d.title,
    slug: d.slug,
    section: 'blog',
    origin: 'cms',
    status: d.status === 'draft' ? 'draft' : 'published',
    id: d.id,
    updatedAt: d.updatedAt,
    kind: 'blog',
  }));
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-600">Blog</p>
      <h1 className="font-display text-3xl font-extrabold text-navy-900">Blog & news posts</h1>
      <p className="mt-2 mb-5 max-w-2xl text-sm text-ink-soft">Published posts appear on /blog and on the news page. Use BlogPosting or NewsArticle schema, a direct answer, and a dated byline.</p>
      <PagesTable rows={rows} kind="blog" />
    </div>
  );
}
