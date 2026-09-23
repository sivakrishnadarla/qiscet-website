import GalleryManager from '@/components/admin/GalleryManager';
import { listAlbums } from '@/lib/cms/store';

export const dynamic = 'force-dynamic';

export default async function GalleryAdmin() {
  const albums = await listAlbums().catch(() => []);
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-600">Gallery</p>
      <h1 className="font-display text-3xl font-extrabold text-navy-900">Photo gallery</h1>
      <p className="mt-2 mb-5 max-w-2xl text-sm text-ink-soft">Albums you create are added to the public photo gallery. Existing campus, press, library and hackathon photographs stay in place.</p>
      <GalleryManager initial={albums} />
    </div>
  );
}
