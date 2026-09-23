import { notFound } from 'next/navigation';
import PageEditor from '@/components/admin/PageEditor';
import { blankDocument, draftFromStatic } from '@/lib/cms/public';
import { getDocument, getBySlug, readSections } from '@/lib/cms/store';
import { getPage } from '@/lib/content';
import type { CmsKind } from '@/lib/cms/types';

export const dynamic = 'force-dynamic';

export default async function EditPage({ searchParams }: { searchParams: { id?: string; slug?: string; kind?: string } }) {
  const sections = readSections();
  const kind: CmsKind = searchParams.kind === 'blog' ? 'blog' : 'page';
  let initial = blankDocument(kind);
  let hasStaticOriginal = false;

  if (searchParams.id) {
    const doc = await getDocument(searchParams.id);
    if (!doc) notFound();
    initial = doc;
    hasStaticOriginal = Boolean(getPage(doc.slug));
  } else if (searchParams.slug) {
    const slug = decodeURIComponent(searchParams.slug);
    const existing = await getBySlug(slug);
    if (existing) {
      initial = existing;
      hasStaticOriginal = Boolean(getPage(slug));
    } else {
      const page = getPage(slug);
      if (!page) notFound();
      initial = draftFromStatic(page);
      hasStaticOriginal = true;
    }
  }

  return <PageEditor initial={initial} sections={sections} hasStaticOriginal={hasStaticOriginal} />;
}
