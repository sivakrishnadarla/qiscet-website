import { assertOrigin, fail, ok, requireUser, revalidateContent } from '@/lib/cms/http';
import { deleteMedia } from '@/lib/cms/store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    assertOrigin(req);
    requireUser();
    await deleteMedia(params.id);
    revalidateContent('gallery');
    return ok({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
