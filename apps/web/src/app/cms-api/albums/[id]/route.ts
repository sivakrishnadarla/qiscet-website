import { assertOrigin, fail, ok, requireUser, revalidateContent } from '@/lib/cms/http';
import { CmsError } from '@/lib/cms/errors';
import { deleteAlbum, listAlbums, saveAlbum } from '@/lib/cms/store';
import { cleanHref } from '@/lib/cms/validate';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Ctx = { params: { id: string } };

export async function PUT(req: Request, { params }: Ctx) {
  try {
    assertOrigin(req);
    const session = requireUser();
    const albums = await listAlbums();
    const current = albums.find((a) => a.id === params.id);
    if (!current) throw new CmsError('Album not found.', 404);
    const body = (await req.json()) as {
      title?: string;
      description?: string;
      images?: { id: string; src: string; alt: string; caption?: string }[];
    };
    const images = Array.isArray(body.images)
      ? body.images.slice(0, 200).map((img) => ({
          id: String(img.id || '').slice(0, 40),
          src: cleanHref(String(img.src || '')),
          alt: String(img.alt || '').trim().slice(0, 240),
          caption: String(img.caption || '').trim().slice(0, 240),
        })).filter((img) => img.id && img.src && img.alt)
      : current.images;
    const saved = await saveAlbum({
      ...current,
      title: String(body.title || current.title).trim().slice(0, 120),
      description: String(body.description ?? current.description).trim().slice(0, 600),
      images,
      updatedAt: new Date().toISOString(),
      updatedBy: session.user,
    });
    revalidateContent('gallery');
    return ok({ album: saved });
  } catch (e) {
    return fail(e);
  }
}

export async function DELETE(req: Request, { params }: Ctx) {
  try {
    assertOrigin(req);
    requireUser();
    await deleteAlbum(params.id);
    revalidateContent('gallery');
    return ok({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
