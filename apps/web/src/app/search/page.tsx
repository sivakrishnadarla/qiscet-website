import type { Metadata } from 'next';
import SearchBox from '@/components/search/SearchBox';
import { getSearchIndex } from '@/lib/cms/public';
import { buildMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildMetadata({
  title: 'Search',
  description: 'Search pages of QIS College of Engineering & Technology — departments, admissions, facilities, placements and more.',
  path: '/search',
  noIndex: true,
});

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const index = await getSearchIndex();
  return (
    <section className="container-x py-12 md:py-16">
      <p className="eyebrow">Search</p>
      <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">Find a page</h1>
      <SearchBox index={index} initialQuery={searchParams.q || ''} />
    </section>
  );
}
