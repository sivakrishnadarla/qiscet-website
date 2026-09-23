import { fail, ok, requireUser } from '@/lib/cms/http';
import { listAlbums, listDocuments, storageMode } from '@/lib/cms/store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    requireUser();
    const documents = await listDocuments();
    const albums = await listAlbums();
    return ok({
      exportedAt: new Date().toISOString(),
      storage: storageMode(),
      documents,
      albums,
    });
  } catch (e) {
    return fail(e);
  }
}
