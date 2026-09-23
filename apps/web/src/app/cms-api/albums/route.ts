import { assertOrigin, fail, ok, requireUser, revalidateContent } from '@/lib/cms/http';
import { listAlbums, saveAlbum } from '@/lib/cms/store';
import { newId, slugify } from '@/lib/cms/validate';
import { CmsError } from '@/lib/cms/errors';
import type { CmsAlbum } from '@/lib/cms/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    requireUser();
    return ok({ albums: await listAlbums() });
  } catch (e) {
    return fail(e);
  }
}

export async function POST(req: Request) {
  try {
    assertOrigin(req);
    const session = requireUser();
    const body = (await req.json()) as { title?: string; description?: string };
    const title = String(body.title || '').trim().slice(0, 120);
    if (title.length < 2) throw new CmsError('Give the album a title.');
    const now = new Date().toISOString();
    const album: CmsAlbum = {
      id: newId('alb'),
      title,
      slug: slugify(title) || 'album',
      description: String(body.description || '').trim().slice(0, 600),
      images: [],
      createdAt: now,
      updatedAt: now,
      updatedBy: session.user,
    };
    await saveAlbum(album);
    revalidateContent('gallery');
    return ok({ album }, 201);
  } catch (e) {
    return fail(e);
  }
}
