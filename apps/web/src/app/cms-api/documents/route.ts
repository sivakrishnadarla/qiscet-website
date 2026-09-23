import { aeoScore } from '@/lib/cms/aeo';
import { assertOrigin, fail, ok, requireUser, revalidateContent } from '@/lib/cms/http';
import { listDocuments, saveDocument, sectionMap } from '@/lib/cms/store';
import { normalizeDocument } from '@/lib/cms/validate';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    requireUser();
    const url = new URL(req.url);
    const kind = url.searchParams.get('kind');
    const docs = await listDocuments();
    const filtered = kind ? docs.filter((d) => d.kind === kind) : docs;
    return ok({ documents: filtered });
  } catch (e) {
    return fail(e);
  }
}

export async function POST(req: Request) {
  try {
    assertOrigin(req);
    const session = requireUser();
    const raw = await req.json();
    const doc = normalizeDocument(raw, null, session.user, sectionMap());
    if ((raw as { id?: string }).id) doc.id = doc.id; // id assigned in normalize
    const saved = await saveDocument(doc);
    revalidateContent(saved.slug);
    return ok({ document: saved, aeo: aeoScore(saved) }, 201);
  } catch (e) {
    return fail(e);
  }
}
