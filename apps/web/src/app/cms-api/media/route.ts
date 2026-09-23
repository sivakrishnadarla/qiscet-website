import { assertOrigin, fail, ok, requireUser } from '@/lib/cms/http';
import { CmsError } from '@/lib/cms/errors';
import { addMedia, listAlbums, listMedia, saveAlbum } from '@/lib/cms/store';
import { newId } from '@/lib/cms/validate';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    requireUser();
    return ok({ media: await listMedia(80) });
  } catch (e) {
    return fail(e);
  }
}

export async function POST(req: Request) {
  try {
    assertOrigin(req);
    const session = requireUser();
    const form = await req.formData();
    const file = form.get('file');
    const alt = String(form.get('alt') || '').trim();
    const caption = String(form.get('caption') || '').trim();
    const albumId = String(form.get('albumId') || '');
    if (!(file instanceof File)) throw new CmsError('Choose an image to upload.');
    if (!alt) throw new CmsError('Alt text is required. Describe the photograph in a short sentence.');
    const buffer = Buffer.from(await file.arrayBuffer());
    const rec = await addMedia({
      id: newId('med'),
      filename: file.name || 'photo.jpg',
      mime: file.type,
      alt,
      buffer,
      createdBy: session.user,
    });
    if (albumId) {
      const albums = await listAlbums();
      const album = albums.find((a) => a.id === albumId);
      if (album) {
        album.images.push({ id: rec.id, src: rec.src, alt: rec.alt, caption });
        album.updatedAt = new Date().toISOString();
        album.updatedBy = session.user;
        await saveAlbum(album);
      }
    }
    return ok({ media: rec }, 201);
  } catch (e) {
    return fail(e);
  }
}
