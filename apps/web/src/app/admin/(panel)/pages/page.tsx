import PagesTable, { type PageRow } from '@/components/admin/PagesTable';
import { getPageIndex } from '@/lib/content';
import { listDocuments } from '@/lib/cms/store';

export const dynamic = 'force-dynamic';

export default async function PagesAdmin() {
  const cms = await listDocuments().catch(() => []);
  const bySlug = new Map(cms.filter((d) => d.kind === 'page').map((d) => [d.slug, d]));
  const rows: PageRow[] = getPageIndex().map((p) => {
    const edited = bySlug.get(p.slug);
    if (edited) {
      return {
        title: edited.title,
        slug: edited.slug,
        section: edited.section,
        origin: 'override' as const,
        status: edited.status === 'draft' ? 'draft' as const : 'published' as const,
        id: edited.id,
        updatedAt: edited.updatedAt,
        kind: 'page' as const,
      };
    }
    return { title: p.title, slug: p.slug, section: p.section, origin: 'institutional' as const, status: 'live' as const, kind: 'page' as const };
  });
  for (const d of cms.filter((x) => x.kind === 'page' && !getPageIndex().some((p) => p.slug === x.slug))) {
    rows.unshift({
      title: d.title,
      slug: d.slug,
      section: d.section,
      origin: 'cms',
      status: d.status === 'draft' ? 'draft' : 'published',
      id: d.id,
      updatedAt: d.updatedAt,
      kind: 'page',
    });
  }
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-600">Pages</p>
      <h1 className="font-display text-3xl font-extrabold text-navy-900">Pages</h1>
      <p className="mt-2 mb-5 max-w-2xl text-sm text-ink-soft">Edit an official page to create an override — the original file is kept and restored if you delete the override. New pages publish at the address you choose.</p>
      <PagesTable rows={rows} kind="page" />
    </div>
  );
}
