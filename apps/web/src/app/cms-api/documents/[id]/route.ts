import { aeoScore } from '@/lib/cms/aeo';
import { CmsError } from '@/lib/cms/errors';
import { assertOrigin, fail, ok, requireUser, revalidateContent } from '@/lib/cms/http';
import { deleteDocument, getDocument, saveDocument, sectionMap } from '@/lib/cms/store';
import { normalizeDocument } from '@/lib/cms/validate';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Ctx = { params: { id: string } };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    requireUser();
    const doc = await getDocument(params.id);
    if (!doc) throw new CmsError('Page not found.', 404);
    return ok({ document: doc, aeo: aeoScore(doc) });
  } catch (e) {
    return fail(e);
  }
}

export async function PUT(req: Request, { params }: Ctx) {
  try {
    assertOrigin(req);
    const session = requireUser();
    const existing = await getDocument(params.id);
    if (!existing) throw new CmsError('Page not found.', 404);
    const raw = await req.json();
    const doc = normalizeDocument({ ...raw, id: params.id }, existing, session.user, sectionMap());
    doc.id = params.id;
    if (session.role === 'staff' && existing.source === 'override' && doc.status === 'draft') {
      /* staff may unpublish an override; the original JSON page shows again */
    }
    const saved = await saveDocument(doc);
    revalidateContent(existing.slug);
    revalidateContent(saved.slug);
    return ok({ document: saved, aeo: aeoScore(saved) });
  } catch (e) {
    return fail(e);
  }
}

export async function DELETE(req: Request, { params }: Ctx) {
  try {
    assertOrigin(req);
    const session = requireUser();
    const existing = await getDocument(params.id);
    if (!existing) throw new CmsError('Page not found.', 404);
    if (session.role !== 'admin' && existing.status === 'published' && existing.source === 'override') {
      throw new CmsError('Only an admin can remove a published edit of an official page. Unpublish it, or ask an admin.', 403);
    }
    await deleteDocument(params.id);
    revalidateContent(existing.slug);
    return ok({ ok: true, restored: existing.source === 'override' });
  } catch (e) {
    return fail(e);
  }
}
