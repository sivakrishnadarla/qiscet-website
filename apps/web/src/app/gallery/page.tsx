import type { Metadata } from 'next';
import PageHero from '@/components/ui/PageHero';
import Gallery from '@/components/content/Gallery';
import JsonLd from '@/components/seo/JsonLd';
import { albumJsonLd } from '@/lib/cms/aeo';
import { galleryAlbums } from '@/lib/cms/public';
import { buildMetadata } from '@/lib/seo';
import { getGalleries } from '@/lib/galleries';
import { SITE_URL } from '@/data/site';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildMetadata({
  title: 'Photo Gallery',
  description: 'Photographs of the QISCET campus, QIS FEST, Smart India Hackathon, the central library, sports and press coverage. Ongole, Andhra Pradesh.',
  path: '/gallery',
});

export default async function GalleryPage() {
  const uploaded = await galleryAlbums();
  const groups = [
    ...uploaded.map((a) => ({ id: a.slug || a.id, title: a.title, description: a.description, images: a.images.map((img) => ({ src: img.src, alt: img.alt || img.caption || a.title })) })),
    ...getGalleries().map((g) => ({ ...g, description: '' })),
  ];
  return (
    <>
      {uploaded.map((a) => (
        <JsonLd key={a.id} data={albumJsonLd(a.title, a.description, a.images, SITE_URL, '/gallery#' + (a.slug || a.id))} />
      ))}
      <PageHero title="Photo gallery" subtitle="Campus, hackathons, the library, sports and the press — a look at life at QIS College of Engineering & Technology." crumbs={[{ name: 'Gallery', href: '/gallery' }]} image="/images/images/qiscetgal_2.jpg" />
      <section className="container-x py-12">
        <nav className="mb-8 flex flex-wrap gap-2" aria-label="Gallery sections">
          {groups.map((g) => (
            <a key={g.id} href={`#${g.id}`} className="rounded-full border border-navy-100 px-3 py-1.5 text-sm font-semibold text-navy-800 hover:border-saffron-400">{g.title}</a>
          ))}
        </nav>
        {groups.map((g) => (
          <div key={g.id} id={g.id} className="scroll-mt-28">
            <h2 className="text-2xl font-extrabold">{g.title}</h2>
            {g.description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-soft">{g.description}</p> : null}
            <Gallery images={g.images} columns={4} />
          </div>
        ))}
      </section>
    </>
  );
}
